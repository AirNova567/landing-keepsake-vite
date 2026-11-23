# Keepsake: landing (Vite + Pug + SCSS)

Лендінг дизайн-агенції Keepsake з лабораторної роботи №7 (завдання 4), перенесений на професійний робочий процес: Pug, модульний SCSS, PostCSS, оптимізовані зображення, Prettier, Stylelint і Git hooks.

**Лінк:** https://airnova567.github.io/landing-keepsake-vite/

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
- Дизайн-токени з lab-07 — SCSS map-и (`$colors`, `$fonts`, `$breakpoints`) у `abstracts/`; 
- `@include mq(md)` бере брейкпоінт із map-а й використовує лише `min-width` (mobile first). 
- БЕМ через `&__` і `&--`, вкладеність не глибша за 3 рівні, без `id` у селекторах і без `!important`; вендорні префікси вручну не пишуться.
