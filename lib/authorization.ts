import { UserProfile, getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const isAuthorized = (
  req: NextApiRequest,
  res: NextApiResponse,
  playerId: string
) => {
  const session = <{ user: UserProfile }>getSession(req, res);
  const user = session?.user ?? null;

  return user ? user?.sub === playerId : false;
};
