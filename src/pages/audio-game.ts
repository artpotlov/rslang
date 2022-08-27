import './main-page.scss';
import '../components/audio-game/audio.scss';
import header from '../components/main-page/header.hbs';

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
      <main class="flex-auto p-4 flex justify-center items-center bg-blue-900 text-indigo-50">
        ${main()}
        ${game(context)}
      </main>
    </div>
  `;

  const rootElement: HTMLElement = element;
  rootElement.innerHTML = wrapper;
}
