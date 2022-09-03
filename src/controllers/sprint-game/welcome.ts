import loadingTemplate from '../../components/sprint-game/loading.hbs';
import { getChunkUserWords, getChunkWords } from '../../utils/api';
import { runSprintGame } from './game';
import { sprintSettings, wordsStore } from './storage';
import { IObjectString, IUserAggregateBase, IUserData } from '../../types/types';
import { getLevelValue } from './view';
import { getLSData } from '../../utils/local-storage';
import { router } from '../../utils/router-storage';

const getCurrentData = async (params: IObjectString) => {
  const group = Number(params.group);
  let page = Number(params.page);
  const userData = getLSData<IUserData>('userData');

  if (!userData) return false;

  const { token, userId } = userData;

  const tmpWordStore: IUserAggregateBase[] = [];

  const response = await getChunkUserWords({
    group: group - 1,
    wordsPerPage: 600,
    userId,
    token,
    isLearnedWords: false,
  });

  if (response.status !== 200 || !response.params) return false;

  const commonWords = response.params[0].paginatedResults;

  let countWords = 20;
  const setFilter = (p: number) => commonWords.filter((word) => word.page === p - 1);
  let filterRes: IUserAggregateBase[];
  do {
    filterRes = setFilter(page);
    tmpWordStore.push(...filterRes.slice(0, countWords));
    page -= 1;
    countWords -= tmpWordStore.length;
  } while (tmpWordStore.length <= 20 && page >= 1);

  if (tmpWordStore.length === 0) return false;

  wordsStore.push(...tmpWordStore);
  wordsStore.sort(() => Math.random() - 0.5);

  return true;
};

const getCommonDataWithoutParams = async () => {
  const group = getLevelValue();
  const userData = getLSData<IUserData>('userData');

  if (!userData) return false;

  const { token, userId } = userData;

  const response = await getChunkUserWords({
    group,
    wordsPerPage: 600,
    userId,
    token,
    isLearnedWords: true,
  });

  if (response.status !== 200 || !response.params) return false;

  wordsStore.push(...response.params[0].paginatedResults);

  if (wordsStore.length === 0) return false;

  wordsStore.sort(() => Math.random() - 0.5);
  wordsStore.splice(100);

  return true;
};

const getCommonData = async () => {
  const group = getLevelValue().toString();
  const arrayPromises = new Array(30).fill('0').map((e, i) => {
    const page = i.toString();
    return getChunkWords({ group, page });
  });
  const response = await Promise.all(arrayPromises);

  if (response.length === 0) return false;

  wordsStore.push(
    ...response
      .filter(({ status }) => status === 200)
      .map(({ params }) => params)
      .flat(),
  );

  if (wordsStore.length === 0) return false;

  wordsStore.sort(() => Math.random() - 0.5);

  return true;
};

export const loadGame = async (element: HTMLElement, params?: IObjectString) => {
  const sprintGameElement = element;

  sprintGameElement.innerHTML = loadingTemplate({ processText: 'Подготавливаю игру' });

  if (!sprintSettings.isAuth) {
    const isRun = await getCommonData();
    if (!isRun) {
      router.navigateTo('mini-games');
      return;
    }
    sprintSettings.isRunGame = isRun;
  }

  if (sprintSettings.isAuth && !params) {
    const isRun = await getCommonDataWithoutParams();
    if (!isRun) {
      router.navigateTo('mini-games');
      return;
    }
    sprintSettings.isRunGame = isRun;
  }

  if (sprintSettings.isAuth && params) {
    const isRun = await getCurrentData(params);
    if (!isRun) {
      router.navigateTo('dictionary');
      return;
    }
    sprintSettings.isRunGame = isRun;
  }

  if (sprintSettings.isRunGame) {
    runSprintGame(sprintGameElement);
  } else {
    router.navigateTo('');
  }
};
