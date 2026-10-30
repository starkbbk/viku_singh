import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import sharp from 'sharp';
const photos = JSON.parse(await readFile('src/data/photos.json', 'utf8'));
const duplicates = JSON.parse(await readFile('src/data/photo-duplicates.json', 'utf8'));
const overrides = JSON.parse(await readFile('src/data/photo-overrides.json', 'utf8'));
assert(photos.length > 0, 'The gallery must contain photographs');
assert.equal(new Set(photos.map(p => p.id)).size, photos.length, 'Photo identifiers must be unique');
for (const photo of photos) {
  assert(photo.width > 0 && photo.height > 0, `Invalid dimensions: ${photo.original}`);
  assert(photo.category && photo.alt, `Missing photo information: ${photo.original}`);
  assert(photo.title?.trim(), `Missing visible caption: ${photo.original}`);
  const titleOverride = overrides[photo.original.replace(/^\/portfolio\//, '')]?.title;
  if (titleOverride) assert.equal(photo.title, titleOverride.trim(), `Caption lost during photo sync: ${photo.original}`);
  for (const key of ['src', 'thumbnail', 'original']) await access(path.join('public', photo[key]));
}
const imports = JSON.parse(await readFile('src/data/archive-import.json', 'utf8'));
assert.equal(new Set(imports.map(item => item.archive_filename)).size, imports.length, 'Each archive input must be tracked once');
for (const item of imports) {
  const photo = photos.find(photo => photo.original === (duplicates['/portfolio/' + item.photo_path] || '/portfolio/' + item.photo_path));
  assert(photo, `Missing imported photograph: ${item.archive_filename}`);
  assert.equal(photo.category, item.category, `Incorrect category: ${item.archive_filename}`);
  const thumbnail = await sharp(path.join('public', photo.thumbnail)).metadata();
  const full = await sharp(path.join('public', photo.src)).metadata();
  assert(thumbnail.width <= 800 && thumbnail.height <= 800, `Oversized thumbnail: ${item.archive_filename}`);
  assert(full.width <= 1920 && full.height <= 1920, `Oversized viewer photo: ${item.archive_filename}`);
  assert.equal(full.format, 'webp');
}
for (let index=0;index<4;index++) assert(photos.some(photo=>photo.featured===index), `Missing chapter photo ${index+1}`);
console.log(`Verified ${photos.length} photographs, ${photos.length*3} image paths all four chapter images and all ${imports.length} archive imports.`);

const latest = JSON.parse(await readFile('src/data/latest-import.json', 'utf8'));
const currentUpload = JSON.parse(await readFile('src/data/latest-upload.json', 'utf8'));
const currentPaths = new Set(currentUpload.photoPaths.map(file => `/portfolio/${file}`));
assert.equal(currentPaths.size, currentUpload.photoPaths.length, 'Latest upload paths must be unique');
assert.equal(new Set(latest.map(item => item.photo_path)).size, latest.length);
assert.deepEqual(photos.filter(photo => photo.recent).map(photo => photo.original), [...currentPaths], 'Only the current upload gets NEW, in upload order');
assert.deepEqual(photos.slice(0, currentPaths.size).map(photo => photo.original), [...currentPaths], 'The current upload must lead the gallery');
for (const photo of photos) assert.equal(photo.recent, currentPaths.has(photo.original), `Stale NEW badge: ${photo.original}`);
for (const file of currentUpload.photoPaths) assert(latest.some(item => item.photo_path === file), `Untracked upload: ${file}`);
for (const item of latest) {
  const photo = photos.find(photo => photo.original === (duplicates['/portfolio/' + item.photo_path] || '/portfolio/' + item.photo_path));
  assert(photo, `Missing latest photograph: ${item.filename}`);
  assert.equal(photo.category, item.category);
  assert(!photo.title.includes(' / '), `Missing descriptive caption: ${item.filename}`);
  const thumbnail = await sharp(path.join('public', photo.thumbnail)).metadata();
  const full = await sharp(path.join('public', photo.src)).metadata();
  assert(thumbnail.width <= 800 && thumbnail.height <= 800);
  assert(full.width <= 1920 && full.height <= 1920);
}
console.log(`Verified all ${latest.length} tracked uploads with captions and optimized images; only the latest ${currentPaths.size} carry NEW.`);
