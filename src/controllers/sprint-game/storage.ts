import { IUserAggregateBase } from '../../types/types';

export const wordsStore: IUserAggregateBase[] = [];
export const rndTranslateWords: IUserAggregateBase[] = [];

export const successWords: IUserAggregateBase[] = [];
export const wrongWords: IUserAggregateBase[] = [];

export const sprintSettings = {
  index: 0,
  time: 60,
  score: 0,
  factor: 10,
  progressWord: 0,
  progressLevel: 0,
  isPlayingAudio: false,
  timers: <NodeJS.Timer[]>[],
  isAuth: false,
  isRunGame: false,
};

export const resetStorage = () => {
  wordsStore.length = 0;

  rndTranslateWords.length = 0;

  successWords.length = 0;

  wrongWords.length = 0;

  sprintSettings.index = 0;
  sprintSettings.time = 60;
  sprintSettings.score = 0;
  sprintSettings.factor = 10;
  sprintSettings.progressWord = 0;
  sprintSettings.progressLevel = 0;
  sprintSettings.isPlayingAudio = false;
  sprintSettings.isAuth = false;
  sprintSettings.isRunGame = true;

  sprintSettings.timers.forEach((timer) => clearInterval(timer));

  sprintSettings.timers.length = 0;
};
