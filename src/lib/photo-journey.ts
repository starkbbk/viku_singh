export const CHAPTER_COUNT = 4;
export const WIPE_HALF_SPAN = 0.045;
export const FULL_FRAME = 'polygon(0% 0%, 100% -35%, 100% 100%, 0% 100%)';
export const HIDDEN_FRAME = 'polygon(0% 135%, 100% 100%, 100% 100%, 0% 100%)';

export function chapterAtProgress(progress: number) {
  return Math.min(CHAPTER_COUNT - 1, Math.max(0, Math.floor(progress * CHAPTER_COUNT)));
}

// Land beyond the wipe so a chapter link always shows its complete photograph.
export function chapterLandingProgress(index: number) {
  const chapter = Math.max(0, Math.min(CHAPTER_COUNT - 1, index));
  return chapter === 0 ? 0 : chapter / CHAPTER_COUNT + WIPE_HALF_SPAN;
}
