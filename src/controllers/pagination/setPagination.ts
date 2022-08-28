import initPagination from './pagination';

const setPagination = (parent: HTMLElement, maxPage: number, page: number, group?: number) => {
  const paginationElement = initPagination(maxPage, page, group);
  parent.insertAdjacentHTML('beforeend', paginationElement);
};

export default setPagination;
