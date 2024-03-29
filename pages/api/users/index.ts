import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { createUser, getUsers } from 'services/prisma/users';

interface PostRequestBody {
  userId: string;
  name: string;
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { userId, name }: PostRequestBody = req.body;
      const { api_key } = req.query;
      const apiKey = Array.isArray(api_key) ? api_key[0] : api_key;

      if (!apiKey || apiKey !== process.env.AUTH0_FLOW_KEY) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      if (!userId || !name) {
        res.status(400).end('Both userId and name must be provided');
        resolve('');
      } else {
        createUser(
          {
            userId: userId,
            name: name
          },
          prismaContext
        )
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
  } else if (req.method === 'GET') {
    return new Promise((resolve) => {
      getUsers(prismaContext)
        .then((users) => {
          res.status(200).json(users);
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

export default users;
