import authTemplate from '../components/auth/index.hbs';
import { initAuthController } from '../controllers/auth/auth-controller';
import { IUserData } from '../types/types';
import { getLSData } from '../utils/local-storage';
import { router } from '../utils/router-storage';

export const initAuth = (element: HTMLElement) => {
  document.title = 'Авторизация';

  const userData = getLSData<IUserData>('userData');
  if (userData && userData.token.length > 0) {
    router.redirectTo('');
  }

  const rootElement = element;
  rootElement.innerHTML = authTemplate();

  initAuthController();
};
