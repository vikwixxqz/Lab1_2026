-- ЛР 5: публичный справочник курсов (те же id, что в JSON ЛР 4)
insert into public.courses (id, name)
values
  ('web-dev', 'Веб-разработка'),
  ('algorithms', 'Алгоритмы'),
  ('math', 'Математика'),
  ('history', 'История'),
  ('english', 'Английский')
on conflict (id) do update
set name = excluded.name;
