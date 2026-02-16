-- Enable uuid extension
create extension if not exists "uuid-ossp";

-- USERS table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  user_id text unique not null,
  password text not null,
  name text,
  college text,
  role text check (role in ('admin', 'member')) not null
);

-- PROJECTS table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  image_url text not null,
  components text,
  source_code text,
  video text,
  uploaded_by uuid,
  created_at timestamp default now()
);

-- GOALS table
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  image_url text,
  created_at timestamp default now()
);
