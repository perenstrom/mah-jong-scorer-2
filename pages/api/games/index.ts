import { NextApiRequest, NextApiResponse } from 'next';
// import { isAuthorized } from 'lib/authorization';
import { createGame } from 'services/prisma/games';
import { prismaContext } from 'lib/prisma';
import { generateRandomId } from 'helpers/utils';
import { formatPlayer } from 'helpers/playerHelper';

import type { CreateGame } from 'types/types';

type PostRequestBody = Omit<CreateGame, 'id'>;

const games = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { groupId, ownerUserId, players }: PostRequestBody = req.body;

      /* if (!isAuthorized(req, res, ownerUserId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      } */

      // TODO: Add zod to validate post body instead of following:
      if (!groupId || !ownerUserId || !players) {
        res.status(400).end('Game data malformed');
        resolve('');
      }

      try {
        formatPlayer(players?.player1?.userId, players?.player1?.nonUser);
        formatPlayer(players?.player2?.userId, players?.player2?.nonUser);
        formatPlayer(players?.player3?.userId, players?.player3?.nonUser);
        formatPlayer(players?.player4?.userId, players?.player4?.nonUser);
      } catch (error) {
        res.status(400).end('Game data malformed2');
        resolve('');
      }

      const randomId = generateRandomId();

      createGame(
        { ...(req.body as unknown as PostRequestBody), id: randomId },
        prismaContext
      )
        .then((game) => {
          res.status(200).json(game);
          resolve('');
        })
        .catch((error) => {
          console.log(error);
          res.status(500).end('Unexpected internal server error');
          resolve('');
        });
    });
  } else {
    res.status(404).end();
  }
};

export default games;
