import { IObjectString, TDataDictionary } from '../../types/types';
import { getChunkWords } from '../../utils/api';
import templateCard from '../../components/dictionary/card.hbs';
import { API_URL } from '../../const';

const setDictionaryView = (rootElement: HTMLElement, dataDictionary: TDataDictionary) => {
  const element = rootElement;
  element.innerHTML = templateCard({API_URL, dataDictionary });
};

export const initDictionaryController = async (paramsDictionary: IObjectString) => {
  const dictionaryContentElement = document.querySelector<HTMLElement>(
    '[data-role="dictionary__content"]',
  );
  if (!dictionaryContentElement) return;
  const { params } = await getChunkWords(paramsDictionary);
  setDictionaryView(dictionaryContentElement, params);
};
