import { IObjectString, TDataDictionary } from '../../types/types';
import { getChunkWords } from '../../utils/api';
import templateCard from '../../components/dictionary/card.hbs';
import { API_URL } from '../../const';
import stopSound from '../../helpers/stopSount';
import playSound from '../../helpers/playSound';

class DictionaryController {
  dictionaryContentElement;
  dataDictionary;
  soundData: HTMLAudioElement[] | [];

  constructor(dictionaryContentElement: HTMLElement, dataDictionary: TDataDictionary[]) {
    this.dictionaryContentElement = dictionaryContentElement;
    this.dataDictionary = dataDictionary;
    this.soundData = [];
  }

  setDictionaryView = () => {
    this.dictionaryContentElement.innerHTML = templateCard({
      API_URL,
      dataDictionary: this.dataDictionary,
    });
  };

  initEvent = () => {
    const cardsDictionary = this.dictionaryContentElement.querySelectorAll(
      '[data-role="dictionary__card"]',
    );
    cardsDictionary.forEach((card) =>
      card.addEventListener('click', ({ target, currentTarget }) => {
        if (
          !(target instanceof HTMLElement) ||
          !(currentTarget instanceof HTMLElement) ||
          !cardsDictionary
        )
          return;
        this.clickControl(target, currentTarget);
      }),
    );
  };

  findWord = (id: string) => {
    return this.dataDictionary.find((word) => word.id === id);
  };

  clickControl = (target: HTMLElement, currentTarget: HTMLElement) => {
    const wordId = currentTarget?.dataset?.id;
    if (!wordId) return;
    const wordData = this.findWord(wordId);
    if (!wordData) return;
    switch (target.dataset.role) {
      case 'dictionary__sound':
        this.clickSound(wordData);
        break;
      default:
        break;
    }
  };

  clickSound = (wordData: TDataDictionary) => {
    stopSound(this.soundData);
    const { audio, audioExample, audioMeaning } = wordData;
    this.soundData = [audio, audioMeaning, audioExample].map((el) => new Audio(`${API_URL}/${el}`));
    playSound(this.soundData);
  };
}

export const initDictionaryController = async (paramsDictionary: IObjectString) => {
  const dictionaryContentElement = document.querySelector<HTMLElement>(
    '[data-role="dictionary__content"]',
  );
  if (!dictionaryContentElement) return;
  const { params } = await getChunkWords(paramsDictionary);
  const dictionaryController = new DictionaryController(dictionaryContentElement, params);
  dictionaryController.setDictionaryView();
  dictionaryController.initEvent();
};
