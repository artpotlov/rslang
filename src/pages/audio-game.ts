import header from '../components/header/header.hbs';
import { initHeaderEvent } from '../controllers/header/header-controller';
import { initStartEvent } from '../controllers/audio-game/audio-game-controller';
import { IObjectString } from '../types/types';
import { resetGameStatistics, resetRemoteStatsStore } from '../utils/statistic/statistic';
import { resetStorage } from '../controllers/audio-game/storage';
import main from '../components/audio-game/main.hbs';

export async function initAudioGame(element: HTMLElement, gameParams?: IObjectString) {
  document.title = 'Аудиовызов';

  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    ${header({ activePage: { miniGames: true } })}
    <main class="main flex-auto p-4 flex justify-center items-center bg-blue-50"></main>
  `;

  const mainElement: HTMLElement | null = document.querySelector('.main');
  if (!mainElement) return;
  mainElement.innerHTML = main();

  if (gameParams) {
    const difficulty = document.querySelector('.fieldset');
    difficulty?.classList.add('hidden');
  }

  resetStorage();
  resetGameStatistics();
  resetRemoteStatsStore();
  initStartEvent(mainElement, gameParams);
  initHeaderEvent();
}
