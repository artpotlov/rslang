import { IUserAggregateBase } from '../../types/types';
import gameTemplate from '../../components/sprint-game/game.hbs';
import {
  renderResultsView,
  updateProgressLevelView,
  updateProgressWordView,
  updateScoreView,
  updateTimerView,
  updateWordsView,
} from './view';
import { rndTranslateWords, sprintSettings, successWords, wordsStore, wrongWords } from './storage';
import { gameStatistics, saveStatistics, updateWordStat } from '../../utils/statistic/statistic';
import { playSoundRes } from './audio';

const setShuffleWords = (fromArray: IUserAggregateBase[], toArray: IUserAggregateBase[]) => {
  const rndCondition = () => Math.trunc(Math.random() * 3);
  const rndIndex = () => Math.trunc(Math.random() * fromArray.length);
  fromArray.forEach((word) => {
    if (rndCondition() > 0) {
      toArray.push(word);
    } else {
      toArray.push(wordsStore[rndIndex()]);
    }
  });
};

const updateWord = () => {
  const { index } = sprintSettings;
  const { word } = wordsStore[index];
  const { wordTranslate } = rndTranslateWords[index];
  updateWordsView(word, wordTranslate);
};

const updateStatsInStore = () => {
  gameStatistics.countCorrectAnswer = successWords.length;
  gameStatistics.countWrongAnswer = wrongWords.length;
  gameStatistics.countWords = gameStatistics.countCorrectAnswer + gameStatistics.countWrongAnswer;
  gameStatistics.score = sprintSettings.score;
};

const startTimerTick = (sec: number) => {
  sprintSettings.time = sec;

  const timer = setInterval(() => {
    sprintSettings.time -= 1;
    updateTimerView(sprintSettings.time);
    if (sprintSettings.time < 1) {
      renderResultsView(successWords, wrongWords, sprintSettings.score);
      clearInterval(timer);
    }
  }, 1000);

  sprintSettings.timers.push(timer);
};

const updateGameProgress = (success: boolean) => {
  if (success) {
    gameStatistics.longSeries += 1;

    if (sprintSettings.progressWord < 4) {
      sprintSettings.progressWord += 1;
    }

    if (sprintSettings.progressWord === 4 && sprintSettings.progressLevel < 3) {
      sprintSettings.progressLevel += 1;
      sprintSettings.factor *= 2;
      sprintSettings.progressWord = 0;
    }

    sprintSettings.score += 10 + sprintSettings.factor;

    playSoundRes(true);
  }

  if (!success) {
    gameStatistics.longSeries = 0;

    if (sprintSettings.progressWord === 0 && sprintSettings.progressLevel !== 0) {
      sprintSettings.progressLevel -= 1;
      sprintSettings.factor /= 2;
    }

    sprintSettings.progressWord = 0;

    playSoundRes(false);
  }

  const { score, progressWord, progressLevel } = sprintSettings;
  updateScoreView(score);
  updateProgressWordView(progressWord);
  updateProgressLevelView(progressLevel);
};

const isIndexWordOutside = () => {
  return !(sprintSettings.index < wordsStore.length);
};

const updateGameStats = (word: IUserAggregateBase, isCorrectAnswer: boolean) => {
  if (isCorrectAnswer) {
    successWords.push(word);
    updateWordStat(word, true, 'sprint', sprintSettings.isAuth);
    updateGameProgress(true);
    return;
  }

  wrongWords.push(word);
  updateWordStat(word, false, 'sprint', sprintSettings.isAuth);
  updateGameProgress(false);
};

export const checkWord = (isClickBtnTrue: boolean) => {
  const { index } = sprintSettings;

  if (isIndexWordOutside()) {
    renderResultsView(successWords, wrongWords, sprintSettings.score);
    return;
  }

  if (isClickBtnTrue) {
    const isEqWord = wordsStore[index].wordTranslate === rndTranslateWords[index].wordTranslate;
    updateGameStats(wordsStore[index], isEqWord);
  } else {
    const isNotEqWord = wordsStore[index].wordTranslate !== rndTranslateWords[index].wordTranslate;
    updateGameStats(wordsStore[index], isNotEqWord);
  }

  updateStatsInStore();
  saveStatistics('sprint', sprintSettings.isAuth);

  sprintSettings.index += 1;

  if (!isIndexWordOutside()) {
    updateWordsView(wordsStore[index + 1].word, rndTranslateWords[index + 1].wordTranslate);
  } else {
    renderResultsView(successWords, wrongWords, sprintSettings.score);
  }
};

export const runSprintGame = (sprintGameElement: HTMLElement) => {
  const rootElement = sprintGameElement;
  rootElement.innerHTML = gameTemplate();
  setShuffleWords(wordsStore, rndTranslateWords);
  updateWord();
  startTimerTick(60);
};
