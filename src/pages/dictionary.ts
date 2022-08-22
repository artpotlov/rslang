import dictionaryTemplate from '../components/dictionary/index.hbs';
import { initDictionaryController } from '../controllers/auth/dictionary-controller';

export const dictionary = (element: HTMLElement, paramsDictionary = { group: '0', page: '0' }) => {
  document.title = 'Электронный учебник';
  const rootElement = element;
  rootElement.innerHTML = dictionaryTemplate();
  initDictionaryController(paramsDictionary);
};
