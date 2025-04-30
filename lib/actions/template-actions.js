'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';
import { TemplateSchema } from '../utils/validators';

export async function createTemplate(formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      topic: formData.get('topic'),
      tags: formData.get('tags') || '',
      isPublic: formData.get('isPublic') === 'true',
      allowedUsers: formData.get('allowedUsers') || '',
      image: formData.get('image') || '',
    };

    try {
      const validatedData = TemplateSchema.parse(rawData);
      const questions = JSON.parse(formData.get('questions') || '[]');

      const template = await prisma.$transaction(async (tx) => {
        const template = await tx.template.create({
          data: {
            ...validatedData,
            authorId: session.user.id,
            allowedUsers: {
              create: validatedData.allowedUsers.map((email) => ({
                email,
              })),
            },
          },
        });

        if (questions.length > 0) {
          await tx.question.createMany({
            data: questions.map((q, index) => ({
              text: q.text,
              type: q.type,
              required: q.required,
              order: index,
              templateId: template.id,
            })),
          });
        }

        return template;
      });

      revalidatePath('/templates');
      return { success: 'Template created successfully', data: template };
    } catch (validationError) {
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      return { error: 'Invalid template data' };
    }
  } catch (error) {
    return { error: 'Failed to create template' };
  }
}

async function buildTemplateQuery(options = {}) {
  const session = await auth();
  const { query, topic, tag, filter, status } = options;

  // For search queries
  if (query && !filter) {
    let where =
      session?.user?.role === 'ADMIN'
        ? {}
        : { OR: [{ authorId: session?.user?.id }, { isPublic: true }] }; // Allow users to search both public templates and their own

    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { tags: { hasSome: [query] } },
      { topic: { contains: query, mode: 'insensitive' } },
      {
        author: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
    ];

    if (topic) where.topic = topic;
    if (tag) where.tags = { hasSome: [tag] };
    if (status) where.isPublic = status === 'public';

    return { where };
  }

  // Start with a basic where clause based on user role
  let where =
    session?.user?.role === 'ADMIN'
      ? {}
      : { OR: [{ authorId: session?.user?.id }, { isPublic: true }] };

  // Apply view filter
  if (filter === 'my') {
    where = { authorId: session?.user?.id };
  } else if (filter === 'other') {
    where = {
      NOT: { authorId: session?.user?.id },
      isPublic: true,
    };
  }

  // Apply topic filter
  if (topic) {
    where = {
      ...where,
      topic: topic,
    };
  }

  // Apply tag filter
  if (tag) {
    where = {
      ...where,
      tags: { hasSome: [tag] },
    };
  }

  // Apply status filter - THIS IS THE KEY FIX
  if (status) {
    // If we already have a complex query with "my" filter
    if (filter === 'my') {
      // For "my" templates, we can directly filter by isPublic
      where.isPublic = status === 'public';
    }
    // If we have "other" filter (which already forces isPublic:true)
    else if (filter === 'other') {
      // We can only show public templates in "other" view
      // So if status is "private", return empty result
      if (status === 'private') {
        where = {
          id: 'none', // This ensures no results when asking for private templates from others
        };
      }
      // If status is "public", we already have isPublic:true from the "other" filter
    }
    // For normal queries (no filter or admin)
    else {
      // If admin with no specific filter
      if (session?.user?.role === 'ADMIN') {
        where.isPublic = status === 'public';
      }
      // For regular users with no specific filter
      else {
        if (status === 'public') {
          // Show only public templates
          where = { isPublic: true };
        } else {
          // Show only their private templates
          where = {
            isPublic: false,
            authorId: session?.user?.id,
          };
        }
      }
    }
  }

  return { where };
}

export async function getTemplates(options = {}) {
  try {
    const session = await auth();
    const { where } = await buildTemplateQuery(options);
    const { sort } = options;

    const templates = await prisma.template.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },

        responses: session?.user
          ? {
              where: { userId: session.user.id },
              take: 1,
            }
          : undefined,
      },
      orderBy: sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' },
    });

    return { data: templates };
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return { error: 'Failed to fetch templates' };
  }
}

export async function getTemplateById(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
        responses: {
          where: { userId: session.user.id },
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },

            answers: {
              include: {
                question: {
                  select: {
                    id: true,
                    text: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          where: {
            userId: session.user.id,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    return { data: template };
  } catch (error) {
    return { error: 'Failed to fetch template' };
  }
}

export async function deleteTemplate(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { authorId: true },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    if (
      template.authorId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return { error: 'Not authorized' };
    }

    await prisma.template.delete({
      where: { id: templateId },
    });

    revalidatePath('/templates');
    return { success: true };
  } catch (error) {
    console.error('Template deletion error:', error);
    return { error: 'Failed to delete template' };
  }
}

export async function searchTemplates(query) {
  return getTemplates({ query });
}

export async function getTemplateForEdit(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const queryConditions =
      session.user.role === 'ADMIN'
        ? { id: templateId }
        : { id: templateId, authorId: session.user.id };

    const template = await prisma.template.findFirst({
      where: queryConditions,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        allowedUsers: {
          select: { email: true },
        },
      },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    return { data: template };
  } catch (error) {
    console.error('Template fetch error:', error);
    return { error: 'Failed to fetch template' };
  }
}

export async function updateTemplate(formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const templateId = formData.get('id');
    if (!templateId) {
      return { error: 'Template ID is required' };
    }

    const queryConditions =
      session.user.role === 'ADMIN'
        ? { id: templateId }
        : { id: templateId, authorId: session.user.id };

    const existingTemplate = await prisma.template.findFirst({
      where: queryConditions,
      include: { allowedUsers: true },
    });
    if (!existingTemplate) {
      return { error: 'Template not found or access denied' };
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      topic: formData.get('topic'),
      tags: formData.get('tags') || '',
      isPublic: formData.get('isPublic') === 'true',
      allowedUsers: formData.get('allowedUsers') || '',
      image: formData.get('image') || '',
    };

    let validatedData;
    try {
      validatedData = TemplateSchema.parse(rawData);
    } catch (validationError) {
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      return { error: 'Invalid template data' };
    }

    const { allowedUsers, ...otherData } = validatedData;

    try {
      const questions = JSON.parse(formData.get('questions') || '[]');

      const template = await prisma.$transaction(async (tx) => {
        await tx.allowedUser.deleteMany({ where: { templateId } });

        const updateData = {
          ...otherData,
          questions: {
            deleteMany: {},
            create: questions.map((q, index) => ({
              text: q.text,
              description: q.description,
              type: q.type,
              required: q.required,
              showInResults: q.showInResults,
              order: index,
            })),
          },

          ...(!otherData.isPublic && allowedUsers.length > 0
            ? {
                allowedUsers: {
                  create: allowedUsers.map((email) => ({
                    email: email.toLowerCase(),
                  })),
                },
              }
            : {}),
        };

        return await tx.template.update({
          where: { id: templateId },
          data: updateData,
        });
      });

      revalidatePath('/templates');
      return { success: 'Template updated successfully', data: template };
    } catch (error) {
      console.error('Database operation error:', error);
      return { error: 'Failed to update template' };
    }
  } catch (error) {
    console.error('Template update error:', error);
    return { error: 'Failed to update template' };
  }
}

export async function getLatestTemplates(limit = 5) {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
        tags: {
          isEmpty: false,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        responses: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return templates;
  } catch (error) {
    console.error('Failed to fetch latest templates:', error);
    return [];
  }
}

export async function getTopTemplates(limit = 5) {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
      },
      take: limit,
      orderBy: {
        responses: {
          _count: 'desc',
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return templates;
  } catch (error) {
    console.error('Failed to fetch top templates:', error);
    return [];
  }
}

export async function getPopularTags(limit = 20) {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
        tags: {
          isEmpty: false,
        },
      },
      select: {
        tags: true,
      },
    });

    const tagCounts = templates.reduce((acc, template) => {
      if (!template.tags) return acc;

      const templateTags = template.tags;
      templateTags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });

      return acc;
    }, {});

    const sortedTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedTags;
  } catch (error) {
    console.error('Failed to fetch popular tags:', error);
    return [];
  }
}

export async function getUserTemplates() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: 'Unauthorized' };
    }

    const templates = await prisma.template.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: templates };
  } catch (error) {
    console.error('Failed to fetch user templates:', error);
    return { error: 'Failed to fetch templates' };
  }
}

export async function getTemplateResponses(templateId) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: 'Authentication required' };
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { authorId: true },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    const isOwner = template.authorId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return { error: 'Not authorized to view responses' };
    }

    const responses = await prisma.formResponse.findMany({
      where: { templateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
                type: true,
              },
            },
          },
        },
        template: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: responses };
  } catch (error) {
    console.error('Failed to fetch template responses:', error);
    return { error: 'Failed to load responses' };
  }
}
