# Журнал работ

Веб-приложение для учёта выполненных работ на строительном объекте: добавление записей, просмотр списка, фильтрация по дате, удаление.

## Стек

- React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS
- Supabase (PostgreSQL)
- API — Route Handlers (`app/api/entries`)

### Почему такой стек

- **Next.js** — фронтенд и API в одном проекте (и сервере), простой деплой на Vercel.
- **Supabase (PostgreSQL)** — управляемая БД без поднятия своего сервера БД; для журнала с одной таблицей и простыми запросами хватает с запасом.
- **Tailwind CSS** — быстрая вёрстка без отдельных CSS-файлов, достаточно для тестового.

## Возможности

- Просмотр записей с сортировкой по дате (сначала новые / старые)
- Фильтр по диапазону дат
- Добавление записи: дата, вид работ, объём, единица, исполнитель
- Удаление записи

## Требования

- Node.js 20+
- Аккаунт в [Supabase](https://supabase.com)
- Git

## Запуск локально

1. Клонировать репозиторий и перейти в папку проекта:
   ```bash
   git clone https://github.com/losbojos/kit_ip_malevin
   или
   git clone git@github.com:losbojos/kit_ip_malevin.git
   cd <папка-проекта>
   ```
2. Установить зависимости:
   ```bash
   npm install
   ```
3. Создать проект в [Supabase](https://supabase.com).
4. В Supabase открыть **SQL Editor**, вставить и выполнить скрипт из [`database/create.sql`](./database/create.sql) (таблица `work_log`).
5. В Supabase через меню **Integrations => Data API** включить **Enable Data API**.
6. Скопировать `.env.example` в `.env.local` и заполнить переменные:

```env
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```
SUPABASE_URL - это адрес вашего проекта БД в Supabase

Ключ `service_role` берётся в Supabase: Settings => API Keys => Secret keys. 
Не публикуйте его в клиентском коде и не коммитьте в репозиторий.

   Не коммитьте `.env.local` — в нём секретный ключ с полным доступом к БД.

7. Запустить dev-сервер:
   ```bash
   npm run dev
   ```
   
8. Открыть в браузере [http://localhost:3000](http://localhost:3000).

### Production-режим локально

```bash
npm run build
npm start
```

## API

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/entries` | Список записей. Query: `dateFrom`, `dateTo`, `sort` (`asc` / `desc`) |
| `POST` | `/api/entries` | Создание записи (JSON body) |
| `DELETE` | `/api/entries/:id` | Удаление записи по `id` |

## Демо

Готовое приложение: **https://kit-ip-malevin.vercel.app/** - Просто откройте ссылку в браузере.
