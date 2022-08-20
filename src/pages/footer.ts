import footer from '../components/main-page/footer.hbs';

export const initFooter = (element: HTMLElement): void => {
  const rootElement: HTMLElement = element;
  rootElement.innerHTML += footer();
};
