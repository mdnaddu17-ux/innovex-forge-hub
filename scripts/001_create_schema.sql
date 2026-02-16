-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create users table
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  college text,
  role text NOT NULL CHECK (role IN ('member','admin')),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_role ON users(role);

-- Step 3: Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  video_link text,
  components text,
  source_code text,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  CONSTRAINT image_url_https CHECK (image_url ~* '^https://')
);

CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_uploaded_by ON projects(uploaded_by);

-- Step 4: Create goals table
CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  text text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  CONSTRAINT goals_image_url_https CHECK (image_url ~* '^https://')
);

CREATE INDEX idx_goals_created_at ON goals(created_at DESC);

-- Step 5: Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Step 6: RLS policies
-- Public read for projects and goals
CREATE POLICY public_read_projects ON projects FOR SELECT USING (true);
CREATE POLICY public_read_goals ON goals FOR SELECT USING (true);

-- Admin full control (using service role key bypasses RLS, but we add these for completeness)
CREATE POLICY admin_full_users ON users FOR ALL USING (true);
CREATE POLICY admin_full_projects ON projects FOR ALL USING (true);
CREATE POLICY admin_full_goals ON goals FOR ALL USING (true);

-- Step 7: Seed admin user
INSERT INTO users (name, college, user_id, password, role)
VALUES (
  'MD Nadeem',
  'InnoveX Hub',
  'MDNADEEM',
  'Mdn@d33m!XHub#2026$Secure',
  'admin'
);
