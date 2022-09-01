/* eslint-disable no-await-in-loop */
import loadingTemplate from '../../components/sprint-game/loading.hbs';
import { getChunkUserWords, getChunkWords } from '../../utils/api';
import { router } from '../../utils/router-storage';
import { runSprintGame } from './game';
import { sprintSettings, wordsStore } from './storage';
import { IObjectString, IUserAggregateBase, IUserData } from '../../types/types';
import { getLevelValue } from './view';
import { getLSData } from '../../utils/local-storage';

const getCurrentData = async (params: IObjectString) => {
  const group = Number(params.group);
  let page = Number(params.page);
  const userData = getLSData<IUserData>('userData');

  if (!userData) return;

  const { token, userId } = userData;

  if (!userId || !token) {
    router.navigateTo('auth');
  }

  const tmpWordStore: IUserAggregateBase[] = [];
  let cycleRequest = true;

  while (cycleRequest) {
    const response = await getChunkUserWords({
      group: group - 1,
      page: page - 1,
      wordsPerPage: 20,
      userId,
      token,
      isLearnedWords: false,
    });

    if (response.status !== 200 || !response.params) {
      router.navigateTo('dictionary');
      return;
    }

    tmpWordStore.push(...response.params[0].paginatedResults);

    if (page < 1 || tmpWordStore.length === 20) {
      cycleRequest = false;
    } else {
      page -= 1;
    }
  }

  wordsStore.push(...tmpWordStore);

  if (wordsStore.length === 0) {
    router.navigateTo('dictionary');
  }

  wordsStore.sort(() => Math.random() - 0.5);
};

const getCommonDataWithoutParams = async () => {
  const group = getLevelValue();
  const userData = getLSData<IUserData>('userData');

  if (!userData) return;

  const { token, userId } = userData;

  if (!userId || !token) {
    router.navigateTo('auth');
    return;
  }

  const response = await getChunkUserWords({
    group,
    wordsPerPage: 600,
    userId,
    token,
    isLearnedWords: true,
  });

  if (response.status !== 200 || !response.params) {
    router.navigateTo('mini-games');
    return;
  }

  wordsStore.push(...response.params[0].paginatedResults);

  if (wordsStore.length === 0) {
    router.navigateTo('mini-games');
  }

  wordsStore.sort(() => Math.random() - 0.5);
  wordsStore.splice(100);
};

const getCommonData = async () => {
  const group = getLevelValue().toString();
  const arrayPromises = new Array(30).fill('0').map((e, i) => {
    const page = i.toString();
    return getChunkWords({ group, page });
  });
  const response = await Promise.all(arrayPromises);

  if (response.length === 0) router.navigateTo('mini-games');

  wordsStore.push(
    ...response
      .filter(({ status }) => status === 200)
      .map(({ params }) => params)
      .flat(),
  );

  if (wordsStore.length === 0) {
    router.navigateTo('mini-games');
  }

  wordsStore.sort(() => Math.random() - 0.5);
};

export const loadGame = async (element: HTMLElement, params?: IObjectString) => {
  const sprintGameElement = element;

  sprintGameElement.innerHTML = loadingTemplate({ processText: 'Подготавливаю игру' });

  if (!sprintSettings.isAuth) {
    await getCommonData();
    sprintSettings.blockGame = false;
  }

  if (sprintSettings.isAuth && !params) {
    await getCommonDataWithoutParams();
    sprintSettings.blockGame = false;
  }

  if (sprintSettings.isAuth && params) {
    await getCurrentData(params);
    sprintSettings.blockGame = false;
  }

  if (!sprintSettings.blockGame) {
    runSprintGame(sprintGameElement);
  } else {
    router.navigateTo('mini-games');
  }
};
