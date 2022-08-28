import paginationTemplate from '../../components/pagination/pagination.hbs';

const initPagination = (maxPage: number, currentPage: number, curentGroup?: number) => {
  const { origin, hash } = window.location;
  const [location] = hash.split('/').filter((el) => !!el);
  const defaultVisiblePages = [0, maxPage - 1];
  const prevLink = {
    link:
      curentGroup !== undefined
        ? `${origin}/${location}/${curentGroup}/${currentPage - 1}`
        : `${origin}/${location}/${currentPage - 1}`,
    disabled: currentPage === 0,
  };
  const nextLink = {
    link:
      curentGroup !== undefined
        ? `${origin}/${location}/${curentGroup}/${currentPage + 1}`
        : `${origin}/${location}/${currentPage + 1}`,
    disabled: currentPage === maxPage - 1,
  };
  const pages = Array(maxPage)
    .fill('')
    .map((_, index) => {
      const page = index;
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
      const dataPage = { page: page + 1, link: '', isCurrent, isVisible, isEmpty };
      if (isVisible && !isEmpty && !isCurrent) {
        curentGroup !== undefined
          ? (dataPage.link = `${origin}/${location}/${curentGroup}/${page}`)
          : (dataPage.link = `${origin}/${location}/${page}`);
      }
      return dataPage;
    })
    .filter((el) => el.isVisible);
  return paginationTemplate({
    currentPage,
    pages,
    nextLink,
    prevLink,
  });
};

export default initPagination;
