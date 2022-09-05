import { transformDateFromBack } from '../../helpers/transformDate';
import { IStatistic, TChartData } from '../../types/types';

const DEFAULT_STATISTICS = {
  countNewWords: 0,
  countCorrectAnswer: 0,
  countWords: 0,
  longSeries: 0,
  score: 0,
};

export const formingStatisticsShort = (params: IStatistic) => {
  const lastChange = params?.optional.lastChange;
  const sprintGame = lastChange?.sprintGame || DEFAULT_STATISTICS;
  const audioGame = lastChange?.audioGame || DEFAULT_STATISTICS;
  const newWords = audioGame.countNewWords + sprintGame.countNewWords;
  const learnedWords = lastChange.learnedWords;
  const percentCorrectAnswer =
    Math.round(
      ((sprintGame.countCorrectAnswer + audioGame.countCorrectAnswer) /
        (sprintGame.countWords + audioGame.countWords)) *
        100,
    ) || 0;
  sprintGame.countCorrectAnswer =
    Math.round((sprintGame.countCorrectAnswer / sprintGame.countWords) * 100) || 0;
  audioGame.countCorrectAnswer =
    Math.round((audioGame.countCorrectAnswer / audioGame.countWords) * 100) || 0;
  return { newWords, learnedWords, percentCorrectAnswer, sprintGame, audioGame };
};

export const formingStatisticsLong = (params: IStatistic) => {
  const newWordsForChart: Omit<TChartData, 'title'> = { labels: [], data: [] };
  const learnedWordsForChart: Omit<TChartData, 'title'> = { labels: [], data: [] };
  if (!params) return { newWordsForChart, learnedWordsForChart };
  const { days, lastChange } = params.optional;
  days.allDays.forEach((day, index, allDays) => {
    const { learnedWords, date, sprintGame, audioGame } = day;
    const learnedWordsDate = index ? learnedWords + allDays[index - 1].learnedWords : learnedWords;
    learnedWordsForChart.data.push(learnedWordsDate);
    learnedWordsForChart.labels.push(transformDateFromBack(date));
    newWordsForChart.data.push((audioGame?.countNewWords || 0) + (sprintGame?.countNewWords || 0));
    newWordsForChart.labels.push(transformDateFromBack(date));
  });
  learnedWordsForChart.data.push(params.learnedWords);
  learnedWordsForChart.labels.push(transformDateFromBack(lastChange.date));
  newWordsForChart.data.push(
    (lastChange.audioGame?.countNewWords || 0) + (lastChange.sprintGame?.countNewWords || 0),
  );
  newWordsForChart.labels.push(transformDateFromBack(lastChange.date));
  return { newWordsForChart, learnedWordsForChart };
};
