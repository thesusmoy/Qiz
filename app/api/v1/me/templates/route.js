import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';
import { authenticateApiRequest } from '@/lib/actions/auth-api';

export async function GET(request) {
  try {
    const { user, error, status } = await authenticateApiRequest(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const templates = await prisma.template.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
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

    return NextResponse.json(templates.map((t) => ({ ...t, author: t.user })));
  } catch (err) {
    console.error('API Error fetching user templates:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
