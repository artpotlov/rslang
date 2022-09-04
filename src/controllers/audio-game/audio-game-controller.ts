import game from '../../components/audio-game/game.hbs';
import resultTemplate from '../../components/audio-game/result.hbs';
import loadingTemplate from '../../components/sprint-game/loading.hbs';
import { getChunkWords, getChunkUserWords } from '../../utils/api';
import { getRandomNumber } from '../../utils/random-number';
import { playSoundWord, playSoundRes } from '../sprint-game/audio'; // функция воспроизведения аудио использует sprint-game storage!
import { audioGameSettings, successWords, wrongWords, resetStorage, words } from './storage';
import { shuffle } from '../../utils/shuffle';
import {
  IObjectString,
  TDataDictionary,
  TDataDictionaryResponse,
  IUserAggregateWordsResponse,
  IUserAggregateBase,
  IUserData,
} from '../../types/types';
import { API_URL } from '../../const';
import { router } from '../../utils/router-storage';
import { getLSData } from '../../utils/local-storage';
import { checkUserAuth } from '../../utils/user/check-auth';

export function getGameDifficulty() {
  const selectDifficulty: HTMLSelectElement | null = document.querySelector(
    'select[name="game-difficulty"]',
  );
  if (!selectDifficulty) throw new Error('selectDifficulty is null');

  return selectDifficulty.value;
}

export async function getWords(sendParams: IObjectString) {
  const response: TDataDictionaryResponse = await getChunkWords(sendParams);
  return response;
}

async function getUserWords(
  sendParams = { group: audioGameSettings.gameDifficulty, page: String(getRandomNumber(0, 29)) },
) {
  const group = Number(sendParams.group);
  const page = Number(sendParams.page);
  const userData = getLSData<IUserData>('userData');

  if (!userData) return false;

  const { token, userId } = userData;
  const response: IUserAggregateWordsResponse = await getChunkUserWords({
    group,
    page,
    wordsPerPage: 20,
    userId,
    token,
    isLearnedWords: true,
  });

  /* if (response.status !== 200 || !response.params) return false; */
  return response;
}

export async function createGameWords(isAuth: boolean, sendParams?: IObjectString) {
  let array: IUserAggregateBase[];
  if (isAuth) {
    console.log('auth yes');
    const response = await getUserWords(sendParams);
    if (!response) return false;
    const { params } = response;
    if (!params) return false;
    array = [...params[0].paginatedResults];
  }
  const response = await getWords({
    group: audioGameSettings.gameDifficulty,
    page: String(getRandomNumber(0, 29)),
  });
  array = [...response.params];
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

async function getGameData(sendParams?: IObjectString) {
  if (await checkUserAuth()) audioGameSettings.isAuth = true;
  const response = await createGameWords(audioGameSettings.isAuth, sendParams);
  if (!response) return false;
  words.push(...response);

  if (words.length === 0) return false;
  return true;
}

async function startGame(element: HTMLElement, sendParams?: IObjectString) {
  const rootElement = element;

  audioGameSettings.gameDifficulty = getGameDifficulty();

  rootElement.innerHTML = loadingTemplate({ processText: 'Подготавливаю игру' });
  audioGameSettings.isRunGame = await getGameData(sendParams);

  if (!audioGameSettings.isRunGame) {
    router.navigateTo('mini-games');
    return;
  }

  rootElement.innerHTML = game({ API_URL, ...words[audioGameSettings.idx] });
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
      el.classList.add('list-none', 'text-lime-600');
    }
  });
}

function wrongAnswer(target: HTMLElement) {
  target.querySelector('.wrong')?.classList.remove('hidden');
  target.classList.add('list-none', 'text-red-500');
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
      startGame(element, gameParams);
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
      } else {
        successWords.push(words[audioGameSettings.idx].word);
        playSoundRes(true);
      }
      rightAnswer();
      break;
    case 'play-audio':
      playSoundWord(`${API_URL}/${words[audioGameSettings.idx].word.audio}`);
      break;
    case 'play-audio_results':
      playSoundWord(`${API_URL}/${words.find((el) => el.word.id === target.id)?.word.audio}`);
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
    if (event.key === String(i + 1)) {
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
