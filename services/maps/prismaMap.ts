import type {
  Game as PrismaGame,
  Prisma,
  Transaction as PrismaTransaction,
  User as PrismaUser
} from '@prisma/client';
import type { ExpandedGame as PrismaExpandedGame } from 'services/prisma/prisma.types';
import { formatExpandedPlayer, formatPlayer } from 'helpers/playerHelper';
import type { CreateGamePrisma, CreateTransaction } from 'schemas/zodSchemas';
import type { ExpandedGame, Game, Transaction, User } from 'types/types';
import type { Nullable } from 'types/utilityTypes';
import {
  calculateTransaction,
  PrismaTransactionToTransactionData
} from 'helpers/transactionHelper';

const formatUserPlayer = (userId: Nullable<string>, key: string) => {
  if (userId) {
    return {
      [key]: {
        connect: { id: userId }
      }
    };
  } else {
    return {};
  }
};

const baseGame = {
  fromPrisma: (gameResponse: PrismaGame | PrismaExpandedGame) => ({
    id: gameResponse.id,
    ownerUserId: gameResponse.ownerUserId,
    groupId: gameResponse.groupId,
    meta: {
      created: gameResponse.created?.valueOf(),
      finished: gameResponse.finished?.valueOf() || null
    },
    results: {
      player1: gameResponse.resultPlayer1,
      player2: gameResponse.resultPlayer2,
      player3: gameResponse.resultPlayer3,
      player4: gameResponse.resultPlayer4
    }
  })
};

export const prismaMap = {
  user: {
    fromPrisma: (userResponse: PrismaUser): User => ({
      userId: userResponse.id,
      name: userResponse.name
    }),
    toPrisma: (user: User): Prisma.UserCreateInput => ({
      id: user.userId,
      name: user.name
    })
  },
  game: {
    fromPrisma: (gameResponse: PrismaGame): Game => ({
      ...baseGame.fromPrisma(gameResponse),
      players: {
        player1: formatPlayer(gameResponse.player1UserId, gameResponse.player1),
        player2: formatPlayer(gameResponse.player2UserId, gameResponse.player2),
        player3: formatPlayer(gameResponse.player3UserId, gameResponse.player3),
        player4: formatPlayer(gameResponse.player4UserId, gameResponse.player4)
      }
    }),
    toPrisma: (game: CreateGamePrisma): Prisma.GameCreateInput => ({
      id: game.id,
      created: new Date(),
      owner: {
        connect: { id: game.ownerUserId }
      },
      group: {
        connect: { id: game.groupId }
      },
      player1: game.players.player1.nonUser || '',
      ...formatUserPlayer(game.players.player1.userId, 'player1User'),
      player2: game.players.player2.nonUser || '',
      ...formatUserPlayer(game.players.player2.userId, 'player2User'),
      player3: game.players.player3.nonUser || '',
      ...formatUserPlayer(game.players.player3.userId, 'player3User'),
      player4: game.players.player4.nonUser || '',
      ...formatUserPlayer(game.players.player4.userId, 'player4User')
    })
  },
  expandedGame: {
    fromPrisma: (gameResponse: PrismaExpandedGame): ExpandedGame => ({
      ...baseGame.fromPrisma(gameResponse),
      players: {
        player1: formatExpandedPlayer(
          gameResponse.player1User,
          gameResponse.player1
        ),
        player2: formatExpandedPlayer(
          gameResponse.player2User,
          gameResponse.player2
        ),
        player3: formatExpandedPlayer(
          gameResponse.player3User,
          gameResponse.player3
        ),
        player4: formatExpandedPlayer(
          gameResponse.player4User,
          gameResponse.player4
        )
      }
    })
  },
  transaction: {
    fromPrisma: (transactionResponse: PrismaTransaction): Transaction => ({
      id: transactionResponse.id,
      round: transactionResponse.round,
      windPlayer: transactionResponse.windPlayer,
      mahJongPlayer: transactionResponse.mahJongPlayer,
      result: calculateTransaction(
        PrismaTransactionToTransactionData(transactionResponse)
      )
    }),
    toPrisma: (
      transaction: CreateTransaction
    ): Prisma.TransactionCreateInput => ({
      round: transaction.round,
      pointsPlayer1: transaction.result.player1,
      pointsPlayer2: transaction.result.player2,
      pointsPlayer3: transaction.result.player3,
      pointsPlayer4: transaction.result.player4,
      windPlayer: transaction.windPlayer,
      mahJongPlayer: transaction.mahJongPlayer,
      game: {
        connect: {
          id: transaction.gameId
        }
      }
    })
  }
};
