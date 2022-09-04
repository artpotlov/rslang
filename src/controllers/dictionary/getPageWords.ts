import { GROUP_DIFFICULT, KEYS_LS, StatusDifficulty } from '../../const';
import { IObjectString, TDataDictionary, TUserData } from '../../types/types';
import { getAggregatedWords, getChunkWords, getUserWord } from '../../utils/api';
import checkRequest from '../../utils/checkRequest';
import { getLSData } from '../../utils/local-storage';

const setDataWordsUser = async (
  userData: TUserData,
  words: Array<TDataDictionary>,
): Promise<TDataDictionary[]> => {
  const wordsUserPromise = words.map((word) => getUserWord(userData, word.id));
  const wordsUser = await Promise.all(wordsUserPromise);
  return wordsUser.map(({ params, status }, index) => {
    checkRequest(status);
    if (!params) return words[index];
    const difficulty = params.difficulty ? params.difficulty : null;
    return { ...words[index], difficulty, optional: params.optional };
  });
};

const getCommonGroupPage = async (
  { group, page }: IObjectString,
  userData: TUserData | null,
): Promise<TDataDictionary[]> => {
  const sendParams = {
    group: `${Number(group) - 1}`,
    page: `${Number(page) - 1}`,
  };
  const { params } = await getChunkWords(sendParams);
  if (!params) return [];
  if (!userData) return params;
  return setDataWordsUser(userData, params);
};

const getDifficultGroupPage = async (userData: TUserData) => {
  const queryParamsHardWord = {
    filter: JSON.stringify({ 'userWord.difficulty': StatusDifficulty.HARD }),
  };
  const { params, status } = await getAggregatedWords(userData, queryParamsHardWord);
  checkRequest(status);
  if (!params) return [];
  const words = params[0].paginatedResults.map((word) => ({ ...word, id: word._id }));
  return setDataWordsUser(userData, words);
};

const getPageWords = async (paramsDictionary: IObjectString): Promise<TDataDictionary[]> => {
  const isDifficultGroup = paramsDictionary.group === GROUP_DIFFICULT;
  const userData: TUserData | null = getLSData(KEYS_LS.userData);
  return isDifficultGroup && userData
    ? await getDifficultGroupPage(userData)
    : await getCommonGroupPage(paramsDictionary, userData);
};

export default getPageWords;
