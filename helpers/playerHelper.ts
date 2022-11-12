import type { User } from '@prisma/client';
import { prismaMap } from 'services/maps/prismaMap';
import type { ExpandedPlayer, Player } from 'types/types';
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
