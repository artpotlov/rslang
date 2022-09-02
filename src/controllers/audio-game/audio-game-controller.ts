import game from '../../components/audio-game/game.hbs';
import { getChunkWords } from '../../utils/api';
import { getRandomNumber } from '../../utils/random-number';
import { playSoundWord, playSoundRes } from '../sprint-game/audio';
import { audioGameSettings } from './storage';
import { shuffle } from '../../utils/shuffle';
import { IObjectString, TDataDictionary } from '../../types/types';
import { API_URL } from '../../const';

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
      word: el,
      word1: answers[0],
      word2: answers[1],
      word3: answers[2],
      word4: answers[3],
      word5: answers[4],
    };
  });

  return gameWords;
}

let words: {
  word: TDataDictionary;
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  word5: string;
}[];

let idx = 0;

function answer() {
  const btn: HTMLElement | null = document.querySelector('.dont-know-btn');
  const hiddenAnswerItems: NodeListOf<HTMLElement> | null =
    document.querySelectorAll('.hidden-answer');
  if (!btn || !hiddenAnswerItems) return;

  btn.dataset.game = 'next';
  btn.innerText = 'Далее';
  hiddenAnswerItems.forEach((el) => {
    el.classList.toggle('hidden');
  });

  audioGameSettings.hasAnswer = true;
}

function rightAnswer() {
  const listItems: NodeListOf<HTMLElement> | undefined =
    document.querySelectorAll('[data-game="answer"]');
  listItems?.forEach((el) => {
    const listItem = el;
    listItem.dataset.game = 'inactive';
    if (el.innerText === words[idx].word.wordTranslate) {
      el.querySelector('.right')?.classList.remove('hidden');
      el.classList.add('list-none', 'text-lime-400');
    }
  });
}

function wrongAnswer(target: HTMLElement) {
  target.querySelector('.wrong')?.classList.remove('hidden');
  target.classList.add('list-none', 'text-red-400');
}

async function clickBtns(target: EventTarget, element: HTMLElement, gameParams?: IObjectString) {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const rootElement: HTMLElement = element;

  switch (target.dataset.game) {
    case 'start-game':
      words = await createGameWords(gameParams);
      rootElement.innerHTML = game({ API_URL, ...words[idx] });
      playSoundWord(`${API_URL}/${words[idx].word.audio}`);
      break;
    case 'dont-know':
      playSoundRes(false);
      answer();
      rightAnswer();
      // 'показать правильное слово и запомнить как ошибку'
      break;
    case 'next':
      idx += 1;
      audioGameSettings.hasAnswer = false;
      rootElement.innerHTML = game({ API_URL, ...words[idx] });
      playSoundWord(`${API_URL}/${words[idx].word.audio}`);
      break;
    case 'answer':
      answer();
      if (target.innerText !== words[idx].word.wordTranslate) {
        wrongAnswer(target);
        playSoundRes(false);
      } else {
        playSoundRes(true);
      }
      rightAnswer();
      break;
    case 'play-audio':
      playSoundWord(`${API_URL}/${words[idx].word.audio}`);
      break;
    default:
      break;
  }
}

function pressingKeys(key: string) {
  const dontKnowBtn = document.querySelector('.dont-know-btn');
  if (key === 'Enter') {
    const event = new MouseEvent('click', { bubbles: true });
    dontKnowBtn?.dispatchEvent(event);
  }

  if (key === ' ' && words) {
    playSoundWord(`${API_URL}/${words[idx].word.audio}`);
  }

  if (audioGameSettings.hasAnswer) return;

  const answersItems = document.querySelectorAll('[data-game="answer"]');
  answersItems.forEach((el, i) => {
    if (key === String(i) && key !== '0') {
      const event = new MouseEvent('click', { bubbles: true });
      el.dispatchEvent(event);
    }
  });
}

export const initStartEvent = (element: HTMLElement, gameParams?: IObjectString) => {
  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickBtns(event.target, element, gameParams);
    }
  });

  document.addEventListener('keyup', ({ key }) => {
    pressingKeys(key);
  });
};
