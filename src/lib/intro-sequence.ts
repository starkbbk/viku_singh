export const INTRO_TIMING = {
  minimumMs: 2600,
  maximumMs: 6000,
  fadeMs: 650,
  fallbackMs: 1000,
} as const;

interface SequenceOptions {
  reducedMotion: boolean;
  onExit: () => void;
  onFinish: () => void;
}

/** Coordinates asset readiness, the minimum intro duration and a single exit. */
export function createIntroSequence({ reducedMotion, onExit, onFinish }: SequenceOptions) {
  let active = true;
  let exiting = false;
  let ready = false;
  let minimumElapsed = false;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => { timers.delete(timer); if (active) callback(); }, delay);
    timers.add(timer);
  };
  const dispose = () => {
    active = false;
    timers.forEach(clearTimeout);
    timers.clear();
  };
  const finish = () => {
    if (!active) return;
    dispose();
    onFinish();
  };
  const exit = () => {
    if (!active || exiting) return;
    exiting = true;
    onExit();
    // An interrupted animation or reduced-motion setting must never trap the page.
    schedule(finish, reducedMotion ? 100 : INTRO_TIMING.fallbackMs);
  };
  schedule(() => { minimumElapsed = true; if (ready) exit(); }, reducedMotion ? 0 : INTRO_TIMING.minimumMs);
  schedule(exit, reducedMotion ? 1200 : INTRO_TIMING.maximumMs);
  return {
    assetsReady() { if (!active) return; ready = true; if (minimumElapsed) exit(); },
    animationFinished() { if (exiting) finish(); },
    skip: finish,
    dispose,
  };
}
