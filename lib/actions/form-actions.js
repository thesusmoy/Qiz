'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';

export async function getTemplateWithQuestions(templateId) {
  try {
    const session = await auth();

    const where = {
      id: templateId,
      OR: [
        { isPublic: true },
        ...(session?.user
          ? [
              { authorId: session.user.id },
              {
                allowedUsers: {
                  some: {
                    email: session.user.email,
                  },
                },
              },
              ...(session.user.role === 'ADMIN' ? [{}] : []),
            ]
          : []),
      ],
    };

    const template = await prisma.template.findFirst({
      where,
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!template) {
      return { error: 'Form not found or access denied' };
    }

    return { data: template };
  } catch (error) {
    return { error: 'Failed to load form' };
  }
}

export async function checkExistingResponse(templateId, responseId = null) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { data: null };
    }

    
    if (responseId && session.user.role === 'ADMIN') {
      const response = await prisma.formResponse.findUnique({
        where: { id: responseId },
        include: { answers: true },
      });
      return { data: response };
    }

    
    const response = await prisma.formResponse.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: session.user.id,
        },
      },
      include: {
        answers: true,
      },
    });

    return { data: response };
  } catch (error) {
    return { error: 'Failed to check existing response' };
  }
}

export async function submitFormResponse(templateId, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'You must be logged in to submit a response' };
    }

    const existingResponse = await prisma.formResponse.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: session.user.id,
        },
      },
    });

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { questions: true },
    });

    if (!template) {
      return { error: 'Form not found' };
    }

    const response = await prisma.$transaction(async (tx) => {
      if (existingResponse) {
        await tx.answer.deleteMany({
          where: { formResponseId: existingResponse.id },
        });

        await tx.formResponse.update({
          where: { id: existingResponse.id },
          data: { updatedAt: new Date() },
        });

        return existingResponse;
      }

      return await tx.formResponse.create({
        data: {
          templateId,
          userId: session.user.id,
        },
      });
    });

    await prisma.answer.createMany({
      data: template.questions.map((question) => ({
        questionId: question.id,
        formResponseId: response.id,
        value: formData.get(question.id)?.toString() || '',
      })),
    });

    return {
      success: existingResponse
        ? 'Response updated successfully'
        : 'Response submitted successfully',
      data: response,
    };
  } catch (error) {
    return { error: 'Failed to submit response' };
  }
}

export async function getTemplateWithResponses(templateId) {
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
        questions: {
          where: { showInResults: true },
          orderBy: { order: 'asc' },
        },
        responses: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            answers: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    const canAccess =
      session.user.role === 'ADMIN' || template.authorId === session.user.id;

    if (!canAccess) {
      return { error: 'Access denied' };
    }

    return { data: template };
  } catch (error) {
    return { error: 'Failed to load responses' };
  }
}

export async function getResponseDetails(templateId, responseId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Unauthorized' };
    }

    const response = await prisma.formResponse.findUnique({
      where: { id: responseId },
      include: {
        template: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
          orderBy: {
            question: {
              order: 'asc',
            },
          },
        },
      },
    });

    if (!response) {
      return { error: 'Response not found' };
    }

    

    return { data: response };
  } catch (error) {
    console.error('Error fetching response details:', error);
    return { error: 'Failed to load response details' };
  }
}

export async function deleteResponse(responseId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const response = await prisma.formResponse.findFirst({
      where: {
        id: responseId,
      },
      include: {
        template: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!response) {
      return { error: 'Response not found' };
    }

    const canDelete =
      session.user.role === 'ADMIN' ||
      response.userId === session.user.id ||
      response.template.authorId === session.user.id;

    if (!canDelete) {
      return { error: 'Not authorized to delete this response' };
    }

    await prisma.formResponse.delete({
      where: { id: responseId },
    });

    return { success: 'Response deleted successfully' };
  } catch (error) {
    console.error('Delete response error:', error);
    return { error: 'Failed to delete response' };
  }
}

export async function getUserResponses() {
  const session = await auth();

  if (!session?.user) {
    return { error: 'Authentication required' };
  }

  try {
    const responses = await prisma.formResponse.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        template: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: responses };
  } catch (error) {
    console.error('Failed to fetch user responses:', error);
    return { error: 'Failed to fetch responses' };
  }
}
