import { initHeaderEvent, initMainEvent } from '../controllers/main-page/main-page-controller';

import header from '../components/main-page/header.hbs';
import main from '../components/main-page/main.hbs';
import footer from '../components/main-page/footer.hbs';

export const initMainPage = (element: HTMLElement): void => {
  const rootElement: HTMLElement = element;
  const wrapper = `
    <div class="min-h-full flex flex-col">
      ${header()}
      ${main()}
      ${footer()}
    </div>`;
  rootElement.innerHTML += wrapper;

  const headerContainer: HTMLElement | null = document.querySelector('.header');
  if (!headerContainer) throw new Error('headerContainer is null');
  const mainWrap: HTMLElement | null = document.querySelector('.main');
  if (!mainWrap) throw new Error('mainWrap is null');

  initHeaderEvent(headerContainer);
  initMainEvent(mainWrap);
};