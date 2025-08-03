import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Image File Check');
console.log('==================');

// Check if images exist in public folder
const publicImagesPath = path.join(__dirname, 'public', 'assets', 'images');
const distImagesPath = path.join(__dirname, 'dist', 'assets', 'images');

console.log('\n📁 Public Images:');
if (fs.existsSync(publicImagesPath)) {
  const files = fs.readdirSync(publicImagesPath);
  files.forEach(file => {
    const filePath = path.join(publicImagesPath, file);
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
} else {
  console.log('  ❌ Directory not found');
}

console.log('\n📁 Dist Images:');
if (fs.existsSync(distImagesPath)) {
  const files = fs.readdirSync(distImagesPath);
  files.forEach(file => {
    const filePath = path.join(distImagesPath, file);
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
} else {
  console.log('  ❌ Directory not found - Run npm run build first');
}

console.log('\n🔗 Expected URLs:');
console.log('  /assets/images/image.png');
console.log('  /assets/images/UPI-QR.jpeg');

console.log('\n📋 Next Steps:');
console.log('  1. Deploy to Vercel');
console.log('  2. Visit /image-test route');
console.log('  3. Check browser console for debug logs');
console.log('  4. Try accessing image URLs directly'); 