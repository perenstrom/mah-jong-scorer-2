import { CreateTransaction } from 'schemas/zodSchemas';
import { prismaMap } from 'services/maps/prismaMap';
import { Transaction } from 'types/types';
import { Nullable } from 'types/utilityTypes';
import { Context } from './prisma.types';

export const getTransactions = async (
  ctx: Context,
  gameId: string
): Promise<Nullable<Transaction[]>> => {
  const ping = performance.now();
  const result = await ctx.prisma.transaction.findMany({
    where: {
      gameId
    }
  });
  console.log(`Get transactions prisma: ${performance.now() - ping}ms`);

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

  const ping = performance.now();
  const result = await ctx.prisma.transaction.create({
    data: formattedTransaction
  });
  console.log(`Create transaction: ${performance.now() - ping}ms`);

  if (result) {
    return prismaMap.transaction.fromPrisma(result);
  } else {
    return null;
  }
};
