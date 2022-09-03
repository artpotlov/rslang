const clickMainEvent = (target: EventTarget) => {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const popup = document.querySelector<HTMLElement>('#popup__about-app');
  if (!popup) return;
  const wrapper = document.querySelector<HTMLElement>('#about-app__wrapper');
  if (!wrapper) return;

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
