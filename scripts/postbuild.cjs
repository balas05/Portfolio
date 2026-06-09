const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const src = path.join(dist, 'index.html');
const destDir = path.join(dist, 'admin');
const dest = path.join(destDir, 'index.html');

if (!fs.existsSync(dist)) {
  console.error('dist not found. Run npm run build first.');
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Copied index.html to dist/admin/index.html');
