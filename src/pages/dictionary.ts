import dictionaryTemplate from '../components/dictionary/index.hbs';
import headerTemplate from '../components/header/header.hbs';
import footerTemplate from '../components/footer/footer.hbs';
import { initDictionaryController } from '../controllers/dictionary/dictionary-controller';
import { MAX_PAGE_DICTIONARY, TITLES_PAGE } from '../const';
import setPagination from '../controllers/pagination/setPagination';

export const dictionary = (element: HTMLElement, paramsDictionary = { group: '0', page: '0' }) => {
  document.title = TITLES_PAGE.dictionary;
  const rootElement = element;
  rootElement.innerHTML = '';
  rootElement.insertAdjacentHTML('beforeend', headerTemplate());
  rootElement.insertAdjacentHTML('beforeend', dictionaryTemplate());
  rootElement.insertAdjacentHTML('beforeend', footerTemplate());
  initDictionaryController(paramsDictionary);
  const dictionaryElement = document.querySelector('[data-role="dictionary"]');
  if (!(dictionaryElement instanceof HTMLElement)) return;
  const { page, group } = paramsDictionary;
  setPagination(dictionaryElement, MAX_PAGE_DICTIONARY, +page, +group);
};
