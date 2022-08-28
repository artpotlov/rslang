import { KEYS_LS } from '../const';
import { deleteLSData } from './local-storage';

const logout = () => {
  deleteLSData(KEYS_LS.userData);
  //tоdo router
  window.location.replace('#auth');
};

export default logout;
