import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';

import type { Game } from 'types/types';
import type { Context } from './prisma.types';
import { CreateGame } from 'schemas/zodSchemas';

export const createGame = async (
  game: CreateGame,
  ctx: Context
): Promise<Nullable<Game>> => {
  const formattedGame = prismaMap.game.toPrisma(game);

  const result = await ctx.prisma.game.create({
    data: formattedGame
  });

  if (result) {
    return prismaMap.game.fromPrisma(result);
  } else {
    return null;
  }
};
