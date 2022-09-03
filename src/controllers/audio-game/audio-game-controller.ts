import game from '../../components/audio-game/game.hbs';
import resultTemplate from '../../components/audio-game/result.hbs';
import { getChunkWords } from '../../utils/api';
import { getRandomNumber } from '../../utils/random-number';
import { playSoundWord, playSoundRes } from '../sprint-game/audio';
import { audioGameSettings, successWords, wrongWords, resetStorage, words } from './storage';
import { shuffle } from '../../utils/shuffle';
import { IObjectString, TDataDictionary } from '../../types/types';
import { API_URL } from '../../const';
import { router } from '../../utils/router-storage';

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
    if (el.innerText === words[audioGameSettings.idx].word.wordTranslate) {
      el.querySelector('.right')?.classList.remove('hidden');
      el.classList.add('list-none', 'text-lime-400');
    }
  });
}

function wrongAnswer(target: HTMLElement) {
  target.querySelector('.wrong')?.classList.remove('hidden');
  target.classList.add('list-none', 'text-red-400');
}
const score = 10;

function endGame(element: HTMLElement) {
  const rootElement = element;
  rootElement.innerHTML = resultTemplate({ successWords, wrongWords, score });
}

const closeGame = () => {
  resetStorage();
  // resetGameStatistics();
  // resetRemoteStatsStore();
  router.navigateTo('mini-games');
};

async function clickBtns(target: EventTarget, element: HTMLElement, gameParams?: IObjectString) {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const rootElement: HTMLElement = element;

  switch (target.dataset.game) {
    case 'btn-close':
      closeGame();
      break;
    case 'start-game':
      words.push(...(await createGameWords(gameParams)));
      rootElement.innerHTML = game({ API_URL, ...words[audioGameSettings.idx] });
      playSoundWord(`${API_URL}/${words[audioGameSettings.idx].word.audio}`);
      break;
    case 'dont-know':
      playSoundRes(false);
      answer();
      rightAnswer();
      wrongWords.push(words[audioGameSettings.idx].word);
      break;
    case 'next':
      audioGameSettings.idx += 1;
      if (!words[audioGameSettings.idx]) {
        endGame(element);
        return;
      }
      audioGameSettings.hasAnswer = false;
      rootElement.innerHTML = game({ API_URL, ...words[audioGameSettings.idx] });
      playSoundWord(`${API_URL}/${words[audioGameSettings.idx].word.audio}`);
      break;
    case 'answer':
      answer();
      if (target.innerText !== words[audioGameSettings.idx].word.wordTranslate) {
        wrongWords.push(words[audioGameSettings.idx].word);
        wrongAnswer(target);
        playSoundRes(false);
        console.log(wrongWords);
      } else {
        successWords.push(words[audioGameSettings.idx].word);
        console.log(successWords);
        playSoundRes(true);
      }
      rightAnswer();
      break;
    case 'play-audio':
      playSoundWord(`${API_URL}/${words[audioGameSettings.idx].word.audio}`);
      break;
    default:
      break;
  }
}

function pressingKeys(event: KeyboardEvent) {
  const dontKnowBtn = document.querySelector('.dont-know-btn');
  if (event.key === 'Enter') {
    const customEvent = new MouseEvent('click', { bubbles: true });
    dontKnowBtn?.dispatchEvent(customEvent);
  }

  if (event.key === ' ' && words) {
    playSoundWord(`${API_URL}/${words[audioGameSettings.idx].word.audio}`);
  }

  if (audioGameSettings.hasAnswer) return;

  const answersItems = document.querySelectorAll('[data-game="answer"]');
  answersItems.forEach((el, i) => {
    if (event.key === String(i) && event.key !== '0') {
      const customEvent = new MouseEvent('click', { bubbles: true });
      el.dispatchEvent(customEvent);
    }
  });
}

export const initStartEvent = (element: HTMLElement, gameParams?: IObjectString) => {
  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickBtns(event.target, element, gameParams);
    }
  });

  document.addEventListener('keyup', pressingKeys);
};
