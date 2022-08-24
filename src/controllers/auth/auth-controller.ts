import { createNewUser, signIn } from '../../utils/api';
import { setLSData } from '../../utils/local-storage';
import { router } from '../../utils/router-storage';

const setFormView = (rootElement: HTMLElement, template: HTMLTemplateElement) => {
  const element = rootElement;
  const clone = template.content.cloneNode(true);
  element.innerHTML = '';
  element.append(clone);
};

const updateBtnView = (element: HTMLButtonElement, stateDisabled = false, text = 'Отправка...') => {
  const currentElement = element;
  currentElement.innerHTML = text;
  currentElement.disabled = stateDisabled;
};

const updateMessageView = (state: 'visible' | 'hidden' = 'hidden', messageText?: string) => {
  const messageElement = document.querySelector<HTMLElement>('[data-role="auth__message"]');

  if (!messageElement) {
    return;
  }

  messageElement.style.display = state === 'visible' ? 'block' : 'none';

  if (messageText) {
    messageElement.innerHTML = messageText;
  }
};

const sendLoginForm = async () => {
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
      }, 1000);
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

const sendRegistrationForm = async () => {
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
      break;
    case 422:
      updateMessageView('visible');
      updateBtnView(btnSubmitElement, false, 'Создать аккаунт');
      break;
    default:
      updateMessageView('visible', 'Неизвестная ошибка');
  }
};

const clickEvent = (
  target: EventTarget,
  authContentElement: HTMLElement,
  templateLogin: HTMLTemplateElement,
  templateRegistration: HTMLTemplateElement,
) => {
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  switch (target.dataset.role) {
    case 'auth__btn-form-login':
      setFormView(authContentElement, templateLogin);
      break;
    case 'auth__btn-form-registration':
      setFormView(authContentElement, templateRegistration);
      break;
    case 'auth__btn-login':
      updateBtnView(target, true);
      sendLoginForm();
      break;
    case 'auth__btn-registration':
      updateBtnView(target, true);
      sendRegistrationForm();
      break;
    default:
      break;
  }
};

const initEvent = (
  authContentElement: HTMLElement,
  templateLogin: HTMLTemplateElement,
  templateRegistration: HTMLTemplateElement,
) => {
  authContentElement.addEventListener('click', ({ target }) => {
    if (target instanceof HTMLButtonElement) {
      clickEvent(target, authContentElement, templateLogin, templateRegistration);
    }
  });

  authContentElement.addEventListener('input', ({ target }) => {
    if (target instanceof HTMLInputElement) {
      updateMessageView('hidden');
    }
  });
};

export const initAuthController = () => {
  const authContentElement = document.querySelector<HTMLElement>('[data-role="auth__content"]');
  const templateLoginElement = document.querySelector<HTMLTemplateElement>(
    '[data-role="auth__template-login"]',
  );
  const templateRegistrationElement = document.querySelector<HTMLTemplateElement>(
    '[data-role="auth__template-registration"]',
  );

  if (!authContentElement || !templateLoginElement || !templateRegistrationElement) {
    return;
  }

  setFormView(authContentElement, templateLoginElement);
  initEvent(authContentElement, templateLoginElement, templateRegistrationElement);
};
