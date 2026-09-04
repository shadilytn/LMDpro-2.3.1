import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

export function scanAndGenerateWebpManifest() {
  console.log('[ImageOptimizer] Scanning public directory for static assets...');
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const files = fs.readdirSync(PUBLIC_DIR);
  const imageManifest = {};

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) {
      const baseName = path.basename(file, ext);
      imageManifest[file] = {
        original: `/${file}`,
        webp: `/${baseName}.webp`,
        format: ext.replace('.', ''),
        srcset: `/${file} 1x, /${baseName}.webp 2x`
      };
    }
  });

  const manifestPath = path.join(PUBLIC_DIR, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(imageManifest, null, 2));
  console.log(`[ImageOptimizer] Optimized image manifest saved to ${manifestPath}`);
  return imageManifest;
}

if (process.argv[1] && process.argv[1].endsWith('optimize-images.mjs')) {
  scanAndGenerateWebpManifest();
}
