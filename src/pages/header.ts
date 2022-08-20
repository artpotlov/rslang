import header from '../components/main-page/header.hbs';

export const initHeader = (element: HTMLElement): void => {
  const rootElement: HTMLElement = element;
  rootElement.innerHTML += header();
};
