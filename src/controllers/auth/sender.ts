import { createNewUser, signIn } from '../../utils/api';
import { setLSData } from '../../utils/local-storage';
import { setFormView, updateBtnView, updateMessageView } from './view';
import { router } from '../../utils/router-storage';

export const sendLoginForm = async () => {
  const inputEmailElement = document.querySelector<HTMLInputElement>(
    '[data-role="auth__input-email"]',
  );
  const inputPasswordElement = document.querySelector<HTMLInputElement>(
    '[data-role="auth__input-password"]',
  );
  const btnSubmitElement = document.querySelector<HTMLButtonElement>(
    '[data-role="auth__btn-login"]',
  );

  if (!inputEmailElement || !inputPasswordElement || !btnSubmitElement) {
    return;
  }

  const emailValue = inputEmailElement.value.trim();
  const passwordValue = inputPasswordElement.value.trim();

  const result = await signIn({ email: emailValue, password: passwordValue });

  switch (result.status) {
    case 200:
      setLSData('userData', result.params);
      updateBtnView(btnSubmitElement, true, 'Успешно');
      setTimeout(() => {
        router.navigateTo('');
      }, 500);
      break;
    case 403:
      updateMessageView('visible');
      updateBtnView(btnSubmitElement, false, 'Войти');
      break;
    default:
      updateMessageView('visible', 'Неизвестная ошибка');
      updateBtnView(btnSubmitElement, false, 'Войти');
  }
};

export const sendRegistrationForm = async () => {
  const inputNameElement = document.querySelector<HTMLInputElement>(
    '[data-role="auth__input-name"]',
  );
  const inputEmailElement = document.querySelector<HTMLInputElement>(
    '[data-role="auth__input-email"]',
  );
  const inputPasswordElement = document.querySelector<HTMLInputElement>(
    '[data-role="auth__input-password"]',
  );
  const btnSubmitElement = document.querySelector<HTMLButtonElement>(
    '[data-role="auth__btn-registration"]',
  );

  if (!inputNameElement || !inputEmailElement || !inputPasswordElement || !btnSubmitElement) {
    return;
  }

  const nameValue = inputNameElement.value.trim();
  const emailValue = inputEmailElement.value.trim();
  const passwordValue = inputPasswordElement.value.trim();

  const result = await createNewUser({
    name: nameValue,
    email: emailValue,
    password: passwordValue,
  });

  switch (result.status) {
    case 200:
      updateBtnView(btnSubmitElement, true, 'Успешно');
      setTimeout(() => {
        setFormView('login');
      }, 500);
      break;
    case 422:
      updateMessageView('visible');
      updateBtnView(btnSubmitElement, false, 'Создать аккаунт');
      break;
    default:
      updateMessageView('visible', 'Неизвестная ошибка');
  }
};
