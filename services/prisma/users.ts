import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';

import type { User } from 'types/types';
import type { Context } from './prisma.types';

export const createUser = async (
  user: User,
  ctx: Context
): Promise<Nullable<User>> => {
  const formattedUser = prismaMap.user.toPrisma(user);

  const result = await ctx.prisma.user.create({
    data: formattedUser
  });

  if (result) {
    return prismaMap.user.fromPrisma(result);
  } else {
    return null;
  }
};

export const getUsers = async (ctx: Context) => {
  const usersResult = await ctx.prisma.user.findMany({});

  if (!usersResult) {
    return null;
  } else {
    return usersResult.map((userResult) =>
      prismaMap.user.fromPrisma(userResult)
    );
  }
};

export const getUser = async (
  userId: string,
  ctx: Context
): Promise<Nullable<User>> => {
  const userResult = await ctx.prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!userResult) {
    return null;
  } else {
    return prismaMap.user.fromPrisma(userResult);
  }
};
