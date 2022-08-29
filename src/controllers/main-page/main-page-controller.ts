const clickMainEvent = (target: EventTarget) => {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const popup: HTMLElement | null = document.getElementById('popup__about-app');
  if (!popup) throw new Error('popup is null');
  const wrapper: HTMLElement | null = document.getElementById('about-app__wrapper');
  if (!wrapper) throw new Error('popup is null');

  if (target.dataset.main === 'main__btn-about-app') {
    popup.classList.remove('translate-y-full');
  }

  if (
    target !== wrapper &&
    !wrapper.contains(target) &&
    target.dataset.main !== 'main__btn-about-app' &&
    target === wrapper.parentNode
  ) {
    popup.classList.add('translate-y-full');
  }
};

export const initMainEvent = () => {
  document.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickMainEvent(event.target);
    }
  });
};
