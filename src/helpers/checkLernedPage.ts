import { TDataDictionary } from '../types/types';

const checkLernedPage = (pageWords: TDataDictionary[]) => {
  return pageWords.every((word) => word.optional?.lerned);
};

export default checkLernedPage;
