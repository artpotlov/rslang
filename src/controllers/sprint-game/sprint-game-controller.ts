import welcomeTemplate from '../../components/sprint-game/welcome.hbs';
import loadingTemplate from '../../components/sprint-game/loading.hbs';
import { initSprintGameEvents } from './events';
import { IObjectString, TSprintGameMode } from '../../types/types';
import { resetStorage, sprintSettings } from './storage';
import { resetGameStatistics, resetRemoteStatsStore } from '../../utils/statistic/statistic';
import { loadGame } from './welcome';
import { router } from '../../utils/router-storage';
import { checkUserAuth } from '../../utils/user/check-auth';

const checkUserLogin = async () => {
  sprintSettings.isAuth = await checkUserAuth();
};

export const initSprintGameController = async (mode: TSprintGameMode, params?: IObjectString) => {
  const sprintGameElement = document.querySelector<HTMLElement>('[data-role="sprint-game"]');

  if (!sprintGameElement) return;

  resetStorage();
  resetGameStatistics();
  resetRemoteStatsStore();

  sprintGameElement.innerHTML = loadingTemplate({
    processText: 'Устанавливаю соединение с сервером',
  });

  await checkUserLogin();

  if (mode === 'book' && params) {
    await loadGame(sprintGameElement, params);
  } else {
    router.navigateTo('sprint-game');
  }

  if (mode === 'common') {
    sprintGameElement.innerHTML = welcomeTemplate({ isAuth: sprintSettings.isAuth });
  }

  initSprintGameEvents(sprintGameElement);
};
