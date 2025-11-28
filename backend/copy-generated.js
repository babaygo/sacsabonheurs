import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, 'src', 'generated');
const dest = path.resolve(__dirname, 'dist', 'generated');

console.log(`Copying from ${src} to ${dest}`);

// Check if source exists
if (!fs.existsSync(src)) {
  console.error(`Source directory does not exist: ${src}`);
  process.exit(1);
}

// Create dist/generated if it doesn't exist
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Copy recursively
function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyDir(src, dest);
console.log('Generated files copied successfully');

