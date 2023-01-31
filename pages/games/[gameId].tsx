import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Box, Stack, styled } from '@mui/joy';
import { InputRow } from 'components/gameDetails/InputRow';
import { LeaderBoardItem } from 'components/gameDetails/LeaderBoardItem';
import { SaveButton } from 'components/gameDetails/SaveButton';
import { calculateStandings } from 'helpers/gameHelper';
import { generatePlayerInitials } from 'helpers/playerHelper';
import { calculateResults } from 'helpers/transactionHelper';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';
import { getExpandedGame } from 'services/prisma/games';
import { getTransactions } from 'services/prisma/transactions';
import {
  ExpandedGame,
  PlayerNumber,
  Transaction,
  TransactionResult
} from 'types/types';

const TableBodyRow = styled('tr')`
  &:nth-child(odd) {
    background-color: #f1f6ff;
  }
`;

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
  playerInitials: Record<`player${PlayerNumber}`, string>;
}
const GameDetailsPage: NextPage<Props> = ({
  game,
  transactions,
  playerInitials
}) => {
  const leaderboard = [
    { player: game.players.player1, result: game.results.player1 || 0 },
    { player: game.players.player2, result: game.results.player2 || 0 },
    { player: game.players.player3, result: game.results.player3 || 0 },
    { player: game.players.player4, result: game.results.player4 || 0 }
  ].sort((a, b) => (b.result || 0) - (a.result || 0));

  const [scoreInput, setScoreInput] = useState({
    player1: '0',
    player2: '0',
    player3: '0',
    player4: '0'
  });
  const updateScoreInput = (playerNumber: PlayerNumber) => (value: string) => {
    setScoreInput({ ...scoreInput, [`player${playerNumber}`]: value });
  };

  const [windPlayer, setWindPlayer] = useState<PlayerNumber>(1);
  const [winnerPlayer, setWinnerPlayer] = useState<PlayerNumber | null>(null);

  const colors = {
    1: { background: '#F26419', text: 'black' },
    2: { background: '#21C46D', text: 'black' },
    3: { background: '#33658A', text: 'white' },
    4: { background: '#F6AE2D', text: 'black' }
  };
  const generateInputRow = (playerNumber: PlayerNumber) => (
    <InputRow
      initials={playerInitials[`player${playerNumber}`]}
      color={colors[playerNumber]}
      value={scoreInput[`player${playerNumber}`]}
      onValueChange={updateScoreInput(playerNumber)}
      windSelected={windPlayer === playerNumber}
      winnerSelected={winnerPlayer === playerNumber}
      selectWind={() => setWindPlayer(playerNumber)}
      selectWinner={() => setWinnerPlayer(playerNumber)}
    />
  );

  return (
    <>
      <Stack direction="row" sx={{ height: '15rem' }}>
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
        <Stack sx={{ flexBasis: '20rem', minWidth: '0' }} component="form">
          {generateInputRow(1)}
          {generateInputRow(2)}
          {generateInputRow(3)}
          {generateInputRow(4)}
          <Box sx={{ flex: '1' }}>
            <SaveButton>Save</SaveButton>
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

  const playerInitials = generatePlayerInitials({
    player1: game.players.player1.user?.name || '',
    player2: game.players.player2.user?.name || '',
    player3: game.players.player3.user?.name || '',
    player4: game.players.player4.user?.name || ''
  });

  if (!game.meta.finished) {
    game.results = calculateStandings(transactions);
  }

  return {
    props: {
      game,
      transactions: calculateResults(transactions),
      playerInitials
    }
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  GameDetailsPage
);
