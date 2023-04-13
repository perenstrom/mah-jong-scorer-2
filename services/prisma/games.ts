import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';

import type { ExpandedGame, Game } from 'types/types';
import type { Context } from './prisma.types';
import { CreateGamePrisma } from 'schemas/zodSchemas';

export const createGame = async (
  game: CreateGamePrisma,
  ctx: Context
): Promise<Nullable<Game>> => {
  const formattedGame = prismaMap.game.toPrisma(game);

  const ping = performance.now();
  const result = await ctx.prisma.game.create({
    data: formattedGame
  });
  console.log(`Create game prisma: ${performance.now() - ping}ms`);

  if (result) {
    return prismaMap.game.fromPrisma(result);
  } else {
    return null;
  }
};

export const getExpandedGames = async (
  ctx: Context
): Promise<ExpandedGame[]> => {
  const ping = performance.now();
  const result = await ctx.prisma.game.findMany({
    include: {
      player1User: true,
      player2User: true,
      player3User: true,
      player4User: true
    }
  });
  console.log(`Get expanded games prisma: ${performance.now() - ping}ms`);

  if (result.length > 0) {
    return result.map((game) => prismaMap.expandedGame.fromPrisma(game));
  } else {
    return [];
  }
};

export const getExpandedGame = async (
  ctx: Context,
  gameId: string
): Promise<Nullable<ExpandedGame>> => {
  const ping = performance.now();
  const result = await ctx.prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      player1User: true,
      player2User: true,
      player3User: true,
      player4User: true
    }
  });
  console.log(`Get expanded game prisma: ${performance.now() - ping}ms`);

  if (result) {
    return prismaMap.expandedGame.fromPrisma(result);
  } else {
    return null;
  }
};
