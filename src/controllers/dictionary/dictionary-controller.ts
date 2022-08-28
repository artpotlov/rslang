import { IObjectString, TDataDictionary, TUserData, TUserWord } from '../../types/types';
import { createUserWord, getChunkWords, getUserWord, updateUserWord } from '../../utils/api';
import templateCard from '../../components/dictionary/card.hbs';
import { API_URL, DINAMIC_CLASSES, KEYS_LS, MAX_PAGE_DICTIONARY, StatusDifficulty } from '../../const';
import stopSound from '../../helpers/stopSount';
import playSound from '../../helpers/playSound';
import { deleteLSData, getLSData } from '../../utils/local-storage';
import isAuth from '../../utils/checkAuth';
import logout from '../../utils/logout';
import initPagination from '../pagination/pagination';

class DictionaryController {
  dictionaryElement;
  dictionaryContentElement;
  dataDictionary;
  soundData: HTMLAudioElement[] | [];
  userData;
  paramsDictionary;

  constructor(
    dictionaryElement: HTMLElement,
    dictionaryContentElement: HTMLElement,
    dataDictionary: TDataDictionary[],
    paramsDictionary: IObjectString,
    userData: TUserData | null,
  ) {
    this.dictionaryElement = dictionaryElement;
    this.dictionaryContentElement = dictionaryContentElement;
    this.dataDictionary = dataDictionary;
    this.soundData = [];
    this.paramsDictionary = paramsDictionary;
    this.userData = userData;
  }

  errorRequest = (status: number) => {
    if (!isAuth(status)) {
      this.userData = null;
      logout();
    }
  };

  setDictionaryView = () => {
    this.dictionaryContentElement.innerHTML = templateCard({
      API_URL,
      idUser: this.userData?.userId,
      dataDictionary: this.dataDictionary,
      DINAMIC_CLASSES,
    });
    const paginationElement = initPagination(
      MAX_PAGE_DICTIONARY,
      +this.paramsDictionary.page,
      +this.paramsDictionary.group,
    );
    this.dictionaryElement.insertAdjacentHTML('beforeend', paginationElement);
  };

  initEvent = () => {
    const cardsDictionary = this.dictionaryContentElement.querySelectorAll(
      '[data-role="dictionary__card"]',
    );
    cardsDictionary.forEach((card) =>
      card.addEventListener('click', ({ target, currentTarget }) => {
        if (!(target instanceof HTMLElement) || !(currentTarget instanceof HTMLElement)) return;
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
      case 'dictionary__difficult':
        this.clickDifficult(wordData, target, currentTarget);
        break;
      case 'dictionary__studied':
        this.clickLearned(wordData, target, currentTarget);
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

  clickDifficult = async (wordData: TDataDictionary, icon: HTMLElement, card: HTMLElement) => {
    if (icon.classList.contains(DINAMIC_CLASSES.iconWordDifficult)) return;
    const setDifficultCard = () => {
      wordData.difficulty = StatusDifficulty.HARD;
      icon.classList.add(DINAMIC_CLASSES.iconWordDifficult);
      card.classList.remove(DINAMIC_CLASSES.cardWordDefault);
      card.classList.add(DINAMIC_CLASSES.cardWordDifficult);
    };
    const { optional } = wordData;
    const sendParams: TUserWord = { difficulty: StatusDifficulty.HARD };
    if (optional) {
      sendParams.optional = optional;
    }
    this.changeWord(wordData, sendParams, setDifficultCard);
  };

  clickLearned = async (wordData: TDataDictionary, icon: HTMLElement, card: HTMLElement) => {
    if (icon.classList.contains(DINAMIC_CLASSES.iconWordLerned)) return;
    const sendParams: TUserWord = { difficulty: StatusDifficulty.EASY, optional: { lerned: true } };
    const setLernedCard = () => {
      icon.classList.add(DINAMIC_CLASSES.iconWordLerned);
      card
        .querySelector('[data-role="dictionary__difficult"]')
        ?.classList.add(DINAMIC_CLASSES.invisible);
      card.classList.remove(DINAMIC_CLASSES.cardWordDifficult, DINAMIC_CLASSES.cardWordDefault);
      card.classList.add(DINAMIC_CLASSES.cardWordLerned);
    };
    const { optional } = wordData;
    if (optional) {
      sendParams.optional = { ...optional, ...sendParams.optional };
    }
    this.changeWord(wordData, sendParams, setLernedCard);
  };

  changeWord = async (wordData: TDataDictionary, sendParams: TUserWord, callback: () => void) => {
    if (!this.userData) return;
    const { difficulty, optional } = wordData;
    if (difficulty || optional) {
      const { status, params } = await updateUserWord(this.userData, wordData.id, sendParams);
      params ? callback() : this.errorRequest(status);
    } else {
      const { status, params } = await createUserWord(this.userData, wordData.id, sendParams);
      params ? callback() : this.errorRequest(status);
    }
  };

  updateDictionary = () => {
    this.setDictionaryView();
    this.initEvent();
  };
}

const setAdditionalDataWords = async (
  userData: TUserData,
  words: TDataDictionary[],
): Promise<TDataDictionary[] & TUserWord[]> => {
  try {
    const wordsUserPromise = words.map((word) => getUserWord(userData, word.id));
    const wordsUser = await Promise.all(wordsUserPromise);

    return wordsUser.map(({ params, status }, index) => {
      if (!params) {
        !isAuth(status) && deleteLSData(KEYS_LS.userData);
        return words[index];
      }
      const difficultyWord = params.difficulty === StatusDifficulty.HARD ? params.difficulty : null;
      const optionalWord = params.optional || null;
      return { ...words[index], difficulty: difficultyWord, optional: optionalWord };
    });
  } catch {
    return words;
  }
};

export const initDictionaryController = async (paramsDictionary: IObjectString) => {
  const dictionaryElement = document.querySelector('[data-role="dictionary"]');
  if (!(dictionaryElement instanceof HTMLElement)) return;
  const dictionaryContentElement = dictionaryElement.querySelector(
    '[data-role="dictionary__content"]',
  );
  if (!(dictionaryContentElement instanceof HTMLElement)) return;
  let { params } = await getChunkWords(paramsDictionary);
  if (!params) return;
  let userData: TUserData | null = getLSData(KEYS_LS.userData);
  if (userData) {
    params = await setAdditionalDataWords(userData, params);
  }
  userData = getLSData(KEYS_LS.userData);
  const dictionaryController = new DictionaryController(
    dictionaryElement,
    dictionaryContentElement,
    params,
    paramsDictionary,
    userData,
  );
  dictionaryController.updateDictionary();
};
