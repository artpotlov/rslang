import { DINAMIC_CLASSES } from '../const';

const getColorGroup = (group: string) => {
  let color = '';
  switch (group) {
    case '1':
      color = DINAMIC_CLASSES.colorGroupOne;
      break;
    case '2':
      color = DINAMIC_CLASSES.colorGroupTwo;
      break;
    case '3':
      color = DINAMIC_CLASSES.colorGroupThree;
      break;
    case '4':
      color = DINAMIC_CLASSES.colorGroupFour;
      break;
    case '5':
      color = DINAMIC_CLASSES.colorGroupFive;
      break;
    case '6':
      color = DINAMIC_CLASSES.colorGroupSix;
      break;
    case '7':
      color = DINAMIC_CLASSES.colorGroupSeven;
      break;
    default:
      color = '';
  }
  return color;
};

export default getColorGroup;
