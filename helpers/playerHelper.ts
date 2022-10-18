import { Player } from 'types/types';
import { Nullable } from 'types/utilityTypes';

export const formatPlayer = (
  userId: Nullable<string>,
  user: Nullable<string>
): Player => {
  if (userId && user) throw new Error('Both id and name present');
  if (!userId && !user) throw new Error('Neither id or name present');

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
