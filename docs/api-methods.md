---
title: Список методів API
back_url: /dev/
---

## Автентифікація за допомогою OAuth провайдера

Для того щоб мати змогу ідентифікувати користувача сайту існує вхід за допомогою OAuth провайдера.

Автентифікація складається з кроків:

1. Перехід з UJournal API до сторінки OAuth провайдера для підтвердження входу
2. Перехід від OAuth провайдера до UJournal API, створення профіля та генерація JWT токена

### Перехід з UJournal API до сторінки OAuth провайдера

Запит, який переадресує на сторінку авторизації в OAuth провайдері:

```
GET https://api.ujournal.com.ua/auth
```

### Перехід від OAuth провайдера до UJournal API

Після того як користувач надав доступ до своєї інформації в OAuth провайдері, користувача буде направлено на сторінку авторизації з кодом доступу:

```
GET https://api.ujournal.com.ua/auth?code={OAUTH_CODE}
```

З кодом `{OAUTH_CODE}` UJournal API отримує доступ до інформації в OAuth провайдері, зокрема до `name`, `email`. Отримавши цю інформацію, на стороні UJournal API створється профіль користувача (якщо його ще не існує). Для цього профілю генерується токен `{ACCESS_TOKEN}`, який передається на фронтенд для подальшого підписання запитів.

Дані, які передаються на фронтенд:

```json
{
    "date": 1727964247120,
    "data": {
        "access_token": "{ACCESS_TOKEN}",
        "token_type": "bearer",
        "expires_in": 3600
    }
}
```

## Автентифікація за допомогою API ключа

Для того щоб використовувати UJournal API у сторонніх сервісах існує вхід за допомогою API-ключа.

Щоб отримати API-ключ, потрібно зробити запит з використанням токена, який отримано після того як відбулася [Автентифікація за допомогою OAuth провайдера](#автентифікація-за-допомогою-oauth-провайдера).

Щоб отримати API-ключ `{API_KEY}` потрібно виконати запит:

```
POST https://ujournal.com.ua/auth
Authorization: Bearer {ACCESS_TOKEN}
```

Відповідь:

```
{
  "api_key": "{API_KEY}"
}
```

API-ключ генерується один раз і не змінюється. API-ключ не призначено для публічного розповсюдження.

## Користувач

## Стрічка

### Підписка на стрічку

## Пост

### Створення посту

## Коментар

### Створення коментаря

### Отримання коментарів

## Реакція

### Створення реакції

### Отримання реакцій

### Отримання інформації про кількість реакцій
