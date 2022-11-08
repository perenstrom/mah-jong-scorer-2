import { GetServerSideProps, NextPage } from 'next';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Button, Select, Option, Grid } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { FormEventHandler, useState } from 'react';
import { createGame } from 'services/local/games';
import { User } from 'types/types';
import { getUsers } from 'services/prisma/users';
import { prismaContext } from 'lib/prisma';
import { Container } from '@mui/system';

interface Props {
  users: User[];
}

const IndexPage: NextPage<Props> = ({ users }) => {
  const [input, setInput] = useState({
    player1: '',
    player1User: '',
    player2: '',
    player2User: '',
    player3: '',
    player3User: '',
    player4: '',
    player4User: ''
  });

  const handleChange = (key: keyof typeof input, value: string) => {
    const newObject = { ...input, [key]: value };

    setInput(newObject);
  };

  const availablePlayers = {
    player1: users.filter(
      ({ userId }) =>
        ![input.player2User, input.player3User, input.player4User].includes(
          userId
        )
    ),
    player2: users.filter(
      ({ userId }) =>
        ![input.player1User, input.player3User, input.player4User].includes(
          userId
        )
    ),
    player3: users.filter(
      ({ userId }) =>
        ![input.player1User, input.player2User, input.player4User].includes(
          userId
        )
    ),
    player4: users.filter(
      ({ userId }) =>
        ![input.player1User, input.player2User, input.player3User].includes(
          userId
        )
    )
  };

  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!user || !user.sub) {
      setLoading(false);
      return;
    }
    try {
      const newGame = await createGame({
        groupId: 1,
        ownerUserId: user?.sub,
        players: {
          player1: {
            userId: input.player1User
          },
          player2: {
            userId: input.player2User
          },
          player3: {
            userId: input.player3User
          },
          player4: {
            userId: input.player4User
          }
        }
      });

      console.log('Game created');
      console.log(newGame);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error creating game');
    }
  };

  return (
    <Container maxWidth="md" sx={{ p: 2 }}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          {/*             <TextField
              sx={{ display: 'none' }}
              label="Player 1 (non user)"
              value={input.player1}
              onChange={(event) => handleChange('player1', event.target.value)}
            /> */}
          <Grid md={3}>
            <FormControl>
              <FormLabel>Player 1 (user)</FormLabel>
              <Select
                placeholder="Choose player"
                value={input.player1User}
                onChange={(_, value) =>
                  handleChange('player1User', value || '')
                }
              >
                {availablePlayers.player1.map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid md={3}>
            {/*             <TextField
              sx={{ display: 'none' }}
              label="Player 2 (non user)"
              value={input.player2}
              onChange={(event) => handleChange('player2', event.target.value)}
            /> */}
            <FormControl>
              <FormLabel>Player 2 (user)</FormLabel>
              <Select
                placeholder="Choose player"
                value={input.player2User}
                onChange={(_, value) =>
                  handleChange('player2User', value || '')
                }
              >
                {availablePlayers.player2.map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid md={3}>
            {/*             <TextField
              sx={{ display: 'none' }}
              label="Player 3 (non user)"
              value={input.player3}
              onChange={(event) => handleChange('player3', event.target.value)}
            /> */}
            <FormControl>
              <FormLabel>Player 3 (user)</FormLabel>
              <Select
                placeholder="Choose player"
                value={input.player3User}
                onChange={(_, value) =>
                  handleChange('player3User', value || '')
                }
              >
                {availablePlayers.player3.map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid md={3}>
            {/*             <TextField
              sx={{ display: 'none' }}
              label="Player 4 (non user)"
              value={input.player4}
              onChange={(event) => handleChange('player4', event.target.value)}
            /> */}
            <FormControl>
              <FormLabel>Player 4 (user)</FormLabel>
              <Select
                placeholder="Choose player"
                value={input.player4User}
                onChange={(_, value) =>
                  handleChange('player4User', value || '')
                }
              >
                {availablePlayers.player4.map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" loading={loading} sx={{ mt: 2 }}>
          Create game
        </Button>
      </form>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const users = await getUsers(prismaContext);

  if (!users) {
    throw new Error('Error when fetching nomination data');
  }

  return {
    props: { users }
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  IndexPage
);
