import { calculateTransaction } from './transactionHelper';

describe('CalculateTransaction', () => {
  it('Calculates correct', async () => {
    const inputPoints: Parameters<typeof calculateTransaction>[0] = {
      player1: 8,
      player2: 26,
      player3: 32,
      player4: 4,
      mahJongPlayer: 2,
      windPlayer: 1
    };
    const actualResult = calculateTransaction(inputPoints);

    const expectedResult: ReturnType<typeof calculateTransaction> = {
      player1: {
        // (mahjong * wind * points)                             
        // (1       * 2    * 8       + 1*2*8 + 0*2*8 + 1*2*8) - (0*2*8 + 1*2*26 + 1*2*32 + 1*2*4),
        change: -92, 
        mahJong: false,
        points: 8,
        wind: true
      },
      player2: {
        change: 104,
        mahJong: true,
        points: 26,
        wind: false
      },
      player3: {
        change: 50, // 96 - 16 - 26 - 4,
        mahJong: false,
        points: 32,
        wind: false
      },
      player4: {
        change: -62, // 12 - 16 - 26 - 32,
        mahJong: false,
        points: 4,
        wind: false
      }
    };
    expect(actualResult).toEqual(expectedResult);
  });
});
