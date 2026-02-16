const postgres = require("postgres");

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL not set");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require" });

async function migrate() {
  console.log("Starting migration...");

  // Drop tables (CASCADE removes associated policies automatically)
  await sql.unsafe(`
    DROP TABLE IF EXISTS projects CASCADE;
    DROP TABLE IF EXISTS goals CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);
  console.log("Dropped old tables.");

  // Create tables
  await sql.unsafe(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id text UNIQUE NOT NULL,
      password text NOT NULL,
      name text,
      college text,
      role text CHECK(role IN ('admin','member')) NOT NULL DEFAULT 'member',
      created_at timestamp DEFAULT now()
    );

    CREATE TABLE projects (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title text NOT NULL,
      description text NOT NULL,
      image_url text NOT NULL DEFAULT '',
      components text DEFAULT '',
      source_code text NOT NULL DEFAULT '',
      video_link text DEFAULT '',
      created_at timestamp DEFAULT now()
    );

    CREATE TABLE goals (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      text text NOT NULL,
      image_url text NOT NULL DEFAULT '',
      created_at timestamp DEFAULT now()
    );
  `);
  console.log("Created tables.");

  // Seed admin
  await sql`
    INSERT INTO users(user_id, password, name, college, role)
    VALUES('MDNADEEM', 'Nadeem@Innovex#2026!', 'MD Nadeem', 'Innovex Hub', 'admin')
    ON CONFLICT (user_id) DO NOTHING
  `;
  console.log("Seeded admin user.");

  // Enable RLS + policies
  await sql.unsafe(`
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
    CREATE POLICY "Public insert users" ON users FOR INSERT WITH CHECK (true);

    CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
    CREATE POLICY "Public insert projects" ON projects FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public delete projects" ON projects FOR DELETE USING (true);

    CREATE POLICY "Public read goals" ON goals FOR SELECT USING (true);
    CREATE POLICY "Public insert goals" ON goals FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public delete goals" ON goals FOR DELETE USING (true);
  `);
  console.log("Enabled RLS and created policies.");

  console.log("Migration complete!");
  await sql.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
