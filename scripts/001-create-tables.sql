-- Enable uuid extension
create extension if not exists "uuid-ossp";

-- USERS table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  user_id text unique not null,
  password text not null,
  name text,
  college text,
  role text check (role in ('admin', 'member'))
);

-- PROJECTS table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  image_url text,
  components text,
  source_code text,
  uploaded_by uuid references users(id),
  created_at timestamp default now()
);

-- GOALS table
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  text text,
  image_url text,
  created_at timestamp default now()
);
