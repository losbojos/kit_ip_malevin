create table work_log (
  id uuid primary key default gen_random_uuid(),
  work_date date not null,
  activity text not null,
  volume numeric not null check (volume > 0),
  unit text not null,
  executor text not null
);

create index work_log_date_idx on work_log (work_date desc);

-- Справочник видов работ (в журнале хранится текст, не ссылка на справочник)
create table work_activity_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

insert into work_activity_catalog (name) values
  ('Кладка плитки'),
  ('Монтаж опалубки'),
  ('Бетонирование'),
  ('Покраска стен'),
  ('Монтаж электропроводки'),
  ('Поклейка обоев');
