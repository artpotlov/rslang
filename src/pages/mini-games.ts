import '../components/main-page/main-page.scss';
import { initHeaderEvent } from '../controllers/main-page/header-controller';
import header from '../components/main-page/header.hbs';
import miniGames from '../components/main-page/mini-games.hbs';
import footer from '../components/main-page/footer.hbs';

export const initMiniGames = (element: HTMLElement): void => {
  document.title = 'Мини-игры';
  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    ${header({ activePage: { miniGames: true } })}
    ${miniGames()}
    ${footer()}
  `;

  initHeaderEvent();
};
