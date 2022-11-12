import {
  Card,
  CardContent,
  Chip,
  ColorPaletteProp,
  Stack,
  Typography
} from '@mui/joy';
import { ExpandedGame, ExpandedPlayer } from 'types/types';

interface Props {
  games: ExpandedGame[];
}

export const GamesList: React.FC<Props> = ({ games }) => {
  const isFinished = (game: ExpandedGame) => !!game.meta.finished;

  const chipText = (
    player: ExpandedPlayer,
    result: number | null,
    isFinished: boolean
  ) =>
    isFinished && result !== null
      ? `${player.user?.name || player.nonUser} | ${result}`
      : player.user?.name || player.nonUser;

  const chipColor = (
    isFinished: boolean,
    playerNumber: 1 | 2 | 3 | 4,
    results: ExpandedGame['results']
  ): ColorPaletteProp => {
    if (isFinished) {
      const winnerPlayerNumber = [
        { playerNumber: 1, result: results.player1 },
        { playerNumber: 2, result: results.player2 },
        { playerNumber: 3, result: results.player1 },
        { playerNumber: 4, result: results.player4 }
      ].sort((a, b) => (b.result || 0) - (a.result || 0))[0].playerNumber;

      return winnerPlayerNumber === playerNumber ? 'success' : 'neutral';
    }

    return 'primary';
  };

  return (
    <>
      <Typography level="h2" mb={4}>
        Games
      </Typography>
      {games.map((game) => (
        <Card row variant="outlined" key={game.id} sx={{ mb: 1 }}>
          <CardContent>
            <Typography level="h5" component="h3" mb={1}>
              {new Date(game.meta.created).toLocaleDateString()}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip
                size="sm"
                color={chipColor(isFinished(game), 1, game.results)}
              >
                {chipText(
                  game.players.player1,
                  game.results.player1,
                  isFinished(game)
                )}
              </Chip>
              <Chip
                size="sm"
                color={chipColor(isFinished(game), 2, game.results)}
              >
                {chipText(
                  game.players.player2,
                  game.results.player2,
                  isFinished(game)
                )}
              </Chip>
              <Chip
                size="sm"
                color={chipColor(isFinished(game), 3, game.results)}
              >
                {chipText(
                  game.players.player3,
                  game.results.player3,
                  isFinished(game)
                )}
              </Chip>
              <Chip
                size="sm"
                color={chipColor(isFinished(game), 4, game.results)}
              >
                {chipText(
                  game.players.player4,
                  game.results.player4,
                  isFinished(game)
                )}
              </Chip>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
