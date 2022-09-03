const stopSound = (soundData: HTMLAudioElement[]) => {
  soundData.map((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
};

export default stopSound;
