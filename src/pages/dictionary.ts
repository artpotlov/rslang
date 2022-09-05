import dictionaryTemplate from '../components/dictionary/index.hbs';
import headerTemplate from '../components/header/header.hbs';
import footerTemplate from '../components/footer/footer.hbs';
import { initDictionaryController } from '../controllers/dictionary/dictionary-controller';
import { initHeaderEvent } from '../controllers/header/header-controller';
import { TITLES_PAGE } from '../const';
import getColorGroup from '../helpers/getColorGroup';

export const dictionary = (element: HTMLElement, paramsDictionary = { group: '1', page: '1' }) => {
  document.title = TITLES_PAGE.dictionary;
  const rootElement = element;
  const { group } = paramsDictionary;
  const colorGroup = getColorGroup(group);
  rootElement.innerHTML = `
    ${headerTemplate({ activePage: { dictionary: true } })}
    ${dictionaryTemplate({ colorGroup })}
    ${footerTemplate()}
  `;
  initHeaderEvent();
  initDictionaryController(paramsDictionary);
};
