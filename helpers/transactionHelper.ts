import { Transaction } from 'types/types';
import { Transaction as PrismaTransaction } from '@prisma/client';

type PlayerNumber = 1 | 2 | 3 | 4;
type TransactionData = {
  player1: number;
  player2: number;
  player3: number;
  player4: number;
  windPlayer: PlayerNumber;
  mahJongPlayer: PlayerNumber;
};

const PLAYER_NUMBERS = [1, 2, 3, 4] as const;

export const PrismaTransactionToTransactionData = (
  transaction: PrismaTransaction
): TransactionData => ({
  player1: transaction.pointsPlayer1,
  player2: transaction.pointsPlayer2,
  player3: transaction.pointsPlayer3,
  player4: transaction.pointsPlayer4,
  windPlayer: transaction.windPlayer as PlayerNumber,
  mahJongPlayer: transaction.mahJongPlayer as PlayerNumber
});

// Mah jong winners do not pay
const mahJongFactor = (
  givingPlayer: PlayerNumber,
  mahJongPlayer: PlayerNumber
) => (givingPlayer === mahJongPlayer ? 0 : 1);

// Wind player pays and receives double
const windFactor = (
  receivingPlayer: PlayerNumber,
  givingPlayer: PlayerNumber,
  windPlayer: PlayerNumber
) => (receivingPlayer === windPlayer || givingPlayer === windPlayer ? 2 : 1);

const positiveChange = (
  transactionData: TransactionData,
  currentPlayer: PlayerNumber
) => {
  const sum = PLAYER_NUMBERS.reduce((accumulator, counterpartyNumber) => {
    const currentClaim =
      mahJongFactor(counterpartyNumber, transactionData.mahJongPlayer) *
      windFactor(
        currentPlayer,
        counterpartyNumber,
        transactionData.windPlayer
      ) *
      transactionData[`player${currentPlayer}`];

    return accumulator + currentClaim;
  }, 0);

  return sum;
};

const negativeChange = (
  transactionData: TransactionData,
  currentPlayer: PlayerNumber
) => {
  const sum = PLAYER_NUMBERS.reduce((accumulator, counterpartyNumber) => {
    const currentDebt =
      mahJongFactor(currentPlayer, transactionData.mahJongPlayer) *
      windFactor(
        counterpartyNumber,
        currentPlayer,
        transactionData.windPlayer
      ) *
      transactionData[`player${counterpartyNumber}`];

    return accumulator + currentDebt;
  }, 0);

  return sum;
};

export const calculateTransaction = (
  transactionData: TransactionData
): Transaction['result'] => {
  const transactions = PLAYER_NUMBERS.map((currentPlayer) => ({
    change:
      positiveChange(transactionData, currentPlayer) -
      negativeChange(transactionData, currentPlayer),
    mahJong: transactionData.mahJongPlayer === currentPlayer,
    points: transactionData[`player${currentPlayer}`],
    wind: transactionData.windPlayer === currentPlayer
  }));

  const transactionResult = Object.fromEntries(
    transactions.map((transaction, i) => [
      `player${i + 1}` as keyof Transaction['result'],
      transaction
    ])
  ) as Transaction['result'];

  return transactionResult;
};