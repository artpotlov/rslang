import statisticsShort from '../../components/statistics/statistics-short.hbs';
import statisticsLong from '../../components/statistics/statistics-long.hbs';

class StatisticsController {
  statisticsElement;

  statisticsContentElement;

  constructor(statisticsElement: HTMLElement, statisticsContentElement: HTMLElement) {
    this.statisticsElement = statisticsElement;
    this.statisticsContentElement = statisticsContentElement;
  }

  setStatisticsShortView = () => {
    const statisticShortTemplate = statisticsShort();
    this.statisticsContentElement.innerHTML = statisticShortTemplate;
  };

  setStatisticsLongView = () => {
    const statisticsLongTemplate = statisticsLong();
    this.statisticsContentElement.innerHTML = statisticsLongTemplate;
  };

  initEvent = () => {
    const statisticsToggleElement = this.statisticsElement.querySelector(
      '[data-role="statistics__toggle"]',
    );
    if (!(statisticsToggleElement instanceof HTMLElement)) return;
    statisticsToggleElement.addEventListener('click', this.clickControl);
  };

  clickControl = ({ target }: Event) => {
    if (!(target instanceof HTMLElement)) return;
    switch (target.dataset.role) {
      case 'statistics__short-button':
        this.setStatisticsShortView();
        break;
      case 'statistics__long-button':
        this.setStatisticsLongView();
        break;
      default:
        break;
    }
  };
}

const initStatisticsController = async () => {
  const statisticsElement = document.querySelector('[data-role="statistics"]');
  if (!(statisticsElement instanceof HTMLElement)) return;
  const statisticsContentElement = statisticsElement.querySelector(
    '[data-role="statistics__content"]',
  );
  if (!(statisticsContentElement instanceof HTMLElement)) return;
  const statisticsController = new StatisticsController(
    statisticsElement,
    statisticsContentElement,
  );
  statisticsController.setStatisticsShortView();
  statisticsController.initEvent();
};

export default initStatisticsController;
