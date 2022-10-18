import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthorized } from 'lib/authorization';
import { Game } from 'types/types';

type PostRequestQuery = Omit<Game, 'id'>;

const games = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { ownerUserId } = req.query as unknown as PostRequestQuery;

      if (!isAuthorized(req, res, ownerUserId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      // TODO: Implement ZOD
      // TODO: Create game through service
      

      /*       if (!userId) {
        res.status(400).end('Both userId and name must be provided');
        resolve('');
      } else {
        getUser(userId, prismaContext)
          .then((user) => {
            res.status(200).json(user);
            resolve('');
          })
          .catch((error) => {
            console.log(error);
            res.status(500).end('Unexpected internal server error');
            resolve('');
          });
      } */
    });
  } else {
    res.status(404).end();
  }
};

export default games;
