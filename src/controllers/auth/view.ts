import loginTemplate from '../../components/auth/login.hbs';
import regTemplate from '../../components/auth/registration.hbs';

export const updateBtnView = (
  element: HTMLButtonElement,
  stateDisabled = false,
  text = 'Отправка...',
) => {
  const currentElement = element;
  currentElement.innerHTML = text;
  currentElement.disabled = stateDisabled;
};

export const updateMessageView = (state: 'visible' | 'hidden' = 'hidden', messageText?: string) => {
  const messageElement = document.querySelector<HTMLElement>('[data-role="auth__message"]');

  if (!messageElement) {
    return;
  }

  messageElement.style.display = state === 'visible' ? 'block' : 'none';

  if (messageText) {
    messageElement.innerHTML = messageText;
  }
};

export const setFormView = (form: 'login' | 'reg' = 'login') => {
  const authContentElement = document.querySelector<HTMLElement>('[data-role="auth__content"]');

  if (!authContentElement) return;

  if (form === 'login') {
    authContentElement.innerHTML = loginTemplate();
  } else {
    authContentElement.innerHTML = regTemplate();
  }
};
