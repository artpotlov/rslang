import welcomeTemplate from '../../components/sprint-game/welcome.hbs';
import loadingTemplate from '../../components/sprint-game/loading.hbs';
import { initSprintGameEvents } from './events';
import { deleteLSData, getLSData } from '../../utils/local-storage';
import { IObjectString, IUserData, TSprintGameMode } from '../../types/types';
import { resetStorage, sprintSettings } from './storage';
import { resetGameStatistics, resetRemoteStatsStore } from '../../helpers/statistic';
import { loadGame } from './welcome';
import { checkUser } from '../../utils/api';
import { router } from '../../utils/router-storage';

const checkUserLogin = async () => {
  const userData = getLSData<IUserData>('userData');
  if (!userData) {
    sprintSettings.isAuth = false;
    return;
  }

  const { userId, token } = userData;

  if (!userId && !token) {
    sprintSettings.isAuth = false;
    return;
  }

  sprintSettings.isAuth = await checkUser({ userId: userData.userId, token: userData.token });
  if (!sprintSettings.isAuth) deleteLSData('userData');
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

  if (sprintSettings.isAuth && mode === 'book' && params) {
    await loadGame(sprintGameElement, params);
  } else {
    router.navigateTo('sprint-game');
    sprintGameElement.innerHTML = welcomeTemplate({ isAuth: sprintSettings.isAuth });
  }

  initSprintGameEvents(sprintGameElement);
};
