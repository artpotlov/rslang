import footer from '../components/main-page/footer.hbs';
import '../assets/images/svg/rs_school_js.svg';

export const initFooter = (element: HTMLElement) => {
  const rootElement = element;
  rootElement.innerHTML += footer();
};
