import { getUser } from 'lib/authorization';
import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransactionPostSchema } from 'schemas/zodSchemas';
import { getExpandedGame } from 'services/prisma/games';
import { createTransaction } from 'services/prisma/transactions';

interface GetRequestQuery {
  gameId: string;
}

const transactions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise(async (resolve) => {
      const { gameId } = req.query as unknown as GetRequestQuery;
      const transactionParse = createTransactionPostSchema.safeParse(req.body);

      if (!transactionParse.success) {
        console.log(JSON.stringify(transactionParse.error, null, 2));
        res.status(400).end('Game data malformed');
        resolve('');
      } else {
        const game = await getExpandedGame(prismaContext, gameId);
        const loggedInUser = getUser(req, res);
        const gamePlayersIds = [
          game?.players.player1.user?.userId,
          game?.players.player2.user?.userId,
          game?.players.player3.user?.userId,
          game?.players.player4.user?.userId
        ].filter((p) => !!p) as string[];

        if (!gamePlayersIds.includes(loggedInUser?.sub || '')) {
          res.status(401).end('Unauthorized.');
          resolve('');
          return;
        }

        createTransaction(prismaContext, {
          ...transactionParse.data,
          gameId
        })
          .then((transaction) => {
            res.status(200).json(transaction);
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

export default transactions;
