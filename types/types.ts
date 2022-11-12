import type { RequireExactlyOne } from 'type-fest';

export interface User {
  userId: string;
  name: string;
}

interface PlayerBase {
  nonUser: string;
  userId: string;
}
export type Player = RequireExactlyOne<PlayerBase, 'nonUser' | 'userId'>;
interface ExpandedPlayerBase {
  nonUser: string;
  user: User;
}
export type ExpandedPlayer = RequireExactlyOne<
  ExpandedPlayerBase,
  'nonUser' | 'user'
>;

interface TransactionResult {
  points: number;
  change: number;
  result: number;
  wind: boolean;
  mahJong: boolean;
}

export interface Transaction {
  id: number;
  round: number;
  result: {
    player1: TransactionResult;
    player2: TransactionResult;
    player3: TransactionResult;
    player4: TransactionResult;
  };
}

export interface Game {
  id: string;
  groupId: number;
  ownerUserId: string;
  players: {
    player1: Player;
    player2: Player;
    player3: Player;
    player4: Player;
  };
  results: {
    player1: number | null;
    player2: number | null;
    player3: number | null;
    player4: number | null;
  };
  transactions: number[];
  meta: {
    created: number;
    finished: number | null;
  };
}

export type ExpandedGame = Omit<Game, 'players'> & {
  players: {
    [Property in keyof Game['players']]: ExpandedPlayer;
  };
};
