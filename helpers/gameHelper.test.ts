import { Transaction, TransactionResult } from 'types/types';
import { calculateStandings } from './gameHelper';

const defaultData: Omit<Transaction, 'result'> = {
  id: 1,
  round: 1,
  windPlayer: 1,
  mahJongPlayer: 1
};
const defaultResult: Omit<TransactionResult, 'change'> = {
  mahJong: false,
  wind: false,
  points: 20
};
const generateTransaction = (
  input: [number, number, number, number]
): Transaction => ({
  ...defaultData,
  result: {
    player1: {
      ...defaultResult,
      change: input[0]
    },
    player2: {
      ...defaultResult,
      change: input[1]
    },
    player3: {
      ...defaultResult,
      change: input[2]
    },
    player4: {
      ...defaultResult,
      change: input[3]
    }
  }
});

describe('GameHelper', () => {
  it('Calculates correct', async () => {
    const inputTransactions: Parameters<typeof calculateStandings>[0] = [
      generateTransaction([48, -18, 66, 0]),
      generateTransaction([-14, 0, 10, 14]),
      generateTransaction([-6, 20, 32, -4]),
    ];
    const actualResult = calculateStandings(inputTransactions);

    const expectedResult: ReturnType<typeof calculateStandings> = {
      player1: 2028,
      player2: 2002,
      player3: 2108,
      player4: 2010
    };

    expect(actualResult).toEqual(expectedResult);
  });
});
