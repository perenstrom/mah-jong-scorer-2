import { Game, Transaction } from 'types/types';

export const calculateStandings = (
  transactions: Transaction[]
): Game['results'] => ({
  player1: transactions.reduce(
    (prev, curr) => prev + curr.result.player1.change,
    2000
  ),
  player2: transactions.reduce(
    (prev, curr) => prev + curr.result.player2.change,
    2000
  ),
  player3: transactions.reduce(
    (prev, curr) => prev + curr.result.player3.change,
    2000
  ),
  player4: transactions.reduce(
    (prev, curr) => prev + curr.result.player4.change,
    2000
  )
});
