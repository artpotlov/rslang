import '../components/sprint-game/style.scss';
import mainTemplate from '../components/sprint-game/main.hbs';
import headerTemplate from '../components/header/header.hbs';
import { initSprintGameController } from '../controllers/sprint-game/sprint-game-controller';
import { IObjectString, TSprintGameMode } from '../types/types';
import { initHeaderEvent } from '../controllers/header/header-controller';

export const initSprintGamePage = (
  element: HTMLElement,
  mode: TSprintGameMode,
  params?: IObjectString,
) => {
  document.title = 'Игра спринт';

  const rootElement = element;
  rootElement.innerHTML = headerTemplate({ activePage: { miniGames: true } });
  rootElement.innerHTML += mainTemplate();

  initHeaderEvent();
  initSprintGameController(mode, params);
};
