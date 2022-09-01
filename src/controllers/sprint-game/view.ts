import { IUserAggregateBase } from '../../types/types';
import resultTemplate from '../../components/sprint-game/result.hbs';

export const getLevelValue = () => {
  const selectElement = document.querySelector<HTMLSelectElement>(
    '[data-role="sprint-game__level"]',
  );
  if (!selectElement) return 0;
  return Number(selectElement.value);
};

export const updateTimerView = (sec: number) => {
  const timerElement = document.querySelector<HTMLElement>('[data-role="sprint-game__timer"]');
  if (!timerElement) return;
  timerElement.textContent = sec.toString();
};

export const updateWordsView = (word: string, translateWord: string) => {
  const wordElement = document.querySelector<HTMLElement>(
    '[data-role="sprint-game__original-word"]',
  );
  const translateWordElement = document.querySelector<HTMLElement>(
    '[data-role="sprint-game__translate-word"]',
  );

  if (!wordElement || !translateWordElement) return;

  wordElement.textContent = word;
  translateWordElement.textContent = translateWord;
};

export const updateProgressWordView = (level: number) => {
  const maxLevel = level > 3 ? 3 : level;

  const progressImgElements = document.querySelectorAll<HTMLElement>(
    '[data-role="sprint-game__progress-word"] div',
  );

  if (!progressImgElements) return;

  if (level === 0) {
    progressImgElements.forEach((element) => {
      element.classList.remove('active-progress-word');
      element.classList.add('disable-progress-word');
    });

    return;
  }

  for (let i = 0; i < maxLevel; i += 1) {
    progressImgElements[i].classList.remove('disable-progress-word');
    progressImgElements[i].classList.add('active-progress-word');
  }
};

export const updateProgressLevelView = (level: number) => {
  const maxLevel = level > 3 ? 3 : level;

  const progressImgElements = document.querySelectorAll<HTMLElement>(
    '[data-role="sprint-game__progress-level"] img',
  );

  if (!progressImgElements) return;

  progressImgElements.forEach((element) => {
    element.classList.remove('active-progress-level');
    element.classList.add('disable-progress-level');
  });

  for (let i = 0; i < maxLevel; i += 1) {
    progressImgElements[i].classList.remove('disable-progress-level');
    progressImgElements[i].classList.add('active-progress-level');
  }
};

export const updateScoreView = (score: number) => {
  const scoreElement = document.querySelector<HTMLElement>('[data-role="sprint-game__score"]');
  if (!scoreElement) return;
  scoreElement.textContent = score.toString();
};

export const renderResultsView = (
  successWords: IUserAggregateBase[],
  wrongWords: IUserAggregateBase[],
  score: number,
) => {
  const sprintGameElement = document.querySelector<HTMLElement>('[data-role="sprint-game"]');

  if (!sprintGameElement) return;

  const rootElement = sprintGameElement;
  rootElement.innerHTML = resultTemplate({ successWords, wrongWords, score });
};
