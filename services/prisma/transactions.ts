import { CreateTransaction } from 'schemas/zodSchemas';
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

export const createTransaction = async (
  ctx: Context,
  transaction: CreateTransaction
) => {
  const formattedTransaction = prismaMap.transaction.toPrisma(transaction);

  const result = await ctx.prisma.transaction.create({
    data: formattedTransaction
  });

  if (result) {
    return prismaMap.transaction.fromPrisma(result);
  } else {
    return null;
  }
};
