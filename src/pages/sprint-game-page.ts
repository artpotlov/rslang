import '../components/sprint-game/style.scss';
import mainTemplate from '../components/sprint-game/main.hbs';
import { initSprintGameController } from '../controllers/sprint-game/sprint-game-controller';
import { IObjectString, TSprintGameMode } from '../types/types';

export const initSprintGamePage = (
  element: HTMLElement,
  mode: TSprintGameMode,
  params?: IObjectString,
) => {
  document.title = 'Игра спринт';

  const rootElement = element;
  rootElement.innerHTML = mainTemplate();

  initSprintGameController(mode, params);
};
