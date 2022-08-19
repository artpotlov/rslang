import {
  IBaseUser,
  ICreateUser,
  ICreateUserResponse,
  ISignInResponse,
  RequestMethod,
} from '../types/types';

const API_URL = 'https://rslang-team-sixteen.herokuapp.com';

const getRequestParams = (
  method: RequestMethod,
  headers: HeadersInit,
  body: BodyInit,
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
