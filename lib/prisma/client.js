import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url:
          process.env.NODE_ENV === 'production'
            ? process.env.DATABASE_URL
            : process.env.DATABASE_URL,
      },
    },
  });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
