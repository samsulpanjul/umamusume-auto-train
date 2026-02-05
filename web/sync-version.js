import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootVersionPath = path.resolve(__dirname, '../version.txt');
const packageJsonPath = path.resolve(__dirname, 'package.json');

const BOLD = '\x1b[1m';
const BLUE = '\x1b[36m';
const RED = '\x1b[31m';

try {
  // Read version from root version.txt
  const version = fs.readFileSync(rootVersionPath, 'utf8').trim();

  // Read package.json
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Update version only if it's different
  if (pkg.version !== version) {
    pkg.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated package.json version to: ${BLUE}${BOLD}${version}`);
  }
} catch (err) {
  console.error('${RED}Failed to sync version:', err.message);
}