import { initAuth } from '../pages/auth-page';
import { dictionary } from '../pages/dictionary';
import { router } from './router-storage';

export const initRouter = (element: HTMLElement) => {
  const currentElement = element;

  router
    .add('', () => {
      document.title = 'Main page';
      currentElement.innerHTML = '';
      currentElement.innerHTML = `<div>Main Page</div>`;
    })
    .add('auth', () => {
      initAuth(element);
    })
    .add('dictionary', () => {
      dictionary(element);
    })
    .add('dictionary/(:num)/(:num)', (group: string, page: string) => {
      dictionary(element, { group, page });
    })
    .check()
    .addUriListener();
};
