const transformDate = (date: string) => {
  return date
    .split('-')
    .reverse()
    .map((el) => (el.length > 1 ? el : `0${el}`))
    .join('.');
};

export default transformDate;
