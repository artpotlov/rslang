import '../components/main-page/main-page.scss';
import { initHeaderEvent } from '../controllers/main-page/header-controller';
import { initMainEvent } from '../controllers/main-page/main-page-controller';
import header from '../components/main-page/header.hbs';
import main from '../components/main-page/main.hbs';
import footer from '../components/main-page/footer.hbs';
import team from '../components/main-page/team.hbs';

export const initMainPage = (element: HTMLElement): void => {
  document.title = 'Главная страница';
  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    ${header({ activePage: { main: true } })}
    ${main()}
    ${footer()}
  `;

  initHeaderEvent();
  initMainEvent();
};

export const initAboutTeam = (element: HTMLElement): void => {
  document.title = 'Наша команда';
  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    ${header({ activePage: { team: true } })}
    ${team()}
    ${footer()}
  `;

  initHeaderEvent();
};
