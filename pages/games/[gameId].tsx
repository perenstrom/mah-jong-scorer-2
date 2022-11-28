import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Box, Button, Stack, Typography } from '@mui/joy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { getExpandedGame } from 'services/prisma/games';
import { getTransactions } from 'services/prisma/transactions';
import { ExpandedGame, Transaction } from 'types/types';

const LeaderBoardItem: React.FC<{ name: string; points: number }> = ({
  name,
  points
}) => (
  <Stack
    direction="row"
    sx={{
      flexGrow: '1',
      justifyContent: 'space-between',
      p: 1,
      alignItems: 'baseline'
    }}
    component="li"
  >
    <Typography level="h4" component="p">
      {name}
    </Typography>
    <Typography level="h3" component="p">
      {points}
    </Typography>
  </Stack>
);

interface Props {
  game: ExpandedGame;
  transactions: Transaction[];
}
const GameDetailsPage: NextPage<Props> = ({ game, transactions }) => {
  const gameIsFinished = !!game.meta.finished;
  const leaderboard = gameIsFinished
    ? [
        { player: game.players.player1, result: game.results.player1 || 0 },
        { player: game.players.player2, result: game.results.player2 || 0 },
        { player: game.players.player3, result: game.results.player3 || 0 },
        { player: game.players.player4, result: game.results.player4 || 0 }
      ].sort((a, b) => (b.result || 0) - (a.result || 0))
    : [];

  return (
    <>
      <Stack direction="row">
        <Stack
          sx={{ backgroundColor: 'tomato', flexBasis: '20rem', m: 0, p: 0 }}
          component="ul"
        >
          {leaderboard.map((leaderBoardItem) => (
            <LeaderBoardItem
              key={
                leaderBoardItem.player.user?.name ||
                leaderBoardItem.player.nonUser ||
                ''
              }
              name={
                leaderBoardItem.player.user?.name ||
                leaderBoardItem.player.nonUser ||
                ''
              }
              points={leaderBoardItem.result}
            />
          ))}
        </Stack>
        <Box
          sx={{
            backgroundColor: 'lime',
            flexGrow: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          chart
        </Box>
        <Stack sx={{ backgroundColor: 'peachpuff', flexBasis: '20rem' }}>
          <Box sx={{ flexGrow: '1' }}>First player</Box>
          <Box sx={{ flexGrow: '1' }}>Second player</Box>
          <Box sx={{ flexGrow: '1' }}>Third player</Box>
          <Box sx={{ flexGrow: '1' }}>Fourth player</Box>
          <Box sx={{ flexGrow: '1' }}>
            <Button variant="plain" sx={{ width: '100%' }}>
              Save
            </Button>
          </Box>
        </Stack>
      </Stack>
      <div>
        <pre>{JSON.stringify(transactions, null, 2)}</pre>
      </div>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  gameId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.gameId) {
    throw new Error('No game ID in params');
  }

  const game = await getExpandedGame(prismaContext, context.params.gameId);
  const transactions = await getTransactions(
    prismaContext,
    context.params.gameId
  );

  if (!game || !transactions) {
    throw new Error('Error when fetching games data');
  }

  return {
    props: { game, transactions }
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  GameDetailsPage
);
