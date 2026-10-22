import fs from 'fs';
import path from 'path';
import { Product } from '../src/types.ts';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Ensures the uploads directory exists on disk.
 */
export function ensureUploadsDir(): void {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create upload directory:', err);
  }
}

/**
 * Saves a base64 Data URI image string to a permanent file on disk inside public/uploads.
 * Returns the web-accessible URL path: `/uploads/filename.ext`.
 * If the input is already a URL or not a base64 string, returns it untouched.
 */
export async function saveBase64Image(dataUriOrUrl: string, prefix = 'product'): Promise<string> {
  if (!dataUriOrUrl || typeof dataUriOrUrl !== 'string') {
    return dataUriOrUrl;
  }

  const trimmed = dataUriOrUrl.trim();

  // Already a clean web URL or static path
  if (!trimmed.startsWith('data:') && (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/'))) {
    return trimmed;
  }

  // Check if it is a base64 data URI
  const isDataUri = trimmed.startsWith('data:');
  const base64Index = trimmed.indexOf(';base64,');

  if (!isDataUri || base64Index === -1) {
    return trimmed;
  }

  try {
    ensureUploadsDir();

    const header = trimmed.substring(5, base64Index); // e.g. "image/png" or "image/jpeg;charset=utf-8"
    const rawBase64 = trimmed.substring(base64Index + 8).replace(/\s/g, '');

    let ext = 'jpg';
    if (header.includes('png')) ext = 'png';
    else if (header.includes('webp')) ext = 'webp';
    else if (header.includes('gif')) ext = 'gif';
    else if (header.includes('svg')) ext = 'svg';
    else if (header.includes('avif')) ext = 'avif';

    const buffer = Buffer.from(rawBase64, 'base64');
    if (buffer.length === 0) {
      console.warn('[Storage] Empty buffer decoded from base64 string');
      return trimmed;
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
    const filename = `${cleanPrefix}_${timestamp}_${randomSuffix}.${ext}`;
    const targetFilePath = path.join(UPLOAD_DIR, filename);

    await fs.promises.writeFile(targetFilePath, buffer);
    console.log(`[Storage] Permanently saved product image to disk: /uploads/${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 image to disk:', err);
    return trimmed;
  }
}

/**
 * Sanitizes an array of product image URLs, saving any base64 data to files.
 */
export async function sanitizeProductImageUrls(
  images: string[] = [],
  prefix = 'gallery'
): Promise<string[]> {
  if (!Array.isArray(images)) return [];
  const results: string[] = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (img && typeof img === 'string') {
      const saved = await saveBase64Image(img, `${prefix}_slot${i + 1}`);
      results.push(saved);
    }
  }
  return results;
}

/**
 * Sanitizes all image fields on a product object:
 * - Saves base64 primary image to /uploads/
 * - Saves base64 secondary image to /uploads/
 * - Saves base64 gallery images to /uploads/
 */
export async function sanitizeProduct<T extends Partial<Product>>(product: T): Promise<T> {
  const sanitized = { ...product };

  if (sanitized.image && typeof sanitized.image === 'string') {
    sanitized.image = await saveBase64Image(sanitized.image, `${sanitized.name || 'product'}_hero`);
  }

  if (sanitized.secondaryImage && typeof sanitized.secondaryImage === 'string') {
    sanitized.secondaryImage = await saveBase64Image(sanitized.secondaryImage, `${sanitized.name || 'product'}_sec`);
  }

  if (Array.isArray(sanitized.images) && sanitized.images.length > 0) {
    sanitized.images = await sanitizeProductImageUrls(sanitized.images, `${sanitized.name || 'product'}_gal`);
  } else if (sanitized.image) {
    sanitized.images = [sanitized.image, ...(sanitized.secondaryImage ? [sanitized.secondaryImage] : [])].filter(Boolean) as string[];
  }

  return sanitized;
}
