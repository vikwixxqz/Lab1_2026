# Учебный менеджер
Приложение для учёта заданий, курсов и дедлайнов.

Звягина Виктория Андреевна, группа 24ПИ1

## Основной сценарий
Приложение помогает студенту вести учебные дела в одном месте.  
Пользователь добавляет задания и курсы, указывает дедлайны, отмечает выполнение и находит просроченные записи.  
Позже появятся фильтры, личный аккаунт и серверная сводка.

## Стек
React + TypeScript + Vite + React Router + Supabase (supabase-js, Auth)

## Версия Node
22.21.0

## Настройка Supabase
1. В SQL Editor проекта Supabase выполните по порядку:
   `supabase/migrations/202611210001_initial_schema.sql`, `supabase/seed.sql`,
   `supabase/migrations/202611210002_assignments_owner_policies.sql`.
2. Создайте `frontend/.env.local` по образцу `frontend/.env.example` со значениями из Dashboard (Connect / Settings → API Keys).

Переменные окружения (значения не хранятся в репозитории):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Во frontend допустим только publishable key. 

## Источник данных
- Справочник курсов (`courses`) читается из Supabase без входа.
- Задания (`assignments`) хранятся в Supabase и привязаны к аккаунту (`owner_id`).
  Они сохраняются после перезагрузки и повторного входа. Демонстрационные записи ЛР 2 больше не используются.

## Авторизация (ЛР 6)
- Вход и регистрация по email и паролю — страница `/auth`.
- Пароль при регистрации: не меньше 8 символов, буквы и цифры.
- Если в проекте включено подтверждение email, после регистрации нужно перейти по ссылке из письма, затем войти.
- В Supabase Dashboard → Authentication → URL Configuration адрес Vite (`http://localhost:5173`)
  должен быть в Site URL или Redirect URLs.

### Маршруты
| Маршрут | Доступ |
|---|---|
| `/` | публичный |
| `/auth` | публичный (вошедшего перенаправляет к списку) |
| `/assignments`, `/assignments/new`, `/assignments/:id`, `/assignments/:id/edit` | только после входа (RequireAuth) |

### Модель доступа
- `courses` читают все (anon и authenticated), изменять не может никто из клиентов.
- `assignments` читает, создаёт, изменяет и удаляет только владелец: четыре политики RLS
  с условием `auth.uid() = owner_id`. anon прав на таблицу не имеет.

## Схема данных
| Таблица | Назначение | Ключ | Связь | Доступ |
|---|---|---|---|---|
| `courses` | справочник курсов | `id text` (PK) | — | публичный, только чтение (anon, authenticated) |
| `assignments` | задания пользователя | `id uuid` (PK) | `course_id → courses.id`, `owner_id → auth.users.id` (по умолчанию `auth.uid()`) | личные; только владелец (4 политики RLS) |

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