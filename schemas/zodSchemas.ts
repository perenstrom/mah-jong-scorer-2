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
