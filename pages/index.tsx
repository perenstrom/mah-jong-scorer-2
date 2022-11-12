import { GetServerSideProps, NextPage } from 'next';
import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { ExpandedGame, User } from 'types/types';
import { getUsers } from 'services/prisma/users';
import { prismaContext } from 'lib/prisma';
import { Container } from '@mui/system';
import { getExpandedGames } from 'services/prisma/games';
import { CreateGameForm } from 'components/CreateGameForm';
import Sheet from '@mui/joy/Sheet';
import { Stack } from '@mui/joy';
import { GamesList } from 'components/GamesList';
import Head from 'next/head';

interface Props {
  users: User[];
  games: ExpandedGame[];
}

const IndexPage: NextPage<Props> = ({ users, games }) => {
  return (
    <>
      <Head>
        <title>Mah Jong Scorer</title>
      </Head>
      <Container maxWidth="md" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Sheet variant="outlined" sx={{ p: 2 }}>
            <CreateGameForm users={users} />
          </Sheet>
          <Sheet variant="outlined" sx={{ p: 2 }}>
            <GamesList games={games} />
          </Sheet>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const users = await getUsers(prismaContext);
  const games = await getExpandedGames(prismaContext);

  if (!users) {
    throw new Error('Error when fetching user data');
  }

  if (!games) {
    throw new Error('Error when fetching games data');
  }

  return {
    props: { users, games }
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  IndexPage
);
