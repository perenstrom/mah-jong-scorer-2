import { Game as PrismaGame, Prisma, User as PrismaUser } from '@prisma/client';
import { formatPlayer } from 'helpers/playerHelper';
import { CreateGame, Game, User } from 'types/types';
import { Nullable } from 'types/utilityTypes';

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
      id: gameResponse.id,
      ownerUserId: gameResponse.ownerUserId,
      groupId: gameResponse.groupId,
      players: {
        player1: formatPlayer(gameResponse.player1UserId, gameResponse.player1),
        player2: formatPlayer(gameResponse.player2UserId, gameResponse.player2),
        player3: formatPlayer(gameResponse.player3UserId, gameResponse.player3),
        player4: formatPlayer(gameResponse.player4UserId, gameResponse.player4)
      },
      meta: {
        created: gameResponse.created,
        finished: gameResponse.finished
      },
      results: {
        player1: gameResponse.resultPlayer1,
        player2: gameResponse.resultPlayer2,
        player3: gameResponse.resultPlayer3,
        player4: gameResponse.resultPlayer4
      },
      transactions: [] // TODO: Fetch transactions at the same time?
    }),
    toPrisma: (game: CreateGame): Prisma.GameCreateInput => ({
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
      ...formatUserPlayer(game.players.player4.userId, 'player4User'),
    })
  }
};
