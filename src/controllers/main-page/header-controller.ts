import { router } from '../../utils/router-storage';

const clickHeaderEvent = (target: EventTarget, element: Element) => {
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
      router.navigateTo('#auth');
      break;
    default:
      break;
  }
};

export const initHeaderEvent = () => {
  const headerContainer = document.querySelector('.header');
  if (!headerContainer) throw new Error('headerContainer is null');

  headerContainer.addEventListener('click', ({ target }): void => {
    if (target) {
      clickHeaderEvent(target, headerContainer);
    }
  });
};
