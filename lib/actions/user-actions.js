import crypto from 'crypto';
import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';

export async function searchUsers(query) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticataed' };
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

function generateApiToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function getOrCreateApiToken(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'User not found' };
  if (user.apiToken) return { apiToken: user.apiToken };
  const apiToken = generateApiToken();
  await prisma.user.update({ where: { id: userId }, data: { apiToken } });
  return { apiToken };
}

export async function regenerateApiToken(userId) {
  const apiToken = generateApiToken();
  await prisma.user.update({ where: { id: userId }, data: { apiToken } });
  return { apiToken };
}
