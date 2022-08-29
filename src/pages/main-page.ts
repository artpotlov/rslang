import { initHeaderEvent } from '../controllers/main-page/header-controller';
import { initMainEvent } from '../controllers/main-page/main-page-controller';

import './main-page.scss';

import header from '../components/main-page/header.hbs';
import main from '../components/main-page/main.hbs';
import footer from '../components/main-page/footer.hbs';
import team from '../components/main-page/team.hbs';

export const initMainPage = (element: HTMLElement): void => {
  document.title = 'Главная страница';
  const rootElement: HTMLElement = element;
  const wrapper = `
    <div class="min-h-full flex flex-col">
      ${header()}
      ${main()}
      ${footer()}
    </div>`;
  rootElement.innerHTML = wrapper;

  const headerContainer: HTMLElement | null = document.querySelector('.header');
  if (!headerContainer) throw new Error('headerContainer is null');

  initHeaderEvent(headerContainer);
  initMainEvent();
};

export const initAboutTeam = (element: HTMLElement): void => {
  document.title = 'Наша команда';
  const rootElement: HTMLElement = element;
  const wrapper = `
    <div class="min-h-full flex flex-col">
      ${header()}
      ${team()}
      ${footer()}
    </div>`;
  rootElement.innerHTML = wrapper;

  const headerContainer: HTMLElement | null = document.querySelector('.header');
  if (!headerContainer) throw new Error('headerContainer is null');

  initHeaderEvent(headerContainer);
};
