import dictionaryTemplate from '../components/dictionary/index.hbs';
import { initDictionaryController } from '../controllers/dictionary/dictionary-controller';
import { TITLES_PAGE } from '../const';

export const dictionary = (element: HTMLElement, paramsDictionary = { group: '0', page: '0' }) => {
  document.title = TITLES_PAGE.dictionary;
  const rootElement = element;
  rootElement.innerHTML = dictionaryTemplate();
  initDictionaryController(paramsDictionary);
};
