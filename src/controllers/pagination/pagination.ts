import paginationTemplate from '../../components/pagination/pagination.hbs';

const getLink = (baseUrl: string, page: number, curentGroup?: number) => {
  return curentGroup !== undefined ? `${baseUrl}${curentGroup}/${page}` : `${baseUrl}/${page}`;
};

const getPagesData = (
  maxPage: number,
  baseUrl: string,
  currentPage: number,
  curentGroup?: number,
) => {
  const defaultVisiblePages = [1, maxPage];
  const pages = Array(maxPage)
    .fill('')
    .map((_, index) => {
      const page = index + 1;
      const isCurrent = currentPage === page;

      const isVisible =
        defaultVisiblePages.includes(page) ||
        currentPage - 1 === page ||
        currentPage + 1 === page ||
        currentPage - 2 === page ||
        currentPage + 2 === page ||
        isCurrent;

      const isEmpty =
        (!defaultVisiblePages.includes(currentPage - 2) && currentPage - 2 === page) ||
        (!defaultVisiblePages.includes(currentPage + 2) && currentPage + 2 === page);

      const dataPage = { page, link: '', isCurrent, isVisible, isEmpty };

      if (isVisible && !isEmpty && !isCurrent) {
        dataPage.link = getLink(baseUrl, page, curentGroup);
      }
      return dataPage;
    })
    .filter((el) => el.isVisible);
  return pages;
};

const initPagination = (
  isLearnedPage: boolean,
  maxPage: number,
  currentPage: number,
  curentGroup?: number,
) => {
  const { origin, hash } = window.location;
  const [location] = hash.split('/');
  const baseUrl = `${origin}/${location}/`;
  const prevLink = {
    link: getLink(baseUrl, currentPage - 1, curentGroup),
    disabled: currentPage === 0,
  };
  const nextLink = {
    link: getLink(baseUrl, currentPage + 1, curentGroup),
    disabled: currentPage === maxPage - 1,
  };
  const pages = getPagesData(maxPage, baseUrl, currentPage, curentGroup);
  return paginationTemplate({
    currentPage,
    pages,
    nextLink,
    prevLink,
    isLearnedPage,
  });
};

export default initPagination;
