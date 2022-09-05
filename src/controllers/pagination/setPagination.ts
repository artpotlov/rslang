import initPagination from './pagination';

const setPagination = (
  parent: HTMLElement,
  isLearnedPage: boolean,
  maxPage: number,
  page: number,
  group?: number,
) => {
  const paginationElement = initPagination(isLearnedPage, maxPage, page, group);
  parent.insertAdjacentHTML('beforeend', paginationElement);
};

export default setPagination;
