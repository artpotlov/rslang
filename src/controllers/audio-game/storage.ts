import { IUserAggregateBase } from '../../types/types';

export const wordsStore: IUserAggregateBase[] = [];
export const rndTranslateWords: IUserAggregateBase[] = [];

export const successWords: IUserAggregateBase[] = [];
export const wrongWords: IUserAggregateBase[] = [];

export const audioGameSettings = {
  // index: 0,
  // score: 0,
  // factor: 10,
  // progressWord: 0,
  // progressLevel: 0,
  isPlayingAudio: false,
  isAuth: false,
  isRunGame: false,
};

export const resetStorage = () => {
  wordsStore.length = 0;

  rndTranslateWords.length = 0;

  successWords.length = 0;

  wrongWords.length = 0;

  // audioGameSettings.index = 0;
  // audioGameSettings.score = 0;
  // audioGameSettings.factor = 10;
  // audioGameSettings.progressWord = 0;
  // audioGameSettings.progressLevel = 0;
  audioGameSettings.isPlayingAudio = false;
  audioGameSettings.isAuth = false;
  audioGameSettings.isRunGame = true;
};
