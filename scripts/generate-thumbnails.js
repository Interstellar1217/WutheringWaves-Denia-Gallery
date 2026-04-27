// 缩略图批量生成脚本
// 使用方法：node scripts/generate-thumbnails.js
// 首次运行前需要安装 sharp: npm install sharp

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fullDir = path.join(__dirname, '../public/images/full');
const thumbsDir = path.join(__dirname, '../public/images/thumbs');

// 确保缩略图目录存在
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
  console.log('Created thumbs directory');
}

// 支持的文件扩展名
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

async function generateThumbnails() {
  // 获取原图文件列表
  const files = fs.readdirSync(fullDir);
  const imageFiles = files.filter(file =>
    supportedExtensions.some(ext => file.toLowerCase().endsWith(ext))
  );

  if (imageFiles.length === 0) {
    console.log('No images found in full directory');
    return;
  }

  console.log(`Found ${imageFiles.length} images to process\n`);

  // 构建原图名称集合（用于清理孤儿缩略图）
  const originalNames = new Set(imageFiles.map(file => path.parse(file).name));

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // 生成缩略图
  for (const file of imageFiles) {
    const name = path.parse(file).name;
    const thumbFile = `${name}_thumb.webp`;
    const thumbPath = path.join(thumbsDir, thumbFile);

    // 检查是否已存在缩略图
    if (fs.existsSync(thumbPath)) {
      console.log(`[SKIP] ${file} (thumbnail exists)`);
      skipCount++;
      continue;
    }

    try {
      const inputPath = path.join(fullDir, file);

      await sharp(inputPath)
        .resize(400, null, {
          withoutEnlargement: true,
          kernel: 'lanczos3'
        })
        .webp({
          quality: 80,
          effort: 4
        })
        .toFile(thumbPath);

      console.log(`[OK] ${file} -> ${thumbFile}`);
      successCount++;
    } catch (err) {
      console.error(`[ERROR] ${file}: ${err.message}`);
      errorCount++;
    }
  }

  // 清理孤儿缩略图（原图已删除但缩略图还在）
  console.log('\n--- Cleaning up orphaned thumbnails ---');
  const thumbFiles = fs.readdirSync(thumbsDir);
  let deletedCount = 0;

  for (const thumbFile of thumbFiles) {
    if (!thumbFile.endsWith('_thumb.webp')) continue;

    const originalName = thumbFile.replace('_thumb.webp', '');
    if (!originalNames.has(originalName)) {
      const thumbPath = path.join(thumbsDir, thumbFile);
      fs.unlinkSync(thumbPath);
      console.log(`[DELETE] ${thumbFile} (original image not found)`);
      deletedCount++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Generated: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Deleted orphans: ${deletedCount}`);
}

generateThumbnails().catch(console.error);
