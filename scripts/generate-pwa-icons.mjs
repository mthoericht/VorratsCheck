/**
 * Generates PWA PNG icons (192x192, 512x512) from public/favicon.svg.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

const sizes = [192, 512];

async function main() {
  if (!fs.existsSync(svgPath)) {
    console.error('Source not found:', svgPath);
    process.exit(1);
  }
  const buffer = fs.readFileSync(svgPath);
  for (const size of sizes) {
    const outPath = path.join(publicDir, `pwa-${size}x${size}.png`);
    await sharp(buffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log('Written', outPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
