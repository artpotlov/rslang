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

export const initEvent = (element: HTMLElement) => {
  element.addEventListener('click', (event) => {
    if (event.target) {
      clickHeaderEvent(event.target, element);
    }
  });
};
