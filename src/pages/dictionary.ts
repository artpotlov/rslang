import dictionaryTemplate from '../components/dictionary/index.hbs';
import headerTemplate from '../components/header/header.hbs';
import footerTemplate from '../components/footer/footer.hbs';
import { initDictionaryController } from '../controllers/dictionary/dictionary-controller';
import { initHeaderEvent } from '../controllers/header/header-controller';
import { TITLES_PAGE } from '../const';
import getColorGroup from '../helpers/getColorGroup';

export const dictionary = (element: HTMLElement, paramsDictionary = { group: '0', page: '0' }) => {
  document.title = TITLES_PAGE.dictionary;
  const rootElement = element;
  const { group } = paramsDictionary;
  const colorGroup = getColorGroup(group);
  rootElement.innerHTML = '';
  rootElement.insertAdjacentHTML('beforeend', headerTemplate());
  rootElement.insertAdjacentHTML('beforeend', dictionaryTemplate({ colorGroup }));
  rootElement.insertAdjacentHTML('beforeend', footerTemplate());
  initDictionaryController(paramsDictionary);
  initHeaderEvent();
};
