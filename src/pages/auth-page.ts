import authTemplate from '../components/auth/index.hbs';
import { initAuthController } from '../controllers/auth/auth-controller';
import { IUserData } from '../types/types';
import { getLSData } from '../utils/local-storage';

export const initAuth = (element: HTMLElement) => {
  document.title = 'Авторизация';

  const userData = getLSData<IUserData>('userData');
  if (userData && userData.token.length > 0) {
    window.location.replace('');
  }

  const rootElement = element;
  rootElement.innerHTML = authTemplate();

  initAuthController();
};
