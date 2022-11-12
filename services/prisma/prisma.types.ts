import { Game, PrismaClient, User } from '@prisma/client';

export type Context = {
  prisma: PrismaClient;
};

export type ExpandedGame = Game & {
  player1User: User | null;
  player2User: User | null;
  player3User: User | null;
  player4User: User | null;
}