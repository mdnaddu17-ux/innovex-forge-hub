-- Drop all policies first to avoid conflicts
drop policy if exists "Public read users" on users;
drop policy if exists "Public insert users" on users;
drop policy if exists "Public read projects" on projects;
drop policy if exists "Public insert projects" on projects;
drop policy if exists "Public delete projects" on projects;
drop policy if exists "Public read goals" on goals;
drop policy if exists "Public insert goals" on goals;
drop policy if exists "Public delete goals" on goals;
drop policy if exists "Allow public read" on users;
drop policy if exists "Allow public insert" on users;
drop policy if exists "Allow public read" on projects;
drop policy if exists "Allow public insert" on projects;
drop policy if exists "Allow public delete" on projects;
drop policy if exists "Allow public read" on goals;
drop policy if exists "Allow public insert" on goals;
drop policy if exists "Allow public delete" on goals;

-- Drop tables
drop table if exists projects cascade;
drop table if exists goals cascade;
drop table if exists users cascade;
