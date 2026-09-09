import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createIntroSequence, INTRO_TIMING } from '../src/lib/intro-sequence.ts';

function setup(t, reducedMotion = false) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const events = [];
  const sequence = createIntroSequence({ reducedMotion, onExit: () => events.push('exit'), onFinish: () => events.push('finish') });
  t.after(sequence.dispose);
  return { sequence, events, tick: milliseconds => t.mock.timers.tick(milliseconds) };
}

test('cached images keep the intro visible until its minimum, then finish exactly once on the fade', t => {
  const { sequence, events, tick } = setup(t);
  sequence.assetsReady();
  sequence.animationFinished(); // Entrance completion cannot close the intro.
  tick(INTRO_TIMING.minimumMs - 1);
  assert.deepEqual(events, []);
  tick(1);
  assert.deepEqual(events, ['exit']);
  sequence.animationFinished();
  sequence.animationFinished();
  tick(10000);
  assert.deepEqual(events, ['exit', 'finish']);
});

test('slow images trigger exit only when readiness arrives, without a second minimum wait', t => {
  const { sequence, events, tick } = setup(t);
  tick(INTRO_TIMING.minimumMs + 500);
  assert.deepEqual(events, []);
  sequence.assetsReady();
  assert.deepEqual(events, ['exit']);
  sequence.animationFinished();
  assert.deepEqual(events, ['exit', 'finish']);
});

test('unavailable images and interrupted animations cannot trap the visitor', t => {
  const { events, tick } = setup(t);
  tick(INTRO_TIMING.maximumMs);
  assert.deepEqual(events, ['exit']);
  tick(INTRO_TIMING.fallbackMs);
  assert.deepEqual(events, ['exit', 'finish']);
});

test('Skip / Escape immediately finish once and cancel pending work', t => {
  const { sequence, events, tick } = setup(t);
  sequence.skip();
  sequence.skip();
  sequence.assetsReady();
  tick(20000);
  assert.deepEqual(events, ['finish']);
});

test('unmounting or Strict Mode cleanup prevents stale callbacks', t => {
  const { sequence, events, tick } = setup(t);
  sequence.dispose();
  sequence.assetsReady();
  sequence.animationFinished();
  tick(20000);
  assert.deepEqual(events, []);
});

test('reduced motion completes promptly even when no animation callback runs', t => {
  const { sequence, events, tick } = setup(t, true);
  sequence.assetsReady();
  tick(0);
  assert.deepEqual(events, ['exit']);
  tick(100);
  assert.deepEqual(events, ['exit', 'finish']);
});
