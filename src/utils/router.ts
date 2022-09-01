import { initAuth } from '../pages/auth-page';
import { dictionary } from '../pages/dictionary';
import { initMainPage, initAboutTeam } from '../pages/main-page';
import { initMiniGames } from '../pages/mini-games';
import { router } from './router-storage';

export const initRouter = (element: HTMLElement) => {
  router
    .add('', () => {
      initMainPage(element);
    })
    .add('mini-games', () => {
      initMiniGames(element);
    })
    .add('about-team', () => {
      initAboutTeam(element);
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
