import dictionaryTemplate from '../components/dictionary/index.hbs';
import headerTemplate from '../components/header/header.hbs';
import footerTemplate from '../components/footer/footer.hbs';
import groupButtonsTemplate from '../components/dictionary/groupButtons.hbs';
import { initDictionaryController } from '../controllers/dictionary/dictionary-controller';
import {
  DINAMIC_CLASSES,
  GROUP_DIFFICULT,
  KEYS_LS,
  MAX_PAGE_DICTIONARY,
  TITLES_PAGE,
} from '../const';
import setPagination from '../controllers/pagination/setPagination';
import { TUserData } from '../types/types';
import { getLSData } from '../utils/local-storage';
import getColorGroup from '../helpers/getColorGroup';

export const dictionary = (element: HTMLElement, paramsDictionary = { group: '0', page: '0' }) => {
  document.title = TITLES_PAGE.dictionary;
  const rootElement = element;
  const { page, group } = paramsDictionary;
  const colorGroup = getColorGroup(group);
  rootElement.innerHTML = '';
  rootElement.insertAdjacentHTML('beforeend', headerTemplate());
  rootElement.insertAdjacentHTML('beforeend', dictionaryTemplate({ colorGroup }));
  rootElement.insertAdjacentHTML('beforeend', footerTemplate());
  initDictionaryController(paramsDictionary);
  const dictionaryElement = document.querySelector('[data-role="dictionary"]');
  if (!(dictionaryElement instanceof HTMLElement)) return;
  const userData: TUserData | null = getLSData(KEYS_LS.userData);
  dictionaryElement.insertAdjacentHTML(
    'afterbegin',
    groupButtonsTemplate({ userData, DINAMIC_CLASSES }),
  );
  if (group !== GROUP_DIFFICULT) {
    setPagination(dictionaryElement, MAX_PAGE_DICTIONARY, +page, +group);
  }
};
