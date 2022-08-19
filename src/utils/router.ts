import Router from 'vanilla-router';
import { initAuth } from '../pages/auth-page';
import { initPage404 } from '../pages/404-page';

export const initRouter = (element: HTMLElement) => {
  const currentElement = element;

  const router = new Router({
    mode: 'hash',
    page404: () => {
      initPage404(element);
    },
  });

  router
    .add('', () => {
      document.title = 'Main page';
      currentElement.innerHTML = '';
      currentElement.innerHTML = `<div>Main Page</div>`;
    })
    .add('auth', () => {
      initAuth(element);
    })
    .check()
    .addUriListener();
};
