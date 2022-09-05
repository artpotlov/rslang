import { TDataDictionary } from '../types/types';

const checkLearnedPage = (pageWords: TDataDictionary[]) => {
  if (!pageWords.length) return false;
  return pageWords.every((word) => word.optional?.learned);
};

export default checkLearnedPage;
