import initPagination from './pagination';

const setPagination = (
  parent: HTMLElement,
  isLernedPage: boolean,
  maxPage: number,
  page: number,
  group?: number,
) => {
  const paginationElement = initPagination(isLernedPage, maxPage, page, group);
  parent.insertAdjacentHTML('beforeend', paginationElement);
};

export default setPagination;
