import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from 'types/types';

export const prismaMap = {
  user: {
    fromPrisma: (userResponse: PrismaUser): User => ({
      userId: userResponse.id,
      name: userResponse.name
    }),
    toPrisma: (user: User): Prisma.UserCreateInput => ({
      id: user.userId,
      name: user.name
    })
  }
};
