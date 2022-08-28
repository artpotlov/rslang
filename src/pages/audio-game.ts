import './main-page.scss';
import '../components/audio-game/audio.scss';
import header from '../components/main-page/header.hbs';
// import { initHeaderEvent } from '../controllers/main-page/main-page-controller';
import { initStartEvent } from '../controllers/audio-game-controller';

import main from '../components/audio-game/main.hbs';
import game from '../components/audio-game/game.hbs';

export function initAudioGame(element: HTMLElement) {
  document.title = 'Аудиовызов';

  const context = {
    word: 'word',
    word1: 'word1',
    word2: 'word2',
    word3: 'word3',
    word4: 'word4',
    word5: 'word5',
  };

  const wrapper = `
    <div class="min-h-full flex flex-col">
      ${header()}
      <main class="main flex-auto p-4 flex justify-center items-center bg-blue-900 text-indigo-50">
        ${main()}
      </main>
    </div>
  `;

  const rootElement: HTMLElement = element;
  rootElement.innerHTML = wrapper;

  const headerContainer: HTMLElement | null = document.querySelector('.header');
  if (!headerContainer) throw new Error('headerContainer is null');

  /*   const gameContainer: HTMLElement | null = document.querySelector('.game');
  if (!gameContainer) throw new Error('gameContainer is null'); */

  /* const gameAboutContainer: HTMLElement | null = document.querySelector('.game__about');
  if (!gameAboutContainer) throw new Error('gameAboutContainer is null'); */

  const mainElement: HTMLElement | null = document.querySelector('.main');
  if (!mainElement) throw new Error('mainElement is null');

  initStartEvent(mainElement);

  // initHeaderEvent(headerContainer);
}
