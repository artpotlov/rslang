import { RequestMethod, StatusDifficulty } from '../const';

export interface IUserToken {
  token: string;
  refreshToken: string;
}

export interface IUserTokenResponse {
  status: number;
  params: IUserToken | null;
}

export interface IUserData extends IUserToken {
  message: string;
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

export type TUserWord = {
  difficulty?: StatusDifficulty | null;
  optional?: Record<string, unknown>;
};

export type TUserWordResponse = {
  status: number;
  params: TUserWord | null;
};

export type TDataDictionary = TUserWord & {
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
  params: TDataDictionary[];
};

export type TUserData = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};

export type TRequestParams<TBody> = {
  method: RequestMethod;
  sendParams?: TBody;
  customHeaders?: HeadersInit;
};

export type TAggregatedPaginated = TUserWord & {
  _id: string;
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

export type TAggregatedWords = {
  paginatedResults: TAggregatedPaginated[];
};

export type TAggregatedWordRequest = {
  status: number;
  params: TAggregatedWords[];
};

export type TSprintGameMode = 'common' | 'book';

export interface IUserInput {
  userId: string;
  token: string;
}

export interface IGetUserData {
  id: string;
  name: string;
  email: string;
}

export interface IGetUserDataResponse {
  status: number;
  params: IGetUserData | null;
}

export interface IGameWordStats {
  countCorrectAnswer: number;
  countWrongAnswer: number;
}

export interface IWordParams {
  difficulty: 'easy' | 'hard';
  optional: {
    learned: boolean;
    countRepeated?: number;
    sprintGame?: IGameWordStats;
    audioGame?: IGameWordStats;
  };
}

export interface IWordParamsResponse {
  status: number;
  params: IWordParams | null;
}

export interface IUserWordInput extends IUserInput {
  wordId: string;
  params?: IWordParams;
}

export interface IUserAggregateWordsInput extends IUserInput {
  group: number;
  page?: number;
  wordsPerPage: number;
  isLearnedWords: boolean;
}

export interface IUserAggregateBase extends TDataDictionary {
  _id?: string;
  userWord?: IWordParams;
}

export interface IUserAggregateWordsResponse {
  status: number;
  params:
    | [
        {
          paginatedResults: IUserAggregateBase[];
        },
      ]
    | null;
}

export interface IGameStatistic {
  countNewWords: number;
  countCorrectAnswer: number;
  countWords: number;
  longSeries: number;
  score: number;
}

export interface IStatisticBase {
  date: string;
  learnedWords: number;
  sprintGame?: IGameStatistic;
  audioGame?: IGameStatistic;
}

export interface IStatistic {
  learnedWords: number;
  optional: {
    lastChange: IStatisticBase;
    days: {
      allDays: IStatisticBase[];
    };
  };
}

export interface IStatisticResponse {
  status: number;
  params: {
    id: number;
  } & IStatistic;
}

export interface IStatisticInput extends IUserInput {
  params: IStatistic;
}

export type TTypeGame = 'sprint' | 'audio';

export type TStatMode = 'sprint' | 'audio' | 'book';

export type TChartData = {
  title: string;
  data: number[];
  labels: string[];
};

export interface IAudioGameWords {
  word: IUserAggregateBase;
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  word5: string;
}
