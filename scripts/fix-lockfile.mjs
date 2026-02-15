import { execSync } from 'child_process';

try {
  console.log('Generating fresh package-lock.json...');
  execSync('npm install --package-lock-only', {
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit'
  });
  console.log('package-lock.json generated successfully.');
} catch (error) {
  console.error('Error generating lock file:', error.message);
  process.exit(1);
}
