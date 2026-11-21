-- ЛР 5: схема «Учебного менеджера»
-- courses     — публичный справочник курсов (только чтение для клиентов)
-- assignments — личные задания пользователя (закрыты до ЛР 6)

create table public.courses (
  id text primary key,
  name text not null unique,
  constraint courses_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint courses_name_not_blank
    check (name = btrim(name) and name <> '')
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id)
    on update cascade on delete restrict,
  title text not null,
  description text not null default '',
  status text not null,
  due_date date not null,
  priority text not null,
  created_at timestamptz not null default now(),
  constraint assignments_title_length
    check (char_length(btrim(title)) between 3 and 100),
  constraint assignments_status_allowed
    check (status in ('todo', 'in_progress', 'done')),
  constraint assignments_priority_allowed
    check (priority in ('low', 'medium', 'high')),
  constraint assignments_done_has_description
    check (status <> 'done' or btrim(description) <> '')
);

-- RLS и минимальные права
alter table public.courses enable row level security;
alter table public.assignments enable row level security;

revoke all on table public.courses from anon, authenticated;
revoke all on table public.assignments from anon, authenticated;

grant select on table public.courses to anon, authenticated;

create policy "courses are publicly readable"
on public.courses
for select
to anon, authenticated
using (true);
