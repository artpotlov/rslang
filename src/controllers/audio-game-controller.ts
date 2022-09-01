import game from '../components/audio-game/game.hbs';
import { getChunkWords } from '../utils/api';
import { getRandomNumber } from '../utils/random-number';
import { shuffle } from '../utils/shuffle';
import { IObjectString, TDataDictionary } from '../types/types';

export function getGameDifficulty() {
  const selectDifficulty: HTMLSelectElement | null = document.querySelector(
    'select[name="game-difficulty"]',
  );
  if (!selectDifficulty) throw new Error('selectDifficulty is null');

  return selectDifficulty.value;
}

export async function getWords(
  sendParams = { group: getGameDifficulty(), page: String(getRandomNumber(0, 29)) },
) {
  const response = await getChunkWords(sendParams);
  return response;
}

export async function createGameWords(sendParams?: IObjectString) {
  const response = await getWords(sendParams);
  const array: TDataDictionary[] = [...response.params];
  const gameWords = array.map((el) => {
    const answersCount = 5;
    const answers: string[] = shuffle([...array], el)
      .slice(0, answersCount)
      .map((elem) => elem.wordTranslate);

    answers[getRandomNumber(0, answersCount - 1)] = el.wordTranslate;

    return {
      word: el.word,
      image: el.image,
      audio: el.audio,
      word1: answers[0],
      word2: answers[1],
      word3: answers[2],
      word4: answers[3],
      word5: answers[4],
    };
  });

  return gameWords;
}

/* const gameWords = nextWord({
  group: '0',
  page: '5',
}); */

let words: {
  word: string;
  image: string;
  audio: string;
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  word5: string;
}[];

let idx = 0;

async function clickStartBtn(target: EventTarget, element: HTMLElement) {
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const rootElement: HTMLElement = element;
  const btn = target;

  switch (target.dataset.game) {
    case 'start-game':
      words = await createGameWords();
      rootElement.innerHTML = game(words[idx]);
      break;
    case 'dont-know':
      btn.dataset.game = 'next';
      btn.innerText = 'Далее';
      // 'показать правильное слово и запомнить как ошибку'
      break;
    case 'next':
      idx += 1;
      rootElement.innerHTML = game(words[idx]);
      break;
    default:
      break;
  }
}

export const initStartEvent = (element: HTMLElement) => {
  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickStartBtn(event.target, element);
    }
  });
};
