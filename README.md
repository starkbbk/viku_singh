# Viku Singh — Photography & Visual Stories

A photography portfolio built with Next.js 16, React 19 and Framer Motion. The design adapts the supplied cinematic references into four full-screen photography chapters, with scroll-linked diagonal photo wipes, camera movement, field notes and an interactive timeline.

The latest supplied recording inspired condensed uppercase headings that develop from partial outlines into solid lettering. The effect runs on chapter changes and when archive, biography and contact headings enter the viewport. The first hero reveal waits for the loading intro to finish. Photographs remain opaque beneath incoming diagonal masks, with zoom applied inside each mask; chapter buttons land after their transition completes. Subtle drifting light particles pause off screen. Short-screen typography is capped to leave room for chapter controls, and compact screens omit the field-notes card. Reduced motion uses immediate scene changes and solid text. The Anton typeface is self-hosted; its SIL Open Font License is included in `public/fonts/Anton-OFL.txt`.

The archive displays 119 photographs: 75 Events, 24 Motorsport, 9 Fashion, 9 Street and 2 Personal. 48 photographs from the additional Archive.zip are included; the requested headshot and its category have been removed; 15 existing racing photographs have also been recategorized as Motorsport. Category filters, a keyboard-accessible full-screen viewer, arrow-key navigation, mobile swipes and full-photo links are included. The gallery initially displays 9 photographs per category, with View more revealing the next 9. Each category selection resets to the first batch. Separate masonry batches keep existing photos in place when more are added; the full-screen viewer can still browse the complete selected collection. The gallery keeps each photograph's proportions. Reduced-motion preferences are respected.

The opening intro uses gently moving photo negatives, single-layer masked text and one unified fade directly into the page. Its opaque cover is present in the initial HTML, preventing a flash of the page before hydration. Decorative photos wait for decoding before appearing together; failed photos are omitted. Loader styles are isolated from the page's outline and scroll effects. A smooth visual timeline replaces the jumping asset percentage, with a 2.6-second intro and a bounded fallback if images are unavailable. The entire modal fades together over 650ms, with animation-completion cleanup and a timed fallback. Skip intro, Escape and Replay intro are supported. With reduced motion, the intro is brief and camera movement is disabled. The rest of the page uses a scrolling filmstrip, photograph reveals, staggered headings, animated section entrances and a reading-progress line. Off-screen gallery images stay lazy-loaded; they do not block the intro.

## Phones and tablets

Up to 1024px, the header stays accessible while scrolling, with a menu that fits short landscape screens and closes when switching to desktop layout. Category filters use one horizontally scrollable row with 44px touch targets. The gallery uses two columns from 360px to 1024px, and a single column on narrower phones; View more still adds nine photos at a time. Selecting a collection keeps its active filter visible.

Hero and biography pictures serve smaller variants at up to 600px. The loader checks those same responsive sources, reducing the four opening photos from roughly 737KB to 120KB on phones. Full-size photographs remain available in the viewer. The viewer uses a flexible screen-height layout with 44px navigation controls, swipe navigation, and room for wrapping captions. Safe-area spacing accommodates notches and home indicators, and browser pinch zoom remains enabled. Phone hover effects are disabled to avoid stuck zoom states after tapping.

Responsive browser previews were checked at 320×568, 360×640, 390×844, 430×932, 568×320, 768×1024, 844×390, 1024×768 and 1440×900. Checks covered horizontal overflow, long headlines, mobile menu navigation, gallery filters, View more, responsive image selection and portrait/landscape photo viewing.

## Photograph motion

Every archive photo receives a stable motion profile from its ID: six reveal styles (rise, left/right diagonal, iris, shutter and soft focus), with individual duration, delay and depth. Filtering or changing the gallery order preserves that profile. Entrances wait for the thumbnail to load and run once per mounted photograph. Previously shown cards keep their positions and reveal state when View more appends the next batch.

On a mouse or trackpad, photographs respond with spring-driven tilt, a small image zoom, a light highlight that follows the pointer, focus corners and caption underlines. Touch devices keep native scrolling and pinch gestures, with a brief press response and visible photo controls. Scroll depth, pointer tilt and entrance masks use separate elements so their transforms do not conflict. A single scroll scheduler measures only visible cards; it pauses with the introduction, photo viewer, hidden document or reduced-motion preference. Photos remain visible without JavaScript.

The filmstrip has alternating frame and label movement. The biography photograph develops its frame lines and uses gentle depth, with lens rings behind the biography/contact sections. Full-screen photographs enter from the navigation direction, while buttons and links have light sweeps and arrow motion. Reduced motion shows static, fully visible photographs.

## Run locally

Use Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production:

```sh
npm run build
npm start
```

## Add more photographs

1. Extract the photo ZIP outside the project and review its contents.
2. Copy photographs into `Pictures/Event`, `Pictures/Fashion`, `Pictures/Street`, `Pictures/Motorsport` or `Pictures/viku`. A new named folder creates another collection. Nested folders are supported.
3. Run `npm run photos:sync`, then restart the development server or rebuild the site. Synchronization also runs automatically before `npm run dev` and `npm run build`.

JPEG, PNG, WebP, AVIF and TIFF sources are supported. Existing public source images are kept intact. The additional Archive.zip photos use orientation-corrected, high-quality JPEGs up to 2400px, with the user's original archive kept outside the website. The four files ending in .arw were inspected and are actually JPEG-encoded images; they are included as JPEGs. The preparation script generates orientation-corrected 800px and 1920px WebP versions in `public/gallery` and updates `src/data/photos.json`. Existing public files are not overwritten automatically. An updated image with an existing filename should be replaced intentionally in `public/portfolio` before synchronization.

All supplied category photographs remain in the archive, including alternate exports of the same frame. Nine byte-identical decorative copies in the Background folder are omitted from the gallery. A new image file produces new content-hashed preview URLs.

Category corrections and captions are stored in `src/data/photo-overrides.json`. `src/data/archive-import.json` maps every added archive photograph to its website path and retains its original source hash for traceability. Alternate edits/crops are retained so every supplied photo stays accessible.

## Contact

The visible contact actions use the existing email address, phone number, WhatsApp and Instagram profile. The repository's existing `/api/send-email` endpoint is preserved and requires `EMAIL_USER` and `EMAIL_PASS` if used by another client; the redesigned page does not submit to it.

## Checks

```sh
npm run build
npx eslint src/components/CinematicLoader.tsx src/components/ScrollEffects.tsx src/components/PhotographyExperience.tsx src/components/RevealType.tsx src/components/AnimatedPhotoCard.tsx src/components/usePhotoChoreography.ts src/lib/photo-journey.ts src/lib/photo-motion.ts src/app/page.tsx src/app/layout.tsx scripts/prepare-photos.mjs
node scripts/verify-photos.mjs
```

The regression tests cover intro timing, unavailable images, interrupted fades, Skip/Escape, cleanup, reduced motion, stable photo identity, variant coverage, bounded effects and unobscured final frames. Run them with Node.js 24: `node --test scripts/intro-sequence.test.mjs scripts/photo-motion.test.mjs`.
