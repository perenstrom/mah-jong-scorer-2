import type { User } from '@prisma/client';
import { prismaMap } from 'services/maps/prismaMap';
import type { ExpandedPlayer, Player, PlayerNumber } from 'types/types';
import type { Nullable } from 'types/utilityTypes';

export const formatPlayer = (
  userId: Nullable<string>,
  user: Nullable<string>
): Player => {
  if (userId && user) throw new Error('Both id and name present');
  if (!userId && !user) throw new Error('Neither id nor name present');

  if (userId && !user) {
    return {
      userId
    };
  }

  if (!userId && user) {
    return {
      nonUser: user
    };
  }

  return {
    nonUser: ''
  };
};

export const formatExpandedPlayer = (
  user: Nullable<User>,
  nonUser: Nullable<string>
): ExpandedPlayer => {
  if (user && nonUser) throw new Error('Both user and name present');
  if (!user && !nonUser) throw new Error('Neither user nor name present');

  if (user && !nonUser) {
    return {
      user: prismaMap.user.fromPrisma(user)
    };
  }

  if (!user && nonUser) {
    return {
      nonUser: nonUser
    };
  }

  return {
    nonUser: ''
  };
};

type PlayersInitialsInput = Record<`player${PlayerNumber}`, string>;
type PlayersInitials = PlayersInitialsInput;
export const generatePlayerInitials = (
  players: PlayersInitialsInput
): PlayersInitials => {
  const initials: string[] = [];

  const playerNumbers = [1, 2, 3, 4] as const;

  playerNumbers.forEach((playerNumber) => {
    const playerName = players[`player${playerNumber}`];

    let suggestedInitial = playerName.substring(0, 2);
    let length = 2;

    while (initials.includes(suggestedInitial)) {
      length += 1;
      suggestedInitial = playerName.substring(0, length);
    }

    initials.push(suggestedInitial);
  });

  return {
    player1: initials[0],
    player2: initials[1],
    player3: initials[2],
    player4: initials[3]
  };
};
