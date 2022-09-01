import { API_URL } from '../const';
import {
  IBaseUser,
  ICreateUser,
  ICreateUserResponse,
  IGetUserDataResponse,
  IObjectString,
  ISignInResponse,
  IStatisticInput,
  IStatisticResponse,
  IUserAggregateWordsInput,
  IUserAggregateWordsResponse,
  IUserInput,
  IUserWordInput,
  IWordParamsResponse,
  RequestMethod,
  TDataDictionaryResponse,
} from '../types/types';

const getRequestParams = (
  method: RequestMethod,
  headers: HeadersInit,
  body?: BodyInit,
): RequestInit => {
  return {
    method,
    headers,
    body,
  };
};

export const signIn = async (user: IBaseUser): Promise<ISignInResponse> => {
  const url = `${API_URL}/signin`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify(user);
  const params = getRequestParams(RequestMethod.POST, headers, body);

  const response = await fetch(url, params);

  if (!response.ok) {
    return {
      status: response.status,
      params: null,
    };
  }

  return {
    status: response.status,
    params: await response.json(),
  };
};

export const createNewUser = async (user: ICreateUser): Promise<ICreateUserResponse> => {
  const url = `${API_URL}/users`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify(user);
  const params = getRequestParams(RequestMethod.POST, headers, body);

  const response = await fetch(url, params);

  return {
    status: response.status,
    params: await response.json(),
  };
};

export const getChunkWords = async (
  sendParams: IObjectString,
): Promise<TDataDictionaryResponse> => {
  const queryString = new URLSearchParams(sendParams).toString();
  const url = `${API_URL}/words?${queryString}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const params = getRequestParams(RequestMethod.GET, headers);
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: await response.json(),
  };
};

export const checkUser = async (userInputData: IUserInput) => {
  const { userId, token } = userInputData;
  const url = `${API_URL}/users/${userId}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const params = getRequestParams(RequestMethod.GET, headers);
  const response = await fetch(url, params);

  if (response.status !== 200) return false;

  const userData: IGetUserDataResponse = await response.json();

  return userData.id === userId;
};

export const getWordParams = async (
  userWordParams: IUserWordInput,
): Promise<IWordParamsResponse> => {
  const { userId, wordId, token } = userWordParams;

  const url = `${API_URL}/users/${userId}/words/${wordId}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const params = getRequestParams(RequestMethod.GET, headers);

  const response = await fetch(url, params);

  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const setWordParams = async (userWordData: IUserWordInput): Promise<IWordParamsResponse> => {
  const { userId, wordId, token, params } = userWordData;

  const url = `${API_URL}/users/${userId}/words/${wordId}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body: BodyInit = JSON.stringify(params);
  const requestParams = getRequestParams(RequestMethod.POST, headers, body);

  const response = await fetch(url, requestParams);

  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const updateWordParams = async (userWordData: IUserWordInput) => {
  const { userId, wordId, token, params } = userWordData;

  const url = `${API_URL}/users/${userId}/words/${wordId}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body: BodyInit = JSON.stringify(params);
  const requestParams = getRequestParams(RequestMethod.PUT, headers, body);

  const response = await fetch(url, requestParams);

  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getChunkUserWords = async (
  sendParams: IUserAggregateWordsInput,
): Promise<IUserAggregateWordsResponse> => {
  const { group, page, wordsPerPage, userId, token, isLearnedWords } = sendParams;
  const filter = {
    $and: [
      {
        group,
        page,
      },
      {
        $or: [
          {
            $or: [
              {
                'userWord.difficulty': 'easy',
                'userWord.optional.learned': isLearnedWords,
              },
              {
                'userWord.difficulty': 'hard',
                'userWord.optional.learned': isLearnedWords,
              },
            ],
          },
          {
            userWord: null,
          },
        ],
      },
    ],
  };

  const queryParams = new URLSearchParams({
    wordsPerPage: wordsPerPage.toString(),
    filter: JSON.stringify(filter),
  }).toString();
  const url = `${API_URL}/users/${userId}/aggregatedWords?${queryParams}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const requestParams = getRequestParams(RequestMethod.GET, headers);

  const response = await fetch(url, requestParams);

  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getStatistics = async (userParams: IUserInput): Promise<IStatisticResponse> => {
  const { userId, token } = userParams;
  const url = `${API_URL}/users/${userId}/statistics`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const requestParams = getRequestParams(RequestMethod.GET, headers);

  const response = await fetch(url, requestParams);

  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const updateStatistics = async (
  sendParams: IStatisticInput,
): Promise<IStatisticResponse> => {
  const { userId, token, params } = sendParams;
  const url = `${API_URL}/users/${userId}/statistics`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body: BodyInit = JSON.stringify(params);
  const requestParams = getRequestParams(RequestMethod.PUT, headers, body);

  const response = await fetch(url, requestParams);

  return {
    status: response.status,
    params: await response.json(),
  };
};
