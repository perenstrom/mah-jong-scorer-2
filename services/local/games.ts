import type { CreateGame } from 'schemas/zodSchemas';
import type { Game } from 'types/types';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const createGame = async (game: CreateGame): Promise<Game> => {
  const url = '/api/games';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(game)
  };

  const result = await (await fetch(url, options)).json();

  return result;
};
