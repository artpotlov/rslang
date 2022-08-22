import { IObjectString, TDataDictionary } from '../../types/types';
import { getChunkWords } from '../../utils/api';
import templateCard from '../../components/dictionary/card.hbs';

const setDictionaryView = async (rootElement: HTMLElement, dataDictionary: TDataDictionary) => {
  const element = rootElement;
  element.innerHTML = templateCard({ dataDictionary });
};

export const initDictionaryController = async (paramsDictionary: IObjectString) => {
  const dictionaryContentElement = document.querySelector<HTMLElement>(
    '[data-role="dictionary__content"]',
  );
  if (!dictionaryContentElement) return;
  const { params } = await getChunkWords(paramsDictionary);
  setDictionaryView(dictionaryContentElement, params);
};
