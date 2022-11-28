import { prismaMap } from 'services/maps/prismaMap';
import { Transaction } from 'types/types';
import { Nullable } from 'types/utilityTypes';
import { Context } from './prisma.types';

export const getTransactions = async (
  ctx: Context,
  gameId: string
): Promise<Nullable<Transaction[]>> => {
  const result = await ctx.prisma.transaction.findMany({
    where: {
      gameId
    }
  });

  if (result) {
    return result.map((transaction) =>
      prismaMap.transaction.fromPrisma(transaction)
    );
  } else {
    return null;
  }
};
