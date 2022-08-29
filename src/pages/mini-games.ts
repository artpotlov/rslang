import { initHeaderEvent } from '../controllers/main-page/header-controller';

import './main-page.scss';

import header from '../components/main-page/header.hbs';
import miniGames from '../components/main-page/mini-games.hbs';
import footer from '../components/main-page/footer.hbs';

export const initMiniGames = (element: HTMLElement): void => {
  document.title = 'Мини-игры';
  const rootElement: HTMLElement = element;
  const wrapper = `
    <div class="min-h-full flex flex-col">
      ${header()}
      ${miniGames()}
      ${footer()}
    </div>`;
  rootElement.innerHTML = wrapper;

  const headerContainer: HTMLElement | null = document.querySelector('.header');
  if (!headerContainer) throw new Error('headerContainer is null');

  initHeaderEvent(headerContainer);
};
