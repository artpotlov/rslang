/*  eslint-disable no-underscore-dangle */
import {
  IGameStatistic,
  IStatistic,
  IUserAggregateBase,
  IUserData,
  IWordParams,
  TStatMode,
  TTypeGame,
} from '../types/types';
import { getLSData } from '../utils/local-storage';
import { getStatistics, setWordParams, updateStatistics, updateWordParams } from '../utils/api';

const remoteStatsStore: IStatistic[] = [];

export const gameStatistics = {
  countNewWords: 0,
  countCorrectAnswer: 0,
  countWrongAnswer: 0,
  countWords: 0,
  longSeries: 0,
  learnedWords: 0,
  score: 0,
};

export const resetGameStatistics = () => {
  gameStatistics.countNewWords = 0;
  gameStatistics.countCorrectAnswer = 0;
  gameStatistics.countWrongAnswer = 0;
  gameStatistics.countWords = 0;
  gameStatistics.longSeries = 0;
  gameStatistics.learnedWords = 0;
  gameStatistics.score = 0;
};

export const resetRemoteStatsStore = () => {
  remoteStatsStore.length = 0;
};

export const updateWordStat = (
  word: IUserAggregateBase,
  isCorrectAnswer: boolean,
  typeGame: TTypeGame,
  auth: boolean,
) => {
  if (!auth) return;

  const userData = getLSData<IUserData>('userData');
  if (!userData) return;
  const { userId, token } = userData;

  const params: IWordParams = {
    difficulty: 'easy',
    optional: {
      learned: false,
      countRepeated: Number(isCorrectAnswer),
    },
  };

  if (typeGame === 'sprint') {
    params.optional.sprintGame = {
      countCorrectAnswer: Number(isCorrectAnswer),
      countWrongAnswer: Number(!isCorrectAnswer),
    };
  }

  if (typeGame === 'audio') {
    params.optional.audioGame = {
      countWrongAnswer: Number(isCorrectAnswer),
      countCorrectAnswer: Number(!isCorrectAnswer),
    };
  }

  if (!word._id) return;
  const wordId = word._id;

  if (!word.userWord) {
    gameStatistics.countNewWords += 1;
    setWordParams({ userId, token, wordId, params });
    return;
  }

  const { userWord } = word;

  if (userWord?.optional.learned && !isCorrectAnswer) {
    updateWordParams({ userId, token, wordId, params });
    return;
  }

  if (
    !userWord?.optional.learned &&
    userWord?.optional.countRepeated &&
    ((userWord?.difficulty === 'easy' && userWord.optional.countRepeated >= 3) ||
      (userWord?.difficulty === 'hard' && userWord.optional.countRepeated >= 5))
  ) {
    params.optional.learned = true;
    params.optional.countRepeated = 0;
    updateWordParams({ userId, token, wordId, params });
    gameStatistics.learnedWords += 1;
    return;
  }

  if (typeGame === 'sprint') {
    const countCorrectAnswer = userWord?.optional.sprintGame?.countCorrectAnswer || 0;
    const countWrongAnswer = userWord?.optional.sprintGame?.countWrongAnswer || 0;

    params.optional.sprintGame = {
      countCorrectAnswer: countCorrectAnswer + Number(isCorrectAnswer),
      countWrongAnswer: countWrongAnswer + Number(!isCorrectAnswer),
    };
  }

  if (typeGame === 'audio') {
    const countCorrectAnswer = userWord?.optional.audioGame?.countCorrectAnswer || 0;
    const countWrongAnswer = userWord?.optional.audioGame?.countWrongAnswer || 0;

    params.optional.audioGame = {
      countCorrectAnswer: countCorrectAnswer + Number(isCorrectAnswer),
      countWrongAnswer: countWrongAnswer + Number(!isCorrectAnswer),
    };
  }

  if (typeof params.optional.countRepeated !== 'number') return;

  params.optional.countRepeated += isCorrectAnswer ? userWord?.optional.countRepeated || 0 : 0;

  updateWordParams({ userId, token, wordId, params });
};

export const saveStatistics = async (type: TStatMode, auth: boolean) => {
  if (!auth) return;

  const userData = getLSData<IUserData>('userData');
  if (!userData) return;
  const { userId, token } = userData;

  const todayDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const params: IStatistic = {
    learnedWords: type === 'book' ? 1 : gameStatistics.learnedWords,
    optional: {
      lastChange: {
        date: todayDate,
        learnedWords: type === 'book' ? 1 : gameStatistics.learnedWords,
      },
      days: {
        allDays: [],
      },
    },
  };

  if (type === 'sprint') {
    params.optional.lastChange.sprintGame = {
      countNewWords: gameStatistics.countNewWords,
      countCorrectAnswer: gameStatistics.countCorrectAnswer,
      countWords: gameStatistics.countCorrectAnswer + gameStatistics.countWrongAnswer,
      longSeries: gameStatistics.longSeries,
      score: gameStatistics.score,
    };
  }

  if (type === 'audio') {
    params.optional.lastChange.audioGame = {
      countNewWords: gameStatistics.countNewWords,
      countCorrectAnswer: gameStatistics.countCorrectAnswer,
      countWords: gameStatistics.countCorrectAnswer + gameStatistics.countWrongAnswer,
      longSeries: gameStatistics.longSeries,
      score: gameStatistics.score,
    };
  }

  if (remoteStatsStore.length === 0) {
    const responseStats = await getStatistics({ userId, token });
    if (responseStats.status !== 200) {
      updateStatistics({ userId, token, params });

      const gameStats: IGameStatistic = {
        countNewWords: 0,
        countCorrectAnswer: 0,
        countWords: 0,
        longSeries: 0,
        score: 0,
      };

      if (type === 'sprint') {
        params.optional.lastChange.sprintGame = gameStats;
      }

      if (type === 'audio') {
        params.optional.lastChange.audioGame = gameStats;
      }

      remoteStatsStore.push(params);
      return;
    }

    remoteStatsStore.push(responseStats.params);
  }

  const remStats = remoteStatsStore[0];

  if (remStats.optional.lastChange.date !== todayDate) {
    params.optional.days.allDays.push(remStats.optional.lastChange);
  }

  params.learnedWords += remStats.learnedWords;
  params.optional.lastChange.learnedWords += remStats.optional.lastChange.learnedWords;

  if (type === 'book') {
    resetRemoteStatsStore();
  }

  if (params.optional.lastChange.sprintGame && remStats.optional.lastChange.sprintGame) {
    params.optional.lastChange.sprintGame.countNewWords +=
      remStats.optional.lastChange.sprintGame.countNewWords;
    params.optional.lastChange.sprintGame.countCorrectAnswer +=
      remStats.optional.lastChange.sprintGame.countCorrectAnswer;
    params.optional.lastChange.sprintGame.countWords +=
      remStats.optional.lastChange.sprintGame.countWords;
    params.optional.lastChange.sprintGame.longSeries =
      gameStatistics.longSeries > remStats.optional.lastChange.sprintGame.longSeries
        ? gameStatistics.longSeries
        : remStats.optional.lastChange.sprintGame.longSeries;
    params.optional.lastChange.sprintGame.score += remStats.optional.lastChange.sprintGame.score;
  }

  if (params.optional.lastChange.audioGame && remStats.optional.lastChange.audioGame) {
    params.optional.lastChange.audioGame.countNewWords +=
      remStats.optional.lastChange.audioGame.countNewWords;
    params.optional.lastChange.audioGame.countCorrectAnswer +=
      remStats.optional.lastChange.audioGame.countCorrectAnswer;
    params.optional.lastChange.audioGame.countWords +=
      remStats.optional.lastChange.audioGame.countWords;
    params.optional.lastChange.audioGame.longSeries =
      gameStatistics.longSeries > remStats.optional.lastChange.audioGame.longSeries
        ? gameStatistics.longSeries
        : remStats.optional.lastChange.audioGame.longSeries;
    params.optional.lastChange.audioGame.score += remStats.optional.lastChange.audioGame.score;
  }

  updateStatistics({ userId, token, params });
};
