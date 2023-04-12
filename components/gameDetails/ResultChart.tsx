import styled from '@emotion/styled';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataset
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ExpandedGame, Transaction } from 'types/types';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid hsl(0, 0%, 80%);
  padding: 1rem;
`;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  }
};

const defaultOptions: Omit<
  ChartDataset<'line', (number | undefined)[]>,
  'data'
> = {
  pointStyle: false,
  tension: 0.5
};

export const ResultChart: React.FC<{
  transactions: Transaction[];
  players: ExpandedGame['players'];
  colors: { 1: string; 2: string; 3: string; 4: string };
}> = ({ transactions, players, colors }) => (
  <Wrapper>
    <Line
      options={options}
      data={{
        labels: [0, ...transactions.map((t) => t.round)],
        datasets: [
          {
            label: players.player1.user?.name,
            data: [2000, ...transactions.map((t) => t.result.player1.result)],
            borderColor: colors[1],
            backgroundColor: colors[1],
            ...defaultOptions
          },
          {
            label: players.player2.user?.name,
            data: [2000, ...transactions.map((t) => t.result.player2.result)],
            borderColor: colors[2],
            backgroundColor: colors[2],
            ...defaultOptions
          },
          {
            label: players.player3.user?.name,
            data: [2000, ...transactions.map((t) => t.result.player3.result)],
            borderColor: colors[3],
            backgroundColor: colors[3],
            ...defaultOptions
          },
          {
            label: players.player4.user?.name,
            data: [2000, ...transactions.map((t) => t.result.player4.result)],
            borderColor: colors[4],
            backgroundColor: colors[4],
            ...defaultOptions
          }
        ]
      }}
    />
  </Wrapper>
);
