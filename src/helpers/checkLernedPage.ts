import { TDataDictionary } from '../types/types';

const checkLernedPage = (pageWords: TDataDictionary[]) => {
  if (!pageWords.length) return false;
  return pageWords.every((word) => word.optional?.lerned);
};

export default checkLernedPage;
