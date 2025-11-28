import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, 'src', 'generated');
const dest = path.join(__dirname, 'dist', 'generated');

// Create dist/generated if it doesn't exist
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Copy recursively
function copyDir(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile);
      }
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyDir(src, dest);
console.log('Generated files copied successfully');
