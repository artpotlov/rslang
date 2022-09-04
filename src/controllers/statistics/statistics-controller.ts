import statisticsShort from '../../components/statistics/statistics-short.hbs';
import statisticsLong from '../../components/statistics/statistics-long.hbs';
import { getStatistics } from '../../utils/api';
import { TUserData } from '../../types/types';
import { getLSData } from '../../utils/local-storage';
import { KEYS_LS } from '../../const';
import { router } from '../../utils/router-storage';
import {
  formingStatisticsLong,
  formingStatisticsShort,
} from '../../utils/statistic/statisticsForTemplate';
import initChart from '../../utils/statistic/initChart';
import checkRequest from '../../utils/checkRequest';

class StatisticsController {
  statisticsElement;

  statisticsContentElement;

  constructor(statisticsElement: HTMLElement, statisticsContentElement: HTMLElement) {
    this.statisticsElement = statisticsElement;
    this.statisticsContentElement = statisticsContentElement;
  }

  setStatisticsView = async () => {
    const userData: TUserData | null = getLSData(KEYS_LS.userData);
    if (!userData) {
      router.redirectTo('auth');
      return;
    }
    const { status, params } = await getStatistics(userData);
    checkRequest(status);
    const statistics = formingStatisticsShort(params);
    const statisticShortTemplate = statisticsShort(statistics);
    this.statisticsContentElement.innerHTML = statisticShortTemplate;
    this.statisticsContentElement.insertAdjacentHTML('beforeend', statisticsLong());
    const newWordsCanvas = document.querySelector('[data-role="statistics-long__new-words"]');
    if (!(newWordsCanvas instanceof HTMLCanvasElement)) return;
    const { newWordsForChart, learnedWordsForChart } = formingStatisticsLong(params);
    initChart(newWordsCanvas, { ...newWordsForChart, title: 'Новые слова' });
    const learnedWordsCanvas = document.querySelector(
      '[data-role="statistics-long__learned-words"]',
    );
    if (!(learnedWordsCanvas instanceof HTMLCanvasElement)) return;
    initChart(learnedWordsCanvas, { ...learnedWordsForChart, title: 'Прогресс изучения' });
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
  statisticsController.setStatisticsView();
};

export default initStatisticsController;
