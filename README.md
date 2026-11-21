# Учебный менеджер
Приложение для учёта заданий, курсов и дедлайнов.

Звягина Виктория Андреевна, группа 24ПИ1

## Основной сценарий
Приложение помогает студенту вести учебные дела в одном месте.  
Пользователь добавляет задания и курсы, указывает дедлайны, отмечает выполнение и находит просроченные записи.  
Позже появятся фильтры, личный аккаунт и серверная сводка.

## Стек
React + TypeScript + Vite + React Router + Supabase (supabase-js)

## Версия Node
22.21.0

## Настройка Supabase
1. В SQL Editor проекта Supabase выполните `supabase/migrations/202611210001_initial_schema.sql`, затем `supabase/seed.sql`.
2. Создайте `frontend/.env.local` по образцу `frontend/.env.example` со значениями из Dashboard (Connect / Settings → API Keys).

Переменные окружения (значения не хранятся в репозитории):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Во frontend допустим только publishable key. Secret key, service_role и пароль базы во frontend и Git не помещаются.

## Источник данных
- Справочник курсов (`courses`) читается из Supabase.
- Задания пока хранятся в состоянии App (демонстрационный набор из `frontend/src/data`);
  после перезагрузки страницы изменения сбрасываются. Перенос заданий в БД — ЛР 6.

## Схема данных
| Таблица | Назначение | Ключ | Связь | Доступ |
|---|---|---|---|---|
| `courses` | справочник курсов | `id text` (PK) | — | публичный, только чтение (anon, authenticated) |
| `assignments` | задания пользователя | `id uuid` (PK) | `course_id → courses.id`, `owner_id → auth.users.id` | личные; RLS включён, клиентских прав нет до ЛР 6 |

## Запуск
Из корня скачанного проекта:
```bash
cd frontend
npm ci
npm run dev
```

## Проверка сборки 
Остановите dev через Ctrl+C. Выполните в frontend: 
```bash 
npm run build 
npm run preview 
```