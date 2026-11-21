-- ЛР 6: личные задания доступны только их владельцу
-- Справочник courses сохраняет публичный SELECT из ЛР 5.

alter table public.assignments
  alter column owner_id set default auth.uid();

revoke all on table public.assignments from anon, authenticated;
grant select, insert, update, delete
  on table public.assignments to authenticated;

create policy "assignments select own"
on public.assignments for select to authenticated
using ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);

create policy "assignments insert own"
on public.assignments for insert to authenticated
with check ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);

create policy "assignments update own"
on public.assignments for update to authenticated
using ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id)
with check ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);

create policy "assignments delete own"
on public.assignments for delete to authenticated
using ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);
