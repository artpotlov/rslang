import { initHeaderEvent } from '../controllers/header/header-controller';
import header from '../components/header/header.hbs';
import miniGames from '../components/main-page/mini-games.hbs';
import footer from '../components/footer/footer.hbs';

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
