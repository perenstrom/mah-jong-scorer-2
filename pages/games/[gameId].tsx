import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Box, Button, Stack, styled, Typography } from '@mui/joy';
import { calculateStandings } from 'helpers/gameHelper';
import { calculateResults } from 'helpers/transactionHelper';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { getExpandedGame } from 'services/prisma/games';
import { getTransactions } from 'services/prisma/transactions';
import { ExpandedGame, Transaction, TransactionResult } from 'types/types';

const TableBodyRow = styled('tr')`
  &:nth-child(odd) {
    background-color: #f1f6ff;
  }
`;

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
      alignItems: 'baseline',
      borderBottom: '1px solid #eee'
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

const ChangeCell: React.FC<{ transactionResult: TransactionResult }> = ({
  transactionResult
}) => {
  const { result, points, change } = transactionResult;
  const text = `${result} (${points} ➔ ${change})`;

  return (
    <Box component="td" p={1}>
      {text}
    </Box>
  );
};

interface Props {
  game: ExpandedGame;
  transactions: Transaction[];
}
const GameDetailsPage: NextPage<Props> = ({ game, transactions }) => {
  const leaderboard = [
    { player: game.players.player1, result: game.results.player1 || 0 },
    { player: game.players.player2, result: game.results.player2 || 0 },
    { player: game.players.player3, result: game.results.player3 || 0 },
    { player: game.players.player4, result: game.results.player4 || 0 }
  ].sort((a, b) => (b.result || 0) - (a.result || 0));

  return (
    <>
      <Stack direction="row">
        <Stack sx={{ flexBasis: '20rem', m: 0, p: 0 }} component="ul">
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
            backgroundColor: '#eee',
            flexGrow: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Graph under construction
        </Box>
        <Stack sx={{ backgroundColor: 'peachpuff', flexBasis: '20rem' }}>
          <Box sx={{ flexGrow: '1' }}>{game.players.player1.user?.name}</Box>
          <Box sx={{ flexGrow: '1' }}>{game.players.player2.user?.name}</Box>
          <Box sx={{ flexGrow: '1' }}>{game.players.player3.user?.name}</Box>
          <Box sx={{ flexGrow: '1' }}>{game.players.player4.user?.name}</Box>
          <Box sx={{ flexGrow: '1' }}>
            <Button variant="plain" sx={{ width: '100%' }}>
              Save
            </Button>
          </Box>
        </Stack>
      </Stack>
      <Box sx={{ paddingTop: 1 }}>
        <Box
          component="table"
          sx={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <Box component="th" p={1}>
                Index
              </Box>
              <Box component="th" p={1}>
                {game.players.player1.user?.name}
              </Box>
              <Box component="th" p={1}>
                {game.players.player2.user?.name}
              </Box>
              <Box component="th" p={1}>
                {game.players.player3.user?.name}
              </Box>
              <Box component="th" p={1}>
                {game.players.player4.user?.name}
              </Box>
            </tr>
          </thead>
          <tbody>
            <TableBodyRow>
              <Box component="td" p={1}></Box>
              <Box component="td" p={1}>
                2000
              </Box>
              <Box component="td" p={1}>
                2000
              </Box>
              <Box component="td" p={1}>
                2000
              </Box>
              <Box component="td" p={1}>
                2000
              </Box>
            </TableBodyRow>
            {transactions.map((transaction) => (
              <TableBodyRow key={transaction.id}>
                <Box component="td" p={1}>
                  {transaction.round}
                </Box>
                <ChangeCell transactionResult={transaction.result.player1} />
                <ChangeCell transactionResult={transaction.result.player2} />
                <ChangeCell transactionResult={transaction.result.player3} />
                <ChangeCell transactionResult={transaction.result.player4} />
              </TableBodyRow>
            ))}
          </tbody>
        </Box>
      </Box>
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

  const [game, transactions] = await Promise.all([
    getExpandedGame(prismaContext, context.params.gameId),
    getTransactions(prismaContext, context.params.gameId)
  ]);

  if (!game || !transactions) {
    throw new Error('Error when fetching games data');
  }

  if (!game.meta.finished) {
    game.results = calculateStandings(transactions);
  }

  return {
    props: { game, transactions: calculateResults(transactions) }
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  GameDetailsPage
);
