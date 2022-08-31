import { IObjectString, TDataDictionary, TUserData, TUserWord } from '../../types/types';
import { createUserWord, updateUserWord } from '../../utils/api';
import templateCard from '../../components/dictionary/card.hbs';
import { API_URL, DINAMIC_CLASSES, GROUP_DIFFICULT, KEYS_LS, StatusDifficulty } from '../../const';
import stopSound from '../../helpers/stopSount';
import playSound from '../../helpers/playSound';
import { getLSData } from '../../utils/local-storage';
import checkRequest from '../../utils/checkRequest';
import getPageWords from './getPageWords';

class DictionaryController {
  dictionaryContentElement;
  dataDictionary;
  soundData: HTMLAudioElement[] | [];
  userData;
  paramsDictionary;
  isDifficultGroup;

  constructor(
    dictionaryContentElement: HTMLElement,
    dataDictionary: TDataDictionary[],
    paramsDictionary: IObjectString,
    userData: TUserData | null,
  ) {
    this.dictionaryContentElement = dictionaryContentElement;
    this.dataDictionary = dataDictionary;
    this.soundData = [];
    this.paramsDictionary = paramsDictionary;
    this.userData = userData;
    this.isDifficultGroup = paramsDictionary.group === GROUP_DIFFICULT;
  }

  setDictionaryView = () => {
    this.dictionaryContentElement.innerHTML = templateCard({
      API_URL,
      idUser: this.userData?.userId,
      dataDictionary: this.dataDictionary,
      DINAMIC_CLASSES,
      isDifficultGroup: this.isDifficultGroup,
    });
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
    const isDifficultWord = icon.classList.contains(DINAMIC_CLASSES.iconWordDifficult);
    if (!this.isDifficultGroup && isDifficultWord) return;
    const setDifficultyCard = () => {
      if (this.isDifficultGroup) {
        card.classList.add(DINAMIC_CLASSES.invisible);
      } else {
        wordData.difficulty = StatusDifficulty.HARD;
        icon.classList.toggle(DINAMIC_CLASSES.iconWordDifficult);
        card.classList.toggle(DINAMIC_CLASSES.cardWordDefault);
        card.classList.toggle(DINAMIC_CLASSES.cardWordDifficult);
      }
    };
    const { optional } = wordData;
    const sendParams: TUserWord = {
      difficulty: this.isDifficultGroup ? StatusDifficulty.EASY : StatusDifficulty.HARD,
    };
    if (optional) {
      sendParams.optional = optional;
    }
    this.changeWord(wordData, sendParams, setDifficultyCard);
  };

  clickLearned = async (wordData: TDataDictionary, icon: HTMLElement, card: HTMLElement) => {
    if (icon.classList.contains(DINAMIC_CLASSES.iconWordLerned)) return;
    const sendParams: TUserWord = { difficulty: StatusDifficulty.EASY, optional: { lerned: true } };
    const setLernedCard = () => {
      if (this.isDifficultGroup) {
        card.classList.add(DINAMIC_CLASSES.invisible);
      } else {
        icon.classList.add(DINAMIC_CLASSES.iconWordLerned);
        card
          .querySelector('[data-role="dictionary__difficult"]')
          ?.classList.add(DINAMIC_CLASSES.invisible);
        card.classList.remove(DINAMIC_CLASSES.cardWordDifficult, DINAMIC_CLASSES.cardWordDefault);
        card.classList.add(DINAMIC_CLASSES.cardWordLerned);
      }
    };
    const { optional } = wordData;
    if (optional) {
      sendParams.optional = { ...optional, ...sendParams.optional };
    }
    await this.changeWord(wordData, sendParams, setLernedCard);
    if (this.isDifficultGroup) card.classList.add(DINAMIC_CLASSES.invisible);
  };

  changeWord = async (wordData: TDataDictionary, sendParams: TUserWord, callback: () => void) => {
    if (!this.userData) return;
    const { difficulty, optional } = wordData;
    if (difficulty || optional) {
      const { status } = await updateUserWord(this.userData, wordData.id, sendParams);
      checkRequest(status);
      callback();
    } else {
      const { status } = await createUserWord(this.userData, wordData.id, sendParams);
      checkRequest(status);
      callback();
    }
  };

  setDictionary = () => {
    this.setDictionaryView();
    this.initEvent();
  };
}

export const initDictionaryController = async (paramsDictionary: IObjectString) => {
  const dictionaryContentElement = document.querySelector('[data-role="dictionary__content"]');
  if (!(dictionaryContentElement instanceof HTMLElement)) return;
  const pageWords = await getPageWords(paramsDictionary);
  const userData: TUserData | null = getLSData(KEYS_LS.userData);
  const dictionaryController = new DictionaryController(
    dictionaryContentElement,
    pageWords,
    paramsDictionary,
    userData,
  );
  dictionaryController.setDictionary();
};
