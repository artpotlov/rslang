import { TDataDictionary } from '../types/types';
import { getRandomNumber } from './random-number';

export function shuffle(array: TDataDictionary[], el: TDataDictionary) {
  const shuffleArray = array;
  shuffleArray.splice(shuffleArray.indexOf(el), 1);
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = getRandomNumber(0, i);
    [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
  }
  return shuffleArray;
}
