import footer from '../components/main-page/footer.hbs';

export const initFooter = (element: HTMLElement) => {
  const rootElement = element;
  rootElement.innerHTML += footer();
};
