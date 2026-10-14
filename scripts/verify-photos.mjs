import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import sharp from 'sharp';
const photos = JSON.parse(await readFile('src/data/photos.json', 'utf8'));
assert(photos.length > 0, 'The gallery must contain photographs');
assert.equal(new Set(photos.map(p => p.id)).size, photos.length, 'Photo identifiers must be unique');
for (const photo of photos) {
  assert(photo.width > 0 && photo.height > 0, `Invalid dimensions: ${photo.original}`);
  assert(photo.category && photo.alt, `Missing photo information: ${photo.original}`);
  for (const key of ['src', 'thumbnail', 'original']) await access(path.join('public', photo[key]));
}
const imports = JSON.parse(await readFile('src/data/archive-import.json', 'utf8'));
assert.equal(new Set(imports.map(item => item.archive_filename)).size, imports.length, 'Each archive input must be tracked once');
for (const item of imports) {
  const photo = photos.find(photo => photo.original === '/portfolio/' + item.photo_path);
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
assert.equal(photos.filter(photo => photo.recent).length, latest.length, 'All recent photos must be tracked');
assert.equal(new Set(latest.map(item => item.filename)).size, latest.length);
for (const item of latest) {
  const photo = photos.find(photo => photo.original === '/portfolio/' + item.photo_path);
  assert(photo, `Missing latest photograph: ${item.filename}`);
  assert.equal(photo.category, item.category);
  assert.equal(photo.recent, true);
  assert(!photo.title.includes(' / '), `Missing descriptive caption: ${item.filename}`);
  const thumbnail = await sharp(path.join('public', photo.thumbnail)).metadata();
  const full = await sharp(path.join('public', photo.src)).metadata();
  assert(thumbnail.width <= 800 && thumbnail.height <= 800);
  assert(full.width <= 1920 && full.height <= 1920);
}
console.log(`Verified all ${latest.length} latest photos with captions and optimized images.`);
