/*  eslint-disable no-underscore-dangle */
import {
  IGameStatistic,
  IStatistic,
  IUserAggregateBase,
  IUserData,
  IWordParams,
  TStatMode,
  TTypeGame,
} from '../../types/types';
import { getLSData } from '../local-storage';
import { getStatistics, setWordParams, updateStatistics, updateWordParams } from '../api';

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

  if (userWord?.difficulty) {
    params.difficulty = userWord.difficulty;
  }

  if (userWord?.optional.learned && !isCorrectAnswer) {
    updateWordParams({ userId, token, wordId, params });
    return;
  }

  if (userWord?.optional.sprintGame) {
    params.optional.sprintGame = userWord.optional.sprintGame;
  }

  if (userWord?.optional.audioGame) {
    params.optional.audioGame = userWord.optional.audioGame;
  }

  if (
    !userWord?.optional.learned &&
    userWord?.optional.countRepeated &&
    ((userWord?.difficulty === 'easy' && userWord.optional.countRepeated >= 2) ||
      (userWord?.difficulty === 'hard' && userWord.optional.countRepeated >= 4))
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
        sprintGame: {
          countNewWords: 0,
          countCorrectAnswer: 0,
          countWords: 0,
          longSeries: 0,
          score: 0,
        },
        audioGame: {
          countNewWords: 0,
          countCorrectAnswer: 0,
          countWords: 0,
          longSeries: 0,
          score: 0,
        },
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

  if (remStats.optional.days.allDays.length > 0) {
    const remAllDays = remStats.optional.days.allDays;
    params.optional.days.allDays.push(...remAllDays);
  }

  if (remStats.optional.lastChange.date !== todayDate) {
    params.optional.days.allDays.push(remStats.optional.lastChange);
  }

  params.learnedWords += remStats.learnedWords;
  params.optional.lastChange.learnedWords += remStats.optional.lastChange.learnedWords;

  if (type === 'book') {
    resetRemoteStatsStore();
  }

  const current = params.optional.lastChange;
  const remote = remStats.optional.lastChange;

  if (current.sprintGame && remote.sprintGame) {
    current.sprintGame.countNewWords += remote.sprintGame.countNewWords;
    current.sprintGame.countCorrectAnswer += remote.sprintGame.countCorrectAnswer;
    current.sprintGame.countWords += remote.sprintGame.countWords;
    current.sprintGame.longSeries =
      gameStatistics.longSeries > remote.sprintGame.longSeries
        ? gameStatistics.longSeries
        : remote.sprintGame.longSeries;
    current.sprintGame.score += remote.sprintGame.score;
  }

  if (current.audioGame && remote.audioGame) {
    current.audioGame.countNewWords += remote.audioGame.countNewWords;
    current.audioGame.countCorrectAnswer += remote.audioGame.countCorrectAnswer;
    current.audioGame.countWords += remote.audioGame.countWords;
    current.audioGame.longSeries =
      gameStatistics.longSeries > remote.audioGame.longSeries
        ? gameStatistics.longSeries
        : remote.audioGame.longSeries;
    current.audioGame.score += remote.audioGame.score;
  }

  updateStatistics({ userId, token, params });
};
