import { sprintSettings } from './storage';

export const playSoundWord = (url: string) => {
  const audio = new Audio(url);
  if (!sprintSettings.isPlayingAudio) {
    audio.play();
    sprintSettings.isPlayingAudio = true;
  }
  audio.addEventListener('ended', () => {
    sprintSettings.isPlayingAudio = false;
  });
};

export const playSoundRes = (isCorrectAnswer: boolean) => {
  const audio = isCorrectAnswer
    ? new Audio('./assets/sprint-game/sounds/correct.wav')
    : new Audio('./assets/sprint-game/sounds/wrong.wav');
  audio.play();
};
