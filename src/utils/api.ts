import { API_URL, RequestMethod } from '../const';
import {
  IBaseUser,
  ICreateUser,
  ICreateUserResponse,
  IGetUserDataResponse,
  IObjectString,
  ISignInResponse,
  TAggregatedWordRequest,
  IStatisticInput,
  IStatisticResponse,
  IUserAggregateWordsInput,
  IUserAggregateWordsResponse,
  IUserInput,
  IUserTokenResponse,
  IUserWordInput,
  IWordParamsResponse,
  TDataDictionaryResponse,
  TRequestParams,
  TUserData,
  TUserWord,
  TUserWordResponse,
} from '../types/types';

const getRequestParams = <TBody extends object>({
  method,
  sendParams,
  customHeaders,
}: TRequestParams<TBody>): RequestInit => {
  const headers = { 'Content-Type': 'application/json' };
  const paramsRequest: RequestInit = { method, headers };
  if (sendParams) paramsRequest.body = JSON.stringify(sendParams);
  if (customHeaders) paramsRequest.headers = { ...headers, ...customHeaders };
  return paramsRequest;
};

export const signIn = async (sendParams: IBaseUser): Promise<ISignInResponse> => {
  const url = `${API_URL}/signin`;
  const method = RequestMethod.POST;
  const params = getRequestParams({ method, sendParams });
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

export const createNewUser = async (sendParams: ICreateUser): Promise<ICreateUserResponse> => {
  const url = `${API_URL}/users`;
  const method = RequestMethod.POST;
  const params = getRequestParams({ method, sendParams });
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
  const method = RequestMethod.GET;
  const params = getRequestParams({ method });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const createUserWord = async (
  userData: TUserData,
  idWord: string,
  sendParams: TUserWord,
): Promise<TUserWordResponse> => {
  const { userId, token } = userData;
  const url = `${API_URL}/users/${userId}/words/${idWord}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.POST;
  const params = getRequestParams({ method, sendParams, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getUserWord = async (userData: TUserData, idWord: string): Promise<TUserWordResponse> => {
  const { userId, token } = userData;
  const url = `${API_URL}/users/${userId}/words/${idWord}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const updateUserWord = async (
  userData: TUserData,
  idWord: string,
  sendParams: TUserWord,
): Promise<TUserWordResponse> => {
  const { userId, token } = userData;
  const url = `${API_URL}/users/${userId}/words/${idWord}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.PUT;
  const params = getRequestParams({ method, sendParams, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getAggregatedWords = async (
  userData: TUserData,
  sendParams: Record<string, string>,
): Promise<TAggregatedWordRequest> => {
  const { userId, token } = userData;
  const queryString = new URLSearchParams(sendParams).toString();
  const url = `${API_URL}/users/${userId}/aggregatedWords?${queryString}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getNewTokens = async (userInputData: IUserInput): Promise<IUserTokenResponse> => {
  const { userId, token } = userInputData;
  const url = `${API_URL}/users/${userId}/tokens`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getUserData = async (userInputData: IUserInput): Promise<IGetUserDataResponse> => {
  const { userId, token } = userInputData;
  const url = `${API_URL}/users/${userId}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getWordParams = async (
  userWordParams: IUserWordInput,
): Promise<IWordParamsResponse> => {
  const { userId, wordId, token } = userWordParams;
  const url = `${API_URL}/users/${userId}/words/${wordId}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const setWordParams = async (userWordData: IUserWordInput): Promise<IWordParamsResponse> => {
  const { userId, wordId, token, params } = userWordData;
  const url = `${API_URL}/users/${userId}/words/${wordId}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.POST;
  const requestParams = getRequestParams({ method, customHeaders, sendParams: params });
  const response = await fetch(url, requestParams);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const updateWordParams = async (userWordData: IUserWordInput) => {
  const { userId, wordId, token, params } = userWordData;
  const url = `${API_URL}/users/${userId}/words/${wordId}`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.PUT;
  const requestParams = getRequestParams({ method, customHeaders, sendParams: params });
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
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
  return {
    status: response.status,
    params: response.ok ? await response.json() : null,
  };
};

export const getStatistics = async (userParams: IUserInput): Promise<IStatisticResponse> => {
  const { userId, token } = userParams;
  const url = `${API_URL}/users/${userId}/statistics`;
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.GET;
  const params = getRequestParams({ method, customHeaders });
  const response = await fetch(url, params);
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
  const customHeaders = { Authorization: `Bearer ${token}` };
  const method = RequestMethod.PUT;
  const requestParams = getRequestParams({ method, customHeaders, sendParams: params });
  const response = await fetch(url, requestParams);

  return {
    status: response.status,
    params: await response.json(),
  };
};
