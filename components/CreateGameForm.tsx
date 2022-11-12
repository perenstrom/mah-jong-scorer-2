import { useUser } from '@auth0/nextjs-auth0';
import { Stack, Typography } from '@mui/joy';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import { FormEventHandler, useRef, useState } from 'react';
import { createGame } from 'services/local/games';
import { User } from 'types/types';
import { Input, UserSelector } from './UserSelector';

interface Props {
  users: User[];
}

export const CreateGameForm: React.FC<Props> = ({ users }) => {
  const [input, setInput] = useState<Input>({
    player1User: '',
    player2User: '',
    player3User: '',
    player4User: ''
  });

  const handleChange = (key: keyof Input, value: string) => {
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
      await createGame({
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error creating game');
    }
  };
  const player1Action = useRef(null);
  const player2Action = useRef(null);
  const player3Action = useRef(null);
  const player4Action = useRef(null);

  return (
    <>
      <Typography level="h2" mb={4}>
        Create game
      </Typography>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid md={3} xs={6}>
            <UserSelector
              playerNumber={1}
              value={input.player1User}
              action={player1Action}
              availablePlayers={availablePlayers.player1}
              handleChange={handleChange}
            />
          </Grid>
          <Grid md={3} xs={6}>
            <UserSelector
              playerNumber={2}
              value={input.player2User}
              action={player2Action}
              availablePlayers={availablePlayers.player2}
              handleChange={handleChange}
            />
          </Grid>
          <Grid md={3} xs={6}>
            <UserSelector
              playerNumber={3}
              value={input.player3User}
              action={player3Action}
              availablePlayers={availablePlayers.player3}
              handleChange={handleChange}
            />
          </Grid>
          <Grid md={3} xs={6}>
            <UserSelector
              playerNumber={4}
              value={input.player4User}
              action={player4Action}
              availablePlayers={availablePlayers.player4}
              handleChange={handleChange}
            />
          </Grid>
        </Grid>
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="success"
            type="submit"
            loading={loading}
            sx={{ mt: 2 }}
          >
            Create game
          </Button>
        </Stack>
      </form>
    </>
  );
};
