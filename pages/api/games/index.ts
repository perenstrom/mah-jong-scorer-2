import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthorized } from 'lib/authorization';
import { createGame } from 'services/prisma/games';
import { prismaContext } from 'lib/prisma';
import { generateRandomId } from 'helpers/utils';
import { createGamePostSchema } from 'schemas/zodSchemas';

const games = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const gameParse = createGamePostSchema.safeParse(req.body);
      if (!gameParse.success) {
        console.log(JSON.stringify(gameParse.error, null, 2));
        res.status(400).end('Game data malformed');
        resolve('');
      } else {
        const { ownerUserId } = gameParse.data;

        if (!isAuthorized(req, res, ownerUserId)) {
          res.status(401).end('Unauthorized.');
          resolve('');
        }

        const randomId = generateRandomId();

        createGame({ ...gameParse.data, id: randomId }, prismaContext)
          .then((game) => {
            res.status(200).json(game);
            resolve('');
          })
          .catch((error) => {
            console.log(error);
            res.status(500).end('Unexpected internal server error');
            resolve('');
          });
      }
    });
  } else {
    res.status(404).end();
  }
};

export default games;
