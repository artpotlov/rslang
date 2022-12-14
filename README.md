# RS Lang

RS Lang — приложение для изучения английского языка в игровой форме, включающее в себя электронный учебник с базой слов,
разделенных по разным категориям (в зависимости от уровня сложности), мини-игры и статистику обучения.

# Описание приложения

## Главная страница

Главная страница представляет собой страницу, на которой можно ознакомиться с описанием и преимуществами
приложения, навигацией и командой разработчиков.

## Электронный учебник

Электронный учебник выполняет функцию словаря, в котором присутствуют шесть различных категорий слов, распределенных по
уровню
сложности изучения.

На каждой странице учебника можно ознакомиться не только со словами, но также запустить мини-игры,
в которые будут загружены слова со страницы.

Для авторизованных пользователей присутствует возможность отмечать слова как сложные или как изученные.
Слова, отмеченные сложными, отправляются на отдельную страницу. Изученные и сложные слова на странице выделяются
отдельным стилем.

Для каждого отдельного слова доступна статистика изучения по играм.

## Мини-игры

### Аудивызов

Игра «Аудиовызов» представляет собой мини-игру, в которой дается аудиозапись слова на английском языке и
пять вариантов перевода. Пользователю необходимо выбрать правильный ответ из предложенных.

По окончанию игры пользователю выводится результат игры, в котором показаны правильные и неправильные ответы.

### Спринт

Игра «Спринт» представляет собой мини-игру, в которой пользователю необходимо как можно быстрее ответить на вопрос о
том, является ли английское слово и его перевод верным или неверным.

При старте игры пользователю дается минута для прохождения игры. За это время необходимо как можно больше дать верных
ответов. За каждые три правильных ответа увеличивается коэффициент очков. По окончанию игры пользователю выводится
список правильных и неправильных ответов.

### Для каждой игры

Управление в играх осуществляется с помощью мыши или с помощью клавиатуры.

Для авторизованных пользователей доступна игровая механика изучения слов. Новые и изучаемые слова становятся изученными
после того, как пользователь дал три верных ответа в играх. Для сложных слов необходимо ответить правильно пять раз.

Авторизованным пользователям также доступно сохранение статистики по слову и прогресса в игре за каждый день обучения.

## Статистика

В игре присутствует возможность сохранения статистики за каждый день обучения. Для этого в приложении имеется отдельная
страница. На данной странице можно ознакомиться с краткосрочной и долгосрочной статистикой.

Краткосрочная статистика показывает количество новых слов за день, количество изученных слов и процент правильных
ответов за день. Также имеется статистика по играм отдельно, в которой отображаются количество новых слов, процент
правильных ответов, самая длинная серия правильных ответов.

Долгосрочная статистика представляет собой два графика, в которых отображены количество новых слов за каждый день
обучения и
увеличение общего количества изученных слов за весь период по дням.

# Демо приложения

Демо приложение доступно в Github Pages данного проекта.

[Перейти](https://rslangapp.netlify.app)

# Установка и запуск приложения

1. Установите Git
2. Установите Node.js (рекомендуется версия 16.17.0 LTS)
3. Сделайте форк данного репозитория
4. Клонируйте форк репозитория на локальную машину с помощью
   команды `git clone https://github.com/<% your_github_user_name %>/rslang`
5. Перейдите в папку `rslang`
6. Перед локальным запуском приложения необходимо установить зависимости используя команду `npm install`
7. Для запуска приложения используйте команду `npm run start`
8. Для подготовки финального билда приложения используйте команду `npm run build`
9. Для разработки дополнительных функций приложения, рекомендуется переключиться на ветку `develop` и повторить шаг 6,
   если зависимости не были установлены

# Используемые технологии

1. [WebPack](https://webpack.js.org)
2. [Typescript](https://typescriptlang.org)
3. [SASS](https://sass-lang.com)
4. [Vanilla router](https://github.com/Graidenix/vanilla-router)
5. [Tailwind CSS](https://tailwindcss.com)
6. [Handlebars](https://handlebarsjs.com)
7. [Chart JS](https://chartjs.org)
8. [ES lint](https://eslint.org)
9. [Prettier](https://prettier.io)

# Авторы

- [Артем Потлов](https://github.com/artpotlov)
- [Александр Шустов](https://github.com/tonKristall)
- [Святослав Щипунов](https://github.com/Slava-Shchipunov)

# Используемые технологии командной работы

1. [Trello](https://trello.com) — для определения командных задач
2. [Telegram](https://telegram.org) — для коммуникации внутри команды
3. [RSS Teams](https://rss-teams.web.app) — для создания команд в RS School