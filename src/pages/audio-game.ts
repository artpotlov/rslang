import './main-page.scss';
import '../components/audio-game/audio.scss';
import header from '../components/main-page/header.hbs';
import { initHeaderEvent } from '../controllers/main-page/header-controller';
import { initStartEvent, createGameWords } from '../controllers/audio-game-controller';
import { IObjectString } from '../types/types';

import main from '../components/audio-game/main.hbs';
import game from '../components/audio-game/game.hbs';

export async function initAudioGame(element: HTMLElement, gameParams?: IObjectString | undefined) {
  document.title = 'Аудиовызов';

  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    <div class="min-h-full flex flex-col">
      ${header()}
      <main class="main flex-auto p-4 flex justify-center items-center bg-blue-900 text-indigo-50"></main>
    </div>
  `;

  const mainElement: HTMLElement | null = document.querySelector('.main');
  if (!mainElement) throw new Error('mainElement is null');

  if (gameParams) {
    mainElement.innerHTML = game(await createGameWords(gameParams));
  } else {
    mainElement.innerHTML = main();
  }

  initStartEvent(mainElement);
  initHeaderEvent();
}
