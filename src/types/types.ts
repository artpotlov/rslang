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

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
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
