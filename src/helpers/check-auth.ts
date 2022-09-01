import { deleteLSData, getLSData, setLSData } from '../utils/local-storage';
import { IUserData } from '../types/types';
import { getNewTokens, getUserData } from '../utils/api';

export const checkUserAuth = async () => {
  const userData = getLSData<IUserData>('userData');
  if (!userData) return false;
  const { userId, token, refreshToken } = userData;

  const userRemoteData = await getUserData({ userId, token });
  if (userRemoteData.status === 200) return true;
  deleteLSData('userData');

  const newTokens = await getNewTokens({ userId, token: refreshToken });
  if (newTokens.status !== 200 || !newTokens.params) return false;

  userData.token = newTokens.params.token;
  userData.refreshToken = newTokens.params.refreshToken;

  setLSData('userData', userData);

  return true;
};
