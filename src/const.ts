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
  iconWordLearned: 'text-emerald-500',
  iconWordDifficult: 'text-rose-700',
  cardWordDefault: 'to-blue-200',
  cardWordLearned: 'to-[rgb(16,185,129,.2)]',
  cardWordDifficult: 'to-[rgb(185,16,129,.2)]',
  colorGroupOne: 'shadow-[inset_0_0_30px_0_rgba(0,0,0,0.4)]',
  colorGroupTwo: 'shadow-[inset_0_0_30px_0_rgba(255,112,0,0.4)]',
  colorGroupThree: 'shadow-[inset_0_0_30px_0_rgba(255,255,0,0.6)]',
  colorGroupFour: 'shadow-[inset_0_0_30px_0_rgba(0,255,255,0.4)]',
  colorGroupFive: 'shadow-[inset_0_0_30px_0_rgba(0,0,255,0.4)]',
  colorGroupSix: 'shadow-[inset_0_0_30px_0_rgba(255,0,255,0.4)]',
  colorGroupSeven: 'shadow-[inset_0_0_30px_0_rgba(255,0,0,0.4)]',
  bgLearnedPage: ['bg-gradient-to-r', 'from-white', 'via-green-100', 'to-green-50'],
};

export const MAX_PAGE_DICTIONARY = 30;

export const GROUP_DIFFICULT = '7';
