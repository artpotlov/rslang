import './style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { initRouter } from './utils/router';

const appElement = document.querySelector<HTMLElement>('#app');

if (appElement) {
  initRouter(appElement);
}
