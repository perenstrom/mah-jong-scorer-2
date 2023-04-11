import { generatePlayerInitials } from './playerHelper';

describe('PlayerHelper', () => {
  describe('generatePlayerInitials', () => {
    it('Returns correct on unique input with long names', async () => {
      const input: Parameters<typeof generatePlayerInitials>[0] = {
        player1: 'Jobjörn',
        player2: 'Per',
        player3: 'Sara',
        player4: 'Hedvig'
      };

      const initials = generatePlayerInitials(input);

      const expectedInitials: ReturnType<typeof generatePlayerInitials> = {
        player1: 'Jo',
        player2: 'Pe',
        player3: 'Sa',
        player4: 'He'
      };
      expect(initials).toEqual(expectedInitials);
    });

    it('Returns correct on unique input with short names', async () => {
      const input: Parameters<typeof generatePlayerInitials>[0] = {
        player1: 'J',
        player2: 'Per',
        player3: 'S',
        player4: 'Hedvig'
      };

      const initials = generatePlayerInitials(input);

      const expectedInitials: ReturnType<typeof generatePlayerInitials> = {
        player1: 'J',
        player2: 'Pe',
        player3: 'S',
        player4: 'He'
      };
      expect(initials).toEqual(expectedInitials);
    });

    it('Returns correct on non unique input with long names', async () => {
      const input: Parameters<typeof generatePlayerInitials>[0] = {
        player1: 'Jobjörn',
        player2: 'Johanna',
        player3: 'Sara',
        player4: 'Hedvig'
      };

      const initials = generatePlayerInitials(input);

      const expectedInitials: ReturnType<typeof generatePlayerInitials> = {
        player1: 'Jo',
        player2: 'Joh',
        player3: 'Sa',
        player4: 'He'
      };
      expect(initials).toEqual(expectedInitials);
    });

    it('Returns correct on more non unique input with long names', async () => {
      const input: Parameters<typeof generatePlayerInitials>[0] = {
        player1: 'Jobjörn',
        player2: 'Johanna',
        player3: 'Joel',
        player4: 'Hedvig'
      };

      const initials = generatePlayerInitials(input);

      const expectedInitials: ReturnType<typeof generatePlayerInitials> = {
        player1: 'Jo',
        player2: 'Joh',
        player3: 'Joe',
        player4: 'He'
      };
      expect(initials).toEqual(expectedInitials);
    });
  });
});
