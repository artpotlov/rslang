import header from '../components/header/header.hbs';
import { initHeaderEvent } from '../controllers/header/header-controller';
import { initStartEvent } from '../controllers/audio-game/audio-game-controller';
import { IObjectString } from '../types/types';

import main from '../components/audio-game/main.hbs';

export async function initAudioGame(element: HTMLElement, gameParams?: IObjectString) {
  document.title = 'Аудиовызов';

  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    ${header({ activePage: { miniGames: true } })}
    <main class="main flex-auto p-4 flex justify-center items-center bg-blue-50"></main>
  `;

  const mainElement: HTMLElement | null = document.querySelector('.main');
  if (!mainElement) throw new Error('mainElement is null');
  mainElement.innerHTML = main();

  if (gameParams) {
    const difficulty = document.querySelector('.fieldset');
    difficulty?.classList.add('hidden');
  }

  initStartEvent(mainElement, gameParams);
  initHeaderEvent();
}
