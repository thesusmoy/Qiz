
'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';

export async function addComment(templateId, content) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        templateId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    revalidatePath(`/templates/${templateId}`);
    return { data: comment };
  } catch (error) {
    return { error: 'Failed to add comment' };
  }
}

export async function toggleLike(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          templateId,
          userId: session.user.id,
        },
      });
    }

    revalidatePath(`/templates/${templateId}`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to toggle like' };
  }
}
