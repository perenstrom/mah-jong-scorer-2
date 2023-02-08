import type { CreateTransaction } from 'schemas/zodSchemas';
import type { Transaction } from 'types/types';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const createTransaction = async (
  transaction: CreateTransaction
): Promise<Transaction> => {
  const url = `/api/games/${transaction.gameId}/transactions`;
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(transaction)
  };

  const result = await (await fetch(url, options)).json();

  return result;
};
