import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';

import type { User } from 'types/types';
import type { Context } from './prisma.types';

export const createUser = async (
  user: User,
  ctx: Context
): Promise<Nullable<User>> => {
  const formattedFilm = prismaMap.user.toPrisma(user);

  const result = await ctx.prisma.user.create({
    data: formattedFilm
  });

  if (result) {
    return prismaMap.user.fromPrisma(result);
  } else {
    return null;
  }
};
