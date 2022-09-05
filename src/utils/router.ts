import { initAuth } from '../pages/auth-page';
import { dictionary } from '../pages/dictionary';
import { initMainPage, initAboutTeam } from '../pages/main-page';
import { initMiniGames } from '../pages/mini-games';
import { initSprintGamePage } from '../pages/sprint-game-page';
import { initAudioGame } from '../pages/audio-game';
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
    .add('sprint-game', () => {
      initSprintGamePage(element, 'common');
    })
    .add('sprint-game/(:num)/(:num)', (group: string, page: string) => {
      initSprintGamePage(element, 'book', { group, page });
    })
    .add('audio', () => {
      initAudioGame(element);
    })
    .add('audio/(:num)/(:num)', (group: string, page: string) => {
      initAudioGame(element, { group, page });
    })
    .check()
    .addUriListener();
};
