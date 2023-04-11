import { z } from 'zod';

const playerSchema = z
  .object({
    nonUser: z.string(),
    userId: z.undefined()
  })
  .or(z.object({ nonUser: z.undefined(), userId: z.string() }));

export const createGamePostSchema = z.object({
  groupId: z.number(),
  ownerUserId: z.string(),
  players: z.object({
    player1: playerSchema,
    player2: playerSchema,
    player3: playerSchema,
    player4: playerSchema
  })
});

export type CreateGame = z.infer<typeof createGamePostSchema>;
export type CreateGamePrisma = z.infer<typeof createGamePostSchema> & {
  id: string;
};

export const createTransactionPostSchema = z.object({
  round: z.number(),
  result: z.object({
    player1: z.number(),
    player2: z.number(),
    player3: z.number(),
    player4: z.number()
  }),
  windPlayer: z.number().min(1).max(4).int(),
  mahJongPlayer: z.number().min(1).max(4).int()
});

export type CreateTransaction = z.infer<typeof createTransactionPostSchema> & {
  gameId: string;
};
