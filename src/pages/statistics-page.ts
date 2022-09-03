import { initHeaderEvent } from '../controllers/header/header-controller';
import initStatisticsController  from '../controllers/statistics/statistics-controller';
import header from '../components/header/header.hbs';
import statistic from '../components/statistics/statistics.hbs';
import footer from '../components/footer/footer.hbs';

export const initStatistics = (element: HTMLElement): void => {
  document.title = 'Статистика';
  const rootElement: HTMLElement = element;
  rootElement.innerHTML = `
    ${header({ activePage: { statistics: true } })}
    ${statistic()}
    ${footer()}
  `;
  initHeaderEvent();
  initStatisticsController();
};
