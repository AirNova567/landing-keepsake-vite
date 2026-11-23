# Keepsake: landing (Vite + Pug + SCSS)

Лендінг дизайн-агенції Keepsake з лабораторної роботи №7 (завдання 4), перенесений на професійний робочий процес: Pug, модульний SCSS, PostCSS, оптимізовані зображення, Prettier, Stylelint і Git hooks.
Макет, токени, брейкпоінти, стани й доступність не змінені: висота сторінки збігається з lab-07 на 375 / 768 / 1280 px (5228 / 4482 / 3771 px).

**Демо:** https://airnova567.github.io/landing-keepsake-vite/

## Вимоги до середовища

Node.js LTS (20 або новіший) і npm.

```bash
node -v
npm -v
```

## Команди

```bash
npm install        # встановлення залежностей
npm run dev        # dev-сервер з hot reload
npm run build      # продакшн-збірка в dist/
npm run preview    # локальний перегляд збірки
npm run format     # Prettier --write
npm run lint       # Stylelint + Prettier --check
npm run images     # генерація AVIF / WebP / JPEG з images-src/ у src/assets/images/
```

## Структура проєкту

```
images-src/            вихідні зображення (SVG), з яких sharp генерує растр
scripts/images.js      npm run images: AVIF + WebP + JPEG у двох ширинах
src/
├── assets/images/     згенеровані зображення (avif, webp, jpg)
├── components/        header.pug, footer.pug, sections/*.pug
├── data/              дані секцій (масиви об'єктів)
├── includes/          meta, fonts, svg/ (іконки послуг)
├── layouts/main.pug   базовий макет
├── mixins/            Pug-міксини
├── pages/index.pug    сторінка
└── styles/
    ├── abstracts/     змінні, функції, міксини (_index.scss з @forward)
    ├── base/          reset, CSS custom properties, типографіка
    ├── layout/        container, header, hero, footer
    ├── components/    один БЕМ-блок: один файл
    └── main.scss      єдина точка входу
```

## Архітектура Pug

- `layouts/main.pug` містить блоки `meta`, `title`, `styles`, `fonts`, `header`, `content`, `footer`, `scripts`, `data`. `pages/index.pug` успадковує макет через `extends`.
- `append meta` додає `description` та Open Graph, `prepend styles` додає preload шрифтів до підключення стилів.
- Хедер, футер і кожна секція — окремі файли, підключені через `include`; SVG-іконки послуг теж підключаються через `include`.
- Повторювані дані (навігація, категорії, роботи, послуги, статистика, клієнти, журнал, колонки футера, соцмережі) лежать у `src/data/` як масиви об'єктів і виводяться через `each`.
- Міксини: `+btn` (`block` + `&attributes`), `+icon` (`case`/`when`), `+picture`, `+work-card`, `+socials`, `+section-title`.
- Умови: `loading="lazy"` / `fetchpriority="high"`, активний пункт меню, `aria-current`; інтерполяція в тексті й атрибутах; службові коментарі `//-`.
- Фільтр портфоліо на `:checked ~` зберігається: радіокнопки та чипси також генеруються через `each`.

## Архітектура SCSS

- Лише `@use` / `@forward`; кожна папка має `_index.scss`, `main.scss` — єдина точка входу.
- Дизайн-токени з lab-07 — SCSS map-и (`$colors`, `$fonts`, `$breakpoints`) у `abstracts/`; кольори й шрифти через `@each` перетворюються на CSS custom properties в `:root`.
- `@include mq(md)` бере брейкпоінт із map-а й використовує лише `min-width` (mobile first). Власна функція `rem($px)` на `sass:math`, міксини `visually-hidden`, `flex-center`, `focus-ring`, `heading-text`, `motion-safe-transition`.
- БЕМ через `&__` і `&--`, вкладеність не глибша за 3 рівні, без `id` у селекторах і без `!important`; вендорні префікси вручну не пишуться.

## Інструменти

| Інструмент                        | Навіщо                                                          |
| --------------------------------- | --------------------------------------------------------------- |
| Vite + vituum                     | dev-сервер, збірка, хешування файлів, мініфікація CSS (esbuild) |
| Pug (`@vituum/vite-plugin-pug`)   | генерація HTML зі шаблонів, даних і міксинів                    |
| Sass                              | препроцесор: модулі, змінні, map-и, функції, міксини            |
| PostCSS + Autoprefixer            | постпроцесор: вендорні префікси за списком браузерів            |
| Browserslist (`.browserslistrc`)  | цільові браузери для Autoprefixer                               |
| sharp                             | генерація AVIF / WebP / JPEG у кількох ширинах                  |
| Prettier + `@prettier/plugin-pug` | єдиний стиль коду, зокрема `.pug`                               |
| Stylelint + standard-scss         | перевірка SCSS, БЕМ-шаблон класів, ліміт вкладеності            |
| husky + lint-staged               | pre-commit хук: перевірка лише змінених файлів                  |
| commitlint                        | повідомлення комітів за Conventional Commits                    |
| GitHub Actions                    | lint, збірка та деплой `dist` на GitHub Pages                   |

`sass`, `vite`, `vituum`, плагін Pug і всі лінтери лежать у `devDependencies`: вони потрібні лише під час збирання, готовий сайт — статичні файли без Node.

## Цільові браузери

```
last 2 Chrome versions
last 2 Firefox versions
last 2 Edge versions
last 2 Safari versions
last 2 iOS versions
```

`npx browserslist` показує фактичний список, `npx autoprefixer --info` — які властивості префіксуються (`user-select`, `text-size-adjust` тощо).

## Оптимізація: до і після

| Що                                          | До                    | Після                                     |
| ------------------------------------------- | --------------------- | ----------------------------------------- |
| CSS (lab-07: `reset.css` + `style.css`)     | 29.6 KB (5.4 KB gzip) | 21.7 KB мініфікований (4.3 KB gzip)       |
| Зображення: PNG, 13 картинок у двох ширинах | 197.2 KB              | AVIF 45.5 KB, WebP 55.7 KB, JPEG 109.1 KB |

Браузер завантажує AVIF, якщо підтримує його, інакше WebP, інакше JPEG, причому потрібної ширини за `srcset` / `sizes`.
