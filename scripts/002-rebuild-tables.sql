-- =============================================
-- FULL REBUILD: drop old tables and recreate
-- =============================================

create extension if not exists "uuid-ossp";

drop table if exists projects cascade;
drop table if exists goals cascade;
drop table if exists users cascade;

-- USERS table
create table users (
  id uuid primary key default uuid_generate_v4(),
  user_id text unique not null,
  password text not null,
  name text,
  college text,
  role text check(role in ('admin','member')) not null,
  created_at timestamp default now()
);

-- PROJECTS table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  image_url text not null,
  components text,
  source_code text not null,
  video_link text,
  created_at timestamp default now()
);

-- GOALS table
create table goals (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  image_url text not null,
  created_at timestamp default now()
);

-- Seed admin user
insert into users(user_id, password, name, college, role)
values(
  'MDNADEEM',
  'Nadeem@Innovex#2026!',
  'MD Nadeem',
  'Innovex Hub',
  'admin'
);

-- Enable RLS
alter table users enable row level security;
alter table projects enable row level security;
alter table goals enable row level security;

-- Users policies
create policy "Public read users" on users for select using (true);
create policy "Public insert users" on users for insert with check (true);

-- Projects policies
create policy "Public read projects" on projects for select using (true);
create policy "Public insert projects" on projects for insert with check (true);
create policy "Public delete projects" on projects for delete using (true);

-- Goals policies
create policy "Public read goals" on goals for select using (true);
create policy "Public insert goals" on goals for insert with check (true);
create policy "Public delete goals" on goals for delete using (true);
