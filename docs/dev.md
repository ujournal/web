---
title: Розробникам
---

## UJournal Web

UJournal Web створено на основі статичного генератора сайтів [Jekyll](https://jekyllrb.com/) з використанням фреймворків [TailwindCSS](https://tailwindcss.com/) та [AlpineJS](https://alpinejs.dev/). Код застосунку розповсюджується під [ліцензією MIT](https://uk.wikipedia.org/wiki/%D0%9B%D1%96%D1%86%D0%B5%D0%BD%D0%B7%D1%96%D1%8F_MIT), що означає, що інші розробники можуть змінювати зовнішній вигляд клієнта на власний розсуд, вносити свій вклад у його розвиток або створювати власні проєкти на його основі.

[**Github репозиторій UJournal Web →**](https://github.com/ujournal/web)

## UJournal API

UJournal API створено на основі PHP фреймворка [Laravel](https://laravel.com/), а в якості бази даних використовується [MySQL](https://www.mysql.com/). Автентифікація відбувається через [OAuth провайдер Google](https://developers.google.com/identity/protocols/oauth2). В якості CDN виступає [Cloudflare R2](https://developers.cloudflare.com/r2/).

UJournal API відповідальний за наступні функції:

- Створення стрічок
- Створення підписок
- Створення постів
- Створення, читання коментарів
- Створення, читання інформації про реакції

[**Список методів UJournal API →**](/docs/api-methods)
