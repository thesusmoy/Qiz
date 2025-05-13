'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma/client';
import { RegisterSchema } from '@/lib/utils/validators';

export async function registerUser(data) {
  try {
    RegisterSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: isFirstUser ? 'ADMIN' : 'USER',
      },
    });

    return { success: 'Registration successful' };
  } catch (error) {
    console.error('Registration error:', error);
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: error.message || 'Something went wrong' };
  }
}
