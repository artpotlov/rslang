/* eslint-disable no-param-reassign */

const stopSound = (soundData: HTMLAudioElement[]) => {
  soundData.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
};

export default stopSound;
