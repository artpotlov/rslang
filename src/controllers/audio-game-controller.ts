import game from '../components/audio-game/game.hbs';

let context = {
  word: 'word',
  word1: 'word1',
  word2: 'word2',
  word3: 'word3',
  word4: 'word4',
  word5: 'word5',
};

function clickStartBtn(target: EventTarget, element: HTMLElement) {
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const rootElement: HTMLElement = element;
  const btn = target;

  switch (target.dataset.game) {
    case 'start-game':
      rootElement.innerHTML = game(context);
      // (mainElement);
      // получить выбранную сложность и запустить игру
      // сформировать объект со словами
      break;
    case 'dont-know':
      // rootElement.innerHTML = game(context);
      btn.dataset.game = 'next';
      btn.innerText = 'Далее';
      // 'показать правильное слово и запомнить как ошибку'
      break;
    case 'next':
      context = {
        word: 'слово',
        word1: 'слово1',
        word2: 'слово2',
        word3: 'слово3',
        word4: 'слово4',
        word5: 'слово5',
      };
      rootElement.innerHTML = game(context);
      // показать новое слово
      break;
    default:
      break;
  }
}

export const initStartEvent = (element: HTMLElement) => {
  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickStartBtn(event.target, element);
    }
  });

  /*   element2.addEventListener('click', (event: MouseEvent): void => {
    if (event.target) {
      clickStartBtn(event.target, element1, element2);
    }
  }); */
};
