export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface IUserData {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface ISignInResponse {
  status: number;
  params: IUserData | null;
}

export interface IErrorBody {
  path: string;
  message: string;
}

export interface IBaseUser {
  email: string;
  password: string;
}

export interface ICreateUser extends IBaseUser {
  name: string;
}
export interface ICreateUserError {
  error: {
    status: string;
    errors: IErrorBody[];
  };
}

export interface ICreateUserResponse {
  status: number;
  params: ICreateUser | ICreateUserError;
}

export interface IObjectString extends Record<string, string> {
  group: string;
  page: string;
}

export type TDataDictionary = {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
};

export type TDataDictionaryResponse = {
  status: number;
  params: TDataDictionary;
};
