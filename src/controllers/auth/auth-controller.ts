import loginTemplate from '../../components/auth/login.hbs';
import { initEvents } from './events';

export const initAuthController = () => {
  const authContentElement = document.querySelector<HTMLElement>('[data-role="auth__content"]');

  if (!authContentElement) return;

  authContentElement.innerHTML = loginTemplate();

  initEvents(authContentElement);
};
