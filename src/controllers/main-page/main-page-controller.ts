import { urlChanger } from '../urlChanger';

const clickHeaderEvent = (target: EventTarget, element: HTMLElement) => {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  switch (target.dataset.header) {
    case 'header__btn-burger':
      element.classList.toggle('open');
      break;
    case 'header__menu-link':
      element.classList.remove('open');
      break;
    case 'header__btn-auth':
      if (element.classList.contains('open')) element.classList.remove('open');
      urlChanger('#auth');
      break;
    default:
      break;
  }
};

const clickMainEvent = (target: EventTarget) => {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.main === 'main__btn-about-app') {
    urlChanger('#about-app');
  }
};

export const initHeaderEvent = (element: HTMLElement) => {
  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickHeaderEvent(event.target, element);
    }
  });
};

export const initMainEvent = (element: HTMLElement) => {
  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickMainEvent(event.target);
    }
  });
};
