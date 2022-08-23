import Router from 'vanilla-router';
import { initPage404 } from '../pages/404-page';

export const router = new Router({
  mode: 'hash',
  page404: () => {
    initPage404();
  },
});
