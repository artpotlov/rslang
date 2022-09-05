import { IUserAggregateBase, IAudioGameWords } from '../../types/types';

export const words: IAudioGameWords[] = [];

export const successWords: IUserAggregateBase[] = [];
export const wrongWords: IUserAggregateBase[] = [];

export const audioGameSettings = {
  idx: 0,
  gameDifficulty: '0',
  score: 0,
  isPlayingAudio: false,
  isAuth: false,
  isRunGame: false,
  hasAnswer: false,
};

export const resetStorage = () => {
  words.length = 0;

  successWords.length = 0;

  wrongWords.length = 0;

  audioGameSettings.idx = 0;
  audioGameSettings.gameDifficulty = '0';
  audioGameSettings.score = 0;
  audioGameSettings.isPlayingAudio = false;
  audioGameSettings.isAuth = false;
  audioGameSettings.isRunGame = false;
  audioGameSettings.hasAnswer = false;
};
