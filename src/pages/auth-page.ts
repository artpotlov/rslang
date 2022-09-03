import authTemplate from '../components/auth/index.hbs';
import headerTemplate from '../components/header/header.hbs';
import footerTemplate from '../components/footer/footer.hbs';
import { KEYS_LS } from '../const';
import { initAuthController } from '../controllers/auth/auth-controller';
import { IUserData } from '../types/types';
import { getLSData } from '../utils/local-storage';
import { router } from '../utils/router-storage';
import { initHeaderEvent } from '../controllers/header/header-controller';

export const initAuth = (element: HTMLElement) => {
  document.title = 'Авторизация';

  const userData = getLSData<IUserData>(KEYS_LS.userData);
  if (userData && userData.token.length > 0) {
    router.redirectTo('');
  }

  const rootElement = element;
  rootElement.innerHTML = headerTemplate();
  rootElement.innerHTML += authTemplate();
  rootElement.innerHTML += footerTemplate();

  initHeaderEvent();
  initAuthController();
};
