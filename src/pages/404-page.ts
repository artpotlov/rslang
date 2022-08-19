import page404Template from '../components/page-404/index.hbs';

export const initPage404 = (element: HTMLElement) => {
  document.title = 'Страница не найдена';

  const rootElement = element;
  rootElement.innerHTML = page404Template();
};
