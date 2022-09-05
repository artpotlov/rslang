const transformDateToBack = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
};

const transformDateFromBack = (date: string) => {
  return date
    .split('-')
    .reverse()
    .map((el) => (el.length > 1 ? el : `0${el}`))
    .join('.');
};

export { transformDateToBack, transformDateFromBack };
