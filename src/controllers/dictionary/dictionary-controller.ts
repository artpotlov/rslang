import {
  IObjectString,
  IStatisticInput,
  TDataDictionary,
  TUserData,
  TUserWord,
} from '../../types/types';
import { createUserWord, getStatistics, updateStatistics, updateUserWord } from '../../utils/api';
import templateCard from '../../components/dictionary/card.hbs';
import groupButtonsTemplate from '../../components/dictionary/groupButtons.hbs';
import {
  API_URL,
  DINAMIC_CLASSES,
  GROUP_DIFFICULT,
  KEYS_LS,
  MAX_PAGE_DICTIONARY,
  StatusDifficulty,
} from '../../const';
import stopSound from '../../helpers/stopSount';
import playSound from '../../helpers/playSound';
import { getLSData } from '../../utils/local-storage';
import checkRequest from '../../utils/checkRequest';
import getPageWords from './getPageWords';
import setPagination from '../pagination/setPagination';
import checkLearnedPage from '../../helpers/checkLearnedPage';
import { transformDateToBack } from '../../helpers/transformDate';

class DictionaryController {
  dictionaryContentElement;
  dictionaryElement;
  dataDictionary;
  soundData: HTMLAudioElement[] | [];
  userData;
  paramsDictionary;
  isDifficultGroup;

  constructor(
    dictionaryElement: HTMLElement,
    dictionaryContentElement: HTMLElement,
    dataDictionary: TDataDictionary[],
    paramsDictionary: IObjectString,
    userData: TUserData | null,
  ) {
    this.dictionaryContentElement = dictionaryContentElement;
    this.dictionaryElement = dictionaryElement;
    this.dataDictionary = dataDictionary;
    this.soundData = [];
    this.paramsDictionary = paramsDictionary;
    this.userData = userData;
    this.isDifficultGroup = paramsDictionary.group === GROUP_DIFFICULT;
  }

  setPaginationView = (isLearnedPage = true) => {
    const { page, group } = this.paramsDictionary;
    if (group !== GROUP_DIFFICULT) {
      setPagination(this.dictionaryElement, isLearnedPage, MAX_PAGE_DICTIONARY, +page, +group);
    }
  };

  deletePagination = () => {
    const paginationElement = this.dictionaryElement.querySelector('[data-role="pagination"]');
    if (paginationElement instanceof HTMLElement) paginationElement.remove();
  };

  setGroupButtons = (isLearnedPage = true) => {
    const { group, page } = this.paramsDictionary;
    this.dictionaryElement.insertAdjacentHTML(
      'afterbegin',
      groupButtonsTemplate({
        userData: this.userData,
        DINAMIC_CLASSES,
        isLearnedPage,
        group,
        page,
      }),
    );
  };

  deleteButtonGames = () => {
    const buttonGamesElement = this.dictionaryElement.querySelector(
      '[data-role="group-buttons__games"]',
    );
    if (buttonGamesElement instanceof HTMLElement) buttonGamesElement.remove();
  };

  setLearnedPage = () => {
    this.dictionaryContentElement.classList.add(...DINAMIC_CLASSES.bgLearnedPage);
  };

  setDictionaryView = () => {
    const isLearnedPage = checkLearnedPage(this.dataDictionary);
    if (isLearnedPage) this.setLearnedPage();
    this.setGroupButtons(isLearnedPage);
    this.setPaginationView(isLearnedPage);
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
        icon.classList.remove('cursor-pointer');
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
    if (icon.classList.contains(DINAMIC_CLASSES.iconWordLearned)) return;
    const sendParams: TUserWord = {
      difficulty: StatusDifficulty.EASY,
      optional: { learned: true },
    };
    const setLearnedCard = () => {
      if (this.isDifficultGroup) {
        card.classList.add(DINAMIC_CLASSES.invisible);
      } else {
        icon.classList.add(DINAMIC_CLASSES.iconWordLearned);
        icon.classList.remove('cursor-pointer');
        card
          .querySelector('[data-role="dictionary__difficult"]')
          ?.classList.add(DINAMIC_CLASSES.invisible);
        card.classList.remove(DINAMIC_CLASSES.cardWordDifficult, DINAMIC_CLASSES.cardWordDefault);
        card.classList.add(DINAMIC_CLASSES.cardWordLearned);
      }
    };
    const { optional } = wordData;
    if (optional) {
      sendParams.optional = { ...optional, ...sendParams.optional };
    }
    await this.changeWord(wordData, sendParams, setLearnedCard);
    await this.updateStatistics();
    this.changeStylePage();
  };

  updateStatistics = async () => {
    if (!this.userData) return;
    const responseStats = await getStatistics(this.userData);
    checkRequest(responseStats.status);
    let { learnedWords, optional } = responseStats.params;
    const currentDate = transformDateToBack();
    learnedWords += 1;
    if (currentDate === optional.lastChange.date) {
      optional.lastChange.learnedWords += 1;
    } else {
      optional.days.allDays.push(optional.lastChange);
      optional.lastChange = { learnedWords: 1, date: currentDate };
    }
    const statistics: IStatisticInput = { params: { learnedWords, optional }, ...this.userData };
    const { status } = await updateStatistics(statistics);
    checkRequest(status);
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
    wordData.optional = wordData.optional
      ? { ...wordData.optional, learned: true }
      : { learned: true };
  };

  changeStylePage = () => {
    if (!checkLearnedPage(this.dataDictionary)) return;
    this.deleteButtonGames();
    this.deletePagination();
    this.setPaginationView();
    this.setLearnedPage();
  };
}

export const initDictionaryController = async (paramsDictionary: IObjectString) => {
  const dictionaryElement = document.querySelector('[data-role="dictionary"]');
  if (!(dictionaryElement instanceof HTMLElement)) return;
  const dictionaryContentElement = dictionaryElement.querySelector(
    '[data-role="dictionary__content"]',
  );
  if (!(dictionaryContentElement instanceof HTMLElement)) return;
  dictionaryContentElement.innerHTML = 'Загрузка...';
  const pageWords = await getPageWords(paramsDictionary);
  const userData: TUserData | null = getLSData(KEYS_LS.userData);
  const dictionaryController = new DictionaryController(
    dictionaryElement,
    dictionaryContentElement,
    pageWords,
    paramsDictionary,
    userData,
  );
  dictionaryController.setDictionaryView();
  dictionaryController.initEvent();
};
