import { router } from '../../utils/router-storage';
import { deleteLSData, getLSData } from '../../utils/local-storage';
import { IUserData } from '../../types/types';

let isAuth = false;

const updateBtnAuthView = () => {
  const btnAuthText = document.querySelector<HTMLButtonElement>(
    '[data-header="header__btn-auth"] span',
  );

  if (!btnAuthText) return;

  if (isAuth) {
    btnAuthText.textContent = `Выйти`;
  } else {
    btnAuthText.textContent = 'Войти';
  }
};

const clickBtnAuth = () => {
  if (isAuth) {
    deleteLSData('userData');
    isAuth = false;
    updateBtnAuthView();
    return;
  }

  router.navigateTo('auth');
};

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
      clickBtnAuth();
      break;
    default:
      break;
  }
};

export const initHeaderEvent = () => {
  const headerContainer = document.querySelector('.header');
  if (!headerContainer) return;

  headerContainer.addEventListener('click', ({ target }): void => {
    if (target) {
      clickHeaderEvent(target, headerContainer);
    }
  });

  const userData = getLSData<IUserData>('userData');
  if (!userData) return;
  if (userData.userId) isAuth = true;

  updateBtnAuthView();
};
