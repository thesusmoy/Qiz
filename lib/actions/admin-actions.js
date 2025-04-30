'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: users };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { error: 'Failed to fetch users' };
  }
}

export async function updateUserStatus(userId, isActive) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    if (userId === session.user.id) {
      return { error: 'Cannot modify own account' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return { success: 'User status updated' };
  } catch (error) {
    return { error: 'Failed to update user' };
  }
}

export async function updateUserRole(userId, role) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    if (userId === session.user.id) {
      return { error: 'Cannot modify own role' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return { success: 'User role updated' };
  } catch (error) {
    return { error: 'Failed to update user role' };
  }
}

export async function deleteUser(userId) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    if (userId === session.user.id) {
      return { error: 'Cannot delete own account' };
    }

    await prisma.$transaction([
      prisma.formResponse.deleteMany({
        where: { userId },
      }),

      prisma.template.deleteMany({
        where: { authorId: userId },
      }),

      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return { success: 'User deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete user' };
  }
}

export async function getAdminTemplates() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    const templates = await prisma.template.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: templates };
  } catch (error) {
    return { error: 'Failed to fetch templates' };
  }
}

export async function deleteTemplate(templateId) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    await prisma.$transaction([
      prisma.formResponse.deleteMany({
        where: { templateId },
      }),

      prisma.template.delete({
        where: { id: templateId },
      }),
    ]);

    revalidatePath('/admin/templates');
    return { success: 'Template deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete template' };
  }
}

export async function getAdminResponses() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    const responses = await prisma.formResponse.findMany({
      include: {
        template: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
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
    return { error: 'Failed to fetch responses' };
  }
}

export async function deleteResponse(responseId) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    await prisma.formResponse.delete({
      where: { id: responseId },
    });

    revalidatePath('/admin/responses');
    return { success: 'Response deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete response' };
  }
}
