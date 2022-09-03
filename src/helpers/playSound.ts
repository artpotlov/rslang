const playSound = (soundData: HTMLAudioElement[]) => {
  let index = 0;
  let sound = soundData[index];
  const playNext = () => {
    index += 1;
    if (index < soundData.length) {
      sound = soundData[index];
      sound.addEventListener('ended', playNext, { once: true });
      sound.play();
    }
  };
  sound.addEventListener('ended', playNext, { once: true });
  sound.play();
};

export default playSound;
