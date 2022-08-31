import { DINAMIC_CLASSES } from '../const';

const getColorGroup = (group: string) => {
  let color = '';
  switch (group) {
    case '0':
      color = DINAMIC_CLASSES.colorGroupOne;
      break;
    case '1':
      color = DINAMIC_CLASSES.colorGroupTwo;
      break;
    case '2':
      color = DINAMIC_CLASSES.colorGroupThree;
      break;
    case '3':
      color = DINAMIC_CLASSES.colorGroupFour;
      break;
    case '4':
      color = DINAMIC_CLASSES.colorGroupFive;
      break;
    case '5':
      color = DINAMIC_CLASSES.colorGroupSix;
      break;
    case '6':
      color = DINAMIC_CLASSES.colorGroupSeven;
      break;
    default:
      color = DINAMIC_CLASSES.colorGroupOne;
  }
  return color;
};

export default getColorGroup;
