import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPhotoMotion } from '../src/lib/photo-motion.ts';

const photos = JSON.parse(readFileSync(new URL('../src/data/photos.json', import.meta.url), 'utf8'));

test('each photo keeps its motion when the gallery is reordered or filtered', () => {
  const original = new Map(photos.map(photo => [photo.id, getPhotoMotion(photo.id)]));
  for (const photo of [...photos].reverse()) {
    assert.deepEqual(getPhotoMotion(photo.id), original.get(photo.id));
  }
  for (const category of new Set(photos.map(photo => photo.category))) {
    for (const photo of photos.filter(photo => photo.category === category)) {
      assert.deepEqual(getPhotoMotion(photo.id), original.get(photo.id));
    }
  }
});

test('the real collection receives all six reveals and varied pacing', () => {
  const profiles = photos.map(photo => getPhotoMotion(photo.id));
  assert.deepEqual([...new Set(profiles.map(profile => profile.variant))].sort(), [
    'diagonal-left', 'diagonal-right', 'focus', 'iris', 'rise', 'shutter',
  ]);
  assert.ok(new Set(profiles.map(profile => profile.duration)).size > 20);
});

test('all motion stays within modest travel, blur, tilt, and timing limits', () => {
  // Also exercise IDs outside the current data, including missing/Unicode IDs.
  for (const id of [...photos.map(photo => photo.id), '', 'नया फोटो', 'a'.repeat(1000)]) {
    const { duration, delay, depth, tilt, frames } = getPhotoMotion(id);
    assert.ok(duration >= 700 && duration <= 1100, id);
    assert.ok(delay >= 0 && delay < 180, id);
    assert.ok(depth >= 5 && depth <= 12, id);
    assert.ok(tilt >= 2 && tilt <= 4, id);
    for (const frame of frames) {
      assert.ok(frame.opacity >= 0 && frame.opacity <= 1, id);
      for (const match of String(frame.transform).matchAll(/(-?\d+(?:\.\d+)?)px/g)) {
        assert.ok(Math.abs(Number(match[1])) <= 36, id);
      }
      for (const match of String(frame.transform).matchAll(/rotate\((-?\d+(?:\.\d+)?)deg\)/g)) {
        assert.ok(Math.abs(Number(match[1])) <= 2, id);
      }
      for (const match of String(frame.transform).matchAll(/scale\((\d+(?:\.\d+)?)\)/g)) {
        assert.ok(Number(match[1]) >= 0.96 && Number(match[1]) <= 1, id);
      }
      for (const match of String(frame.filter).matchAll(/blur\((\d+(?:\.\d+)?)px\)/g)) {
        assert.ok(Number(match[1]) <= 2, id);
      }
    }
  }
});

test('every reveal ends with an unobscured, untransformed photograph', () => {
  const openMasks = new Set([
    'inset(0% 0% 0% 0%)',
    'inset(0% 0% 0% 0% round 0%)',
    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  ]);
  for (const photo of photos) {
    const { frames } = getPhotoMotion(photo.id);
    const end = frames.at(-1);
    assert.equal(end.opacity, 1);
    assert.equal(end.transform, 'none');
    assert.equal(end.filter, 'none');
    assert.ok(openMasks.has(end.clipPath));
    // Matching mask functions allow interpolation instead of a discrete jump.
    assert.equal(String(frames[0].clipPath).split('(')[0], String(end.clipPath).split('(')[0]);
  }
});

test('animation consumers cannot mutate another instance or future profile', () => {
  const id = photos[0].id;
  const expected = getPhotoMotion(id);
  const altered = getPhotoMotion(id);
  altered.frames[0].opacity = 0;
  altered.frames.at(-1).transform = 'scale(2)';
  altered.frames.push({ filter: 'blur(10px)' });
  assert.deepEqual(getPhotoMotion(id), expected);
});
