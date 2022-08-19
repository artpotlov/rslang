import { ICreateUserResponse, ISignInResponse, RequestMethod } from '../types/types';

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

  const url = `${API_URL}/signin`;
  const params: RequestInit = {
    method: RequestMethod.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

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

export const createNewUser = async (
  name: string,
  email: string,
  password: string,
): Promise<ICreateUserResponse> => {
  const url = `${API_URL}/users`;
  const params: RequestInit = {
    method: RequestMethod.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  };

  const response = await fetch(url, params);

  return {
    status: response.status,
    params: await response.json(),
  };
};
