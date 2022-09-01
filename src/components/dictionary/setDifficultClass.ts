import { StatusDifficulty } from '../../const';

const setDifficultClass = (difficult: string, classHard: string, classEasy = '') => {
  return difficult === StatusDifficulty.HARD ? classHard : classEasy;
};

export default setDifficultClass;
