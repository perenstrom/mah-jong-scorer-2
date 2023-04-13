import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';

import type { User } from 'types/types';
import type { Context } from './prisma.types';

export const createUser = async (
  user: User,
  ctx: Context
): Promise<Nullable<User>> => {
  const formattedUser = prismaMap.user.toPrisma(user);

  const ping = performance.now();
  const result = await ctx.prisma.user.create({
    data: formattedUser
  });
  console.log(`Create user prisma: ${performance.now() - ping}ms`);

  if (result) {
    return prismaMap.user.fromPrisma(result);
  } else {
    return null;
  }
};

export const getUsers = async (ctx: Context) => {
  const ping = performance.now();
  const usersResult = await ctx.prisma.user.findMany({});
  console.log(`Get users prisma: ${performance.now() - ping}ms`);

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
  const ping = performance.now();
  const userResult = await ctx.prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  console.log(`Get user prisma: ${performance.now() - ping}ms`);

  if (!userResult) {
    return null;
  } else {
    return prismaMap.user.fromPrisma(userResult);
  }
};
