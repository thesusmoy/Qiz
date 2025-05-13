import prisma from '@/lib/prisma/client';

export async function getUserByApiToken(token) {
  if (!token) {
    return null;
  }
  const apiToken = await prisma.apiToken.findUnique({
    where: { token: token },
    include: { user: true },
  });
  return apiToken ? apiToken.user : null;
}

export async function authenticateApiRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: 'Unauthorized: Missing or malformed token',
      status: 401,
      user: null,
    };
  }
  const token = authHeader.substring(7);
  const user = await getUserByApiToken(token);

  if (!user) {
    return { error: 'Unauthorized: Invalid token', status: 401, user: null };
  }
  if (!user.isActive) {
    return {
      error: 'Forbidden: User account is inactive',
      status: 403,
      user: null,
    };
  }
  return { user, error: null, status: 200 };
}
