import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { getUser } from 'services/prisma/users';

interface GetRequestQuery {
  userId: string;
  api_key: string;
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      const { userId, api_key: apiKey } =
        req.query as unknown as GetRequestQuery;

      if (!apiKey || apiKey !== process.env.AUTH0_FLOW_KEY) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      if (!userId) {
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
      }
    });
  } else {
    res.status(404).end();
  }
};

export default users;
