export const API_URL = 'https://rslang-team-sixteen.herokuapp.com';

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const KEYS_LS = {
  userData: 'userData',
};

export enum StatusDifficulty {
  HARD = 'hard',
  EASY = 'easy',
}

export const TITLES_PAGE = {
  dictionary: 'Электронный учебник',
};

export const DINAMIC_CLASSES = {
  invisible: 'hidden',
  iconWordLerned: 'text-emerald-500',
  iconWordDifficult: 'text-rose-700',
  cardWordDefault: 'to-blue-200',
  cardWordLerned: 'to-[rgb(16,185,129,.2)]',
  cardWordDifficult: 'to-[rgb(185,16,129,.2)]',
};

export const MAX_PAGE_DICTIONARY = 30;
