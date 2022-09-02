import { setFormView, updateBtnView, updateMessageView } from './view';
import { sendLoginForm, sendRegistrationForm } from './sender';

const clickEvent = (target: EventTarget) => {
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  switch (target.dataset.role) {
    case 'auth__btn-form-login':
      setFormView('login');
      break;
    case 'auth__btn-form-registration':
      setFormView('reg');
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

export const initEvents = (element: HTMLElement) => {
  const authContentElement = element;

  authContentElement.addEventListener('click', ({ target }) => {
    if (target instanceof HTMLButtonElement) {
      clickEvent(target);
    }
  });

  authContentElement.addEventListener('input', ({ target }) => {
    if (target instanceof HTMLInputElement) {
      updateMessageView('hidden');
    }
  });
};
