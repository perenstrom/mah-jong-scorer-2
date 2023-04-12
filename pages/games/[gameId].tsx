import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Stack, styled } from '@mui/joy';
import { InputRow } from 'components/gameDetails/InputRow';
import { LeaderBoardItem } from 'components/gameDetails/LeaderBoardItem';
import { ResultChart } from 'components/gameDetails/ResultChart';
import { SaveButton } from 'components/gameDetails/SaveButton';
import { calculateStandings } from 'helpers/gameHelper';
import { generatePlayerInitials } from 'helpers/playerHelper';
import { calculateResults } from 'helpers/transactionHelper';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';
import { createTransaction } from 'services/local/transactions';
import { getExpandedGame } from 'services/prisma/games';
import { getTransactions } from 'services/prisma/transactions';
import {
  ExpandedGame,
  PlayerNumber,
  Transaction,
  TransactionResult
} from 'types/types';

const TableBodyRow = styled('tr')`
  &:nth-of-type(odd) {
    background-color: #f1f6ff;
  }
`;

const ChangeText = styled('span')<{ changeType: 'neg' | 'nil' | 'pos' }>`
  font-weight: bold;
  color: ${({ changeType }) =>
    changeType === 'neg'
      ? '#b90e0a'
      : changeType === 'pos'
      ? '#03ac13'
      : 'black'};
`;

const ChangeCell: React.FC<{
  transactionResult: TransactionResult;
  winner: boolean;
}> = ({ transactionResult, winner }) => {
  const { result, points, change } = transactionResult;
  const changeType = change > 0 ? 'pos' : change < 0 ? 'neg' : 'nil';

  return (
    <Box component="td" p={1}>
      <span>
        {result} ({points} ➔{' '}
        <ChangeText changeType={changeType}>{change}</ChangeText>){' '}
        {winner && <FontAwesomeIcon color="#F6AE2D" icon={faCrown} />}
      </span>
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
  transactions: initialTransactions,
  playerInitials
}) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [results, setResults] = useState(game.results);
  const leaderboard = [
    { player: game.players.player1, result: results.player1 || 0 },
    { player: game.players.player2, result: results.player2 || 0 },
    { player: game.players.player3, result: results.player3 || 0 },
    { player: game.players.player4, result: results.player4 || 0 }
  ].sort((a, b) => (b.result || 0) - (a.result || 0));

  const defaultScores = {
    player1: '0',
    player2: '0',
    player3: '0',
    player4: '0'
  };
  const [scoreInput, setScoreInput] = useState(defaultScores);
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
  const playerColorMap = {
    [game.players.player1.user?.userId || 1]: colors[1],
    [game.players.player2.user?.userId || 2]: colors[2],
    [game.players.player3.user?.userId || 3]: colors[3],
    [game.players.player4.user?.userId || 4]: colors[4]
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

  const resetInput = () => {
    setScoreInput(defaultScores);

    if (windPlayer !== winnerPlayer) {
      setWindPlayer((prev) => (prev + 1 > 4 ? 1 : prev + 1) as PlayerNumber);
    }

    setWinnerPlayer(null);
  };

  const latestRound =
    transactions.length > 0
      ? [...transactions].sort((a, b) => b.round - a.round)[0].round
      : 0;
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!winnerPlayer) return;

    const newTransaction = await createTransaction({
      gameId: game.id,
      round: latestRound + 1,
      result: {
        player1: parseInt(scoreInput.player1, 10),
        player2: parseInt(scoreInput.player2, 10),
        player3: parseInt(scoreInput.player3, 10),
        player4: parseInt(scoreInput.player4, 10)
      },
      mahJongPlayer: winnerPlayer,
      windPlayer: windPlayer
    });

    const newTransactions = calculateResults([...transactions, newTransaction]);
    setTransactions(newTransactions);
    setResults(calculateStandings(newTransactions));
    resetInput();
  };

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
              color={
                playerColorMap[
                  leaderBoardItem.player.user?.userId ||
                    leaderBoardItem.player.nonUser ||
                    ''
                ].background
              }
              points={leaderBoardItem.result}
            />
          ))}
        </Stack>
        <Box
          sx={{
            flexGrow: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {transactions.length > 0 ? (
            <ResultChart
              transactions={transactions}
              players={game.players}
              colors={{
                1: colors[1].background,
                2: colors[2].background,
                3: colors[3].background,
                4: colors[4].background
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid hsl(0, 0%, 80%)',
                width: '100%',
                height: '100%'
              }}
            >
              Game not started, chart not generated
            </Box>
          )}
        </Box>
        <Stack
          sx={{ flexBasis: '20rem', minWidth: '0' }}
          component="form"
          onSubmit={onSubmit}
        >
          {generateInputRow(1)}
          {generateInputRow(2)}
          {generateInputRow(3)}
          {generateInputRow(4)}
          <Box sx={{ flex: '1' }}>
            <SaveButton type="submit">Save</SaveButton>
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
                <ChangeCell
                  transactionResult={transaction.result.player1}
                  winner={transaction.mahJongPlayer === 1}
                />
                <ChangeCell
                  transactionResult={transaction.result.player2}
                  winner={transaction.mahJongPlayer === 2}
                />
                <ChangeCell
                  transactionResult={transaction.result.player3}
                  winner={transaction.mahJongPlayer === 3}
                />
                <ChangeCell
                  transactionResult={transaction.result.player4}
                  winner={transaction.mahJongPlayer === 4}
                />
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
