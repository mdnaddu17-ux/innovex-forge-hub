const postgres = require("postgres");

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL not set");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require" });

async function fix() {
  console.log("Starting RLS fix...");

  // 1. Drop all tables (CASCADE removes policies too)
  await sql.unsafe(`
    DROP TABLE IF EXISTS projects CASCADE;
    DROP TABLE IF EXISTS goals CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);
  console.log("1/5 Dropped old tables.");

  // 2. Create tables
  await sql.unsafe(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id text UNIQUE NOT NULL,
      password text NOT NULL,
      name text,
      college text,
      role text CHECK(role IN ('admin','member')) NOT NULL DEFAULT 'member',
      created_at timestamptz DEFAULT now()
    );

    CREATE TABLE projects (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title text NOT NULL,
      description text NOT NULL,
      image_url text NOT NULL DEFAULT '',
      components text DEFAULT '',
      source_code text NOT NULL DEFAULT '',
      video_link text DEFAULT '',
      created_at timestamptz DEFAULT now()
    );

    CREATE TABLE goals (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      text text NOT NULL,
      image_url text NOT NULL DEFAULT '',
      created_at timestamptz DEFAULT now()
    );
  `);
  console.log("2/5 Created tables.");

  // 3. Seed admin
  await sql.unsafe(`
    INSERT INTO users(user_id, password, name, college, role)
    VALUES('MDNADEEM', 'Nadeem@Innovex#2026!', 'MD Nadeem', 'Innovex Hub', 'admin')
    ON CONFLICT (user_id) DO NOTHING;
  `);
  console.log("3/5 Seeded admin user.");

  // 4. Enable RLS and grant usage to anon + authenticated
  await sql.unsafe(`
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

    GRANT USAGE ON SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
  `);
  console.log("4/5 Enabled RLS & granted permissions.");

  // 5. Create RLS policies for anon + authenticated
  await sql.unsafe(`
    -- USERS: select + insert
    CREATE POLICY "anon_select_users" ON users FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "anon_insert_users" ON users FOR INSERT TO anon, authenticated WITH CHECK (true);
    CREATE POLICY "anon_update_users" ON users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

    -- PROJECTS: select + insert + delete
    CREATE POLICY "anon_select_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "anon_insert_projects" ON projects FOR INSERT TO anon, authenticated WITH CHECK (true);
    CREATE POLICY "anon_delete_projects" ON projects FOR DELETE TO anon, authenticated USING (true);
    CREATE POLICY "anon_update_projects" ON projects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

    -- GOALS: select + insert + delete
    CREATE POLICY "anon_select_goals" ON goals FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "anon_insert_goals" ON goals FOR INSERT TO anon, authenticated WITH CHECK (true);
    CREATE POLICY "anon_delete_goals" ON goals FOR DELETE TO anon, authenticated USING (true);
    CREATE POLICY "anon_update_goals" ON goals FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
  `);
  console.log("5/5 Created RLS policies.");

  // 6. Storage policies for uploads bucket
  try {
    await sql.unsafe(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ('uploads', 'uploads', true, 5242880, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
      ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg','image/png','image/gif','image/webp'];
    `);
    console.log("Ensured 'uploads' bucket exists.");

    // Drop existing storage policies if any
    await sql.unsafe(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_upload_objects' AND tablename = 'objects' AND schemaname = 'storage') THEN
          DROP POLICY "anon_upload_objects" ON storage.objects;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_select_objects' AND tablename = 'objects' AND schemaname = 'storage') THEN
          DROP POLICY "anon_select_objects" ON storage.objects;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_delete_objects' AND tablename = 'objects' AND schemaname = 'storage') THEN
          DROP POLICY "anon_delete_objects" ON storage.objects;
        END IF;
      END $$;
    `);

    await sql.unsafe(`
      CREATE POLICY "anon_upload_objects" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'uploads');
      CREATE POLICY "anon_select_objects" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'uploads');
      CREATE POLICY "anon_delete_objects" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'uploads');
    `);
    console.log("Created storage RLS policies for uploads bucket.");
  } catch (err) {
    console.warn("Storage policy setup warning (may already exist):", err.message);
  }

  console.log("All done!");
  await sql.end();
}

fix().catch((err) => {
  console.error("Fix failed:", err);
  process.exit(1);
});
