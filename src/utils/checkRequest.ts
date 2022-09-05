import { KEYS_LS } from '../const';
import { deleteLSData } from './local-storage';
import { router } from './router-storage';

const checkRequest = (status: number) => {
  switch (status) {
    case 200:
      break;
    case 401:
    case 402:
      deleteLSData(KEYS_LS.userData);
      router.redirectTo('#auth');
      break;
    default:
      break;
  }
};

export default checkRequest;
