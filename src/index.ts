import './style.scss';
import { initRouter } from './utils/router';

const appElement = document.querySelector<HTMLElement>('#app');

if (appElement) {
  initRouter(appElement);
}
