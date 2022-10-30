import { NextPage } from 'next';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Button, Stack, TextField } from '@mui/joy';
import { FormEventHandler, useState } from 'react';
import { createGame } from 'services/local/games';

interface Props {}

const IndexPage: NextPage<Props> = ({}) => {
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
            nonUser: input.player1
          },
          player2: {
            nonUser: input.player2
          },
          player3: {
            nonUser: input.player3
          },
          player4: {
            nonUser: input.player4
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
    <div>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Player 1 (non user)"
              value={input.player1}
              onChange={(event) => handleChange('player1', event.target.value)}
            />
            <TextField
              sx={{ display: 'none' }}
              label="Player 1 (user id)"
              value={input.player1User}
              onChange={(event) =>
                handleChange('player1User', event.target.value)
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Player 2 (non user)"
              value={input.player2}
              onChange={(event) => handleChange('player2', event.target.value)}
            />
            <TextField
              sx={{ display: 'none' }}
              label="Player 2 (user id)"
              value={input.player2User}
              onChange={(event) =>
                handleChange('player2User', event.target.value)
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Player 3 (non user)"
              value={input.player3}
              onChange={(event) => handleChange('player3', event.target.value)}
            />
            <TextField
              sx={{ display: 'none' }}
              label="Player 3 (user id)"
              value={input.player3User}
              onChange={(event) =>
                handleChange('player3User', event.target.value)
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Player 4 (non user)"
              value={input.player4}
              onChange={(event) => handleChange('player4', event.target.value)}
            />
            <TextField
              sx={{ display: 'none' }}
              label="Player 4 (user id)"
              value={input.player4User}
              onChange={(event) =>
                handleChange('player4User', event.target.value)
              }
            />
          </Stack>
        </Stack>
        <Button type="submit" loading={loading}>
          Create game
        </Button>
      </form>
    </div>
  );
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  IndexPage
);
