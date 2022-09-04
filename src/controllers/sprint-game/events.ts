import { API_URL } from '../../const';
import { router } from '../../utils/router-storage';
import { checkWord } from './game';
import { resetStorage, sprintSettings, wordsStore } from './storage';
import { loadGame } from './welcome';
import { resetGameStatistics, resetRemoteStatsStore } from '../../utils/statistic/statistic';
import { playSoundWord } from './audio';

const closeGame = () => {
  resetStorage();
  resetGameStatistics();
  resetRemoteStatsStore();
  router.navigateTo('mini-games');
};

export const initSprintGameEvents = (sprintGameElement: HTMLElement) => {
  sprintGameElement.addEventListener('click', ({ currentTarget, target }) => {
    if (!(currentTarget instanceof HTMLElement) || !(target instanceof HTMLButtonElement)) return;

    const index =
      sprintSettings.index >= wordsStore.length ? wordsStore.length - 1 : sprintSettings.index;

    switch (target.dataset.role) {
      case 'sprint-game__btn-start':
        loadGame(currentTarget);
        break;
      case 'sprint-game__btn-wrong':
        checkWord(false);
        break;
      case 'sprint-game__btn-success':
        checkWord(true);
        break;
      case 'sprint-game__btn-audio':
        playSoundWord(`${API_URL}/${wordsStore[index].audio}`);
        break;
      case 'sprint-game__btn-close':
        closeGame();
        break;
      default:
        closeGame();
    }
  });

  document.addEventListener('keyup', ({ key }) => {
    const gameElement = document.querySelector<HTMLElement>('[data-role="sprint-game__score"]');

    if (!gameElement) return;

    const index =
      sprintSettings.index >= wordsStore.length ? wordsStore.length - 1 : sprintSettings.index;

    if (key === 'ArrowLeft') {
      checkWord(false);
    }

    if (key === 'ArrowRight') {
      checkWord(true);
    }

    if (key === ' ') {
      playSoundWord(`${API_URL}/${wordsStore[index].audio}`);
    }
  });
};
