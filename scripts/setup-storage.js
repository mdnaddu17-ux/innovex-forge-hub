const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log("Setting up storage bucket...");

  // Create the bucket (public so images are accessible via URL)
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket("project-images", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  });

  if (bucketError) {
    if (bucketError.message.includes("already exists")) {
      console.log("Bucket 'project-images' already exists, updating...");
      const { error: updateError } = await supabase.storage.updateBucket("project-images", {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      });
      if (updateError) {
        console.error("Failed to update bucket:", updateError.message);
      } else {
        console.log("Bucket updated successfully.");
      }
    } else {
      console.error("Failed to create bucket:", bucketError.message);
      process.exit(1);
    }
  } else {
    console.log("Bucket 'project-images' created:", bucket);
  }

  console.log("Storage setup complete!");
}

setupStorage().catch((err) => {
  console.error("Storage setup failed:", err);
  process.exit(1);
});
