import page404Template from '../components/page-404/index.hbs';

export const initPage404 = () => {
  document.title = 'Страница не найдена';

  document.body.innerHTML = page404Template();
};
