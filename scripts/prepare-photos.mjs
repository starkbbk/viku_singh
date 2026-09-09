import { readdir, mkdir, readFile, writeFile, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const publicRoot = path.join(root, 'public/portfolio');
const supported = /\.(jpe?g|png|webp|avif|tiff?)$/i;
async function walk(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return (await Promise.all(entries.map(entry => entry.isDirectory()
      ? walk(path.join(dir, entry.name))
      : supported.test(entry.name) ? [path.join(dir, entry.name)] : []))).flat().sort();
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}
// Pictures is also accepted as an inbox, so a new photo ZIP can be added by category.
for (const source of await walk(path.join(root, 'Pictures'))) {
  const destination = path.join(publicRoot, path.relative(path.join(root, 'Pictures'), source));
  try { await access(destination); }
  catch { await mkdir(path.dirname(destination), { recursive: true }); await copyFile(source, destination); }
}
const files = await walk(publicRoot);
const overrides = JSON.parse(await readFile(path.join(root, 'src/data/photo-overrides.json'), 'utf8'));
const hashes = new Set();
const photos = [];
const counts = {};
const featured = [
  'e6c4d66f-29ff-49e7-809b-4e969c02cfe5',
  '04bf13aa-b728-45f2-80e2-35e384a6366c',
  'a6d35c02-a9af-4001-b233-2fcbfcc4405a',
  '03124d5c-609f-44ca-ab19-cef83cdc2a2a',
  '42a34cc4-99db-4bec-89c3-5bd56c0c29cb',
  '026c30df-6c91-4920-b34f-5ebf47e39607',
];
const descriptions = {
  'e6c4d66f-29ff-49e7-809b-4e969c02cfe5': 'A performer facing the crowd with arms raised',
  '04bf13aa-b728-45f2-80e2-35e384a6366c': 'Studio fashion portrait in red against a black backdrop',
  'a6d35c02-a9af-4001-b233-2fcbfcc4405a': 'A busy flower market beneath warm strings of lights',
  '03124d5c-609f-44ca-ab19-cef83cdc2a2a': 'A racing car captured in motion on the track',
  '42a34cc4-99db-4bec-89c3-5bd56c0c29cb': 'A seated fashion portrait against a white studio backdrop',
  '026c30df-6c91-4920-b34f-5ebf47e39607': 'A child looking up with a white flower resting on their forehead',
};
// Canonical categories come first; identical decorative background copies are omitted.
files.sort((a,b) => Number(a.includes('/Background/')) - Number(b.includes('/Background/')) || a.localeCompare(b));
await mkdir(path.join(root, 'public/gallery'), { recursive: true });
for (const file of files) {
  const bytes = await readFile(file);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const relative = path.relative(publicRoot, file).split(path.sep).join('/');
  if (relative.startsWith('Background/') && hashes.has(hash)) continue;
  hashes.add(hash);
  const folder = relative.includes('/') ? relative.split('/')[0] : 'Other';
  const category = overrides[relative]?.category || ({ Event: 'Events', Fashion: 'Fashion', Street: 'Street', viku: 'Personal', Background: 'Other' })[folder] || folder;
  const stem = path.parse(file).name;
  const id = createHash('sha256').update(relative).digest('hex').slice(0,12);
  const version = hash.slice(0,10);
  const thumb = `/gallery/${id}-${version}-800.webp`;
  const full = `/gallery/${id}-${version}-1920.webp`;
  const meta = await sharp(bytes).metadata();
  const rotated = [5,6,7,8].includes(meta.orientation);
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;
  for (const [url,size,quality] of [[thumb,800,82],[full,1920,88]]) {
    const destination = path.join(root, 'public', url);
    try { await access(destination); }
    catch { await sharp(bytes).rotate().resize({ width:size, height:size, fit:'inside', withoutEnlargement:true }).webp({ quality }).toFile(destination); }
  }
  counts[category] = (counts[category] || 0) + 1;
  photos.push({ id, category, src:full, thumbnail:thumb, original:`/portfolio/${relative}`, width, height,
    title: `${category === 'Personal' ? 'Behind the lens' : category} / ${String(counts[category]).padStart(2,'0')}`,
    alt: overrides[relative]?.alt || descriptions[stem] || `${category} photograph ${counts[category]} by Viku Singh`,
    featured: featured.indexOf(stem),
  });
}
photos.sort((a,b) => (a.featured < 0 ? 999 : a.featured) - (b.featured < 0 ? 999 : b.featured) || Number(b.original.includes('/Archive/')) - Number(a.original.includes('/Archive/')));
await mkdir(path.join(root, 'src/data'), { recursive:true });
await writeFile(path.join(root, 'src/data/photos.json'), JSON.stringify(photos, null, 2) + '\n');
console.log(`Prepared ${photos.length} photographs: ${JSON.stringify(counts)}`);
