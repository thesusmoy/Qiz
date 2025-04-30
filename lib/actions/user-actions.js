'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';

export async function searchUsers(query) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        NOT: {
          id: session.user.id, 
        },
      },
      select: {
        name: true,
        email: true,
      },
      take: 10,
    });

    return { data: users };
  } catch (error) {
    console.error('Failed to search users:', error);
    return { error: 'Failed to search users' };
  }
}
