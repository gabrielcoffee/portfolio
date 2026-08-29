# Archive — plan

Three sub-collections behind `/archive`, each with its own physical metaphor.
Written before any code; update it as decisions change.

## Routes

```
/archive               three cards, same size as today's photo grid, title under each
/archive/pictures      polaroids scattered on a table, draggable
/archive/drawings      chronological rail of 3D papers, click to zoom to camera
/archive/manga         chronological rail of 3D spiral notebooks, click to open and read
```

Real routes, not one page with a state machine — each collection is linkable,
and the entrance fade already replays per navigation.

## The three

**Mini Manga** — childhood comic-book "company". A story is a spiral notebook.
Closed: 3D cover on a rail, spiral rings down the left, story name on the cover.
Open: a two-page spread the reader flips through, each flip a `rotateY` around
the spine. Pages are scans, so a story is just an ordered folder of images.

**Drawings** — recent drawings and doodles, same chronological rail. Each item is
a single sheet, no binding: either lined school-notebook paper or thicker white
A4. Hover grows it slightly; click flies it toward the camera until it fills the
screen, page behind it going flat background, no other detail.

**Pictures** — day-to-day life. Every photo drops onto the page at a random
position as a polaroid: white border, thicker at the bottom, handwritten title
bottom-left and year bottom-right on that border. Drag to move, dropping one on
another puts it on top.

## Data — filesystem, no CMS

Same trick `archive/page.tsx` already uses: read the folder at build time,
filename is the metadata. No JSON, no frontmatter, no admin.

```
public/archive/
  pictures/2019-summer-in-rio.jpg        -> "Summer in Rio", 2019
  drawings/a4/2024-hands.png             -> "Hands", 2024, A4 stock
  drawings/lined/2023-bus-doodle.png     -> "Bus doodle", 2023, lined stock
  manga/the-red-fox/{cover,01,02,...}.png -> "The red fox", pages in order
```

Convention: `YYYY-title-with-dashes.ext`. Year prefix gives both the label and
the chronological sort. Paper stock is the folder, not the filename.

Today's nine photos move from `public/archive/` into `public/archive/pictures/`.

## Technical decisions

**No WebGL.** All three effects are CSS 3D — `perspective`, `transform-style:
preserve-3d`, `rotateY`, `backface-visibility` — animated by framer-motion,
which is already a dependency. `three.js` would be a bigger bundle, a new
mental model, and worse text rendering, for effects the browser does natively.

**Drag is free.** framer-motion's `drag` + `dragMomentum` + `whileDrag` covers
the polaroids. Picking one up bumps a z-counter; no library needed.

**Scatter must be deterministic.** `Math.random()` at render gives the server
one layout and the browser another, and React screams about it. Hash the
filename into the offsets/rotation so both sides agree, and the same photo
lands in the same spot every visit.

**Handwriting font** — open decision. A Google font (Caveat, Gloria Hallelujah)
via `next/font/google` is one line and no asset. Anything closer to real
handwriting means a licensed or self-drawn font.

**Images** — `next/image` everywhere in the new sections. Manga pages are the
heavy case: load the spread plus its immediate neighbours, not the story.

**Reduced motion** — `prefers-reduced-motion` kills the flips and the fly-to-
camera; content stays reachable as plain images.

## Build order

1. **Pictures.** No 3D, photos already exist, and it lands the shared pieces —
   the `/archive` landing cards, the folder convention, the filename parser.
2. **Drawings.** First 3D, but one sheet, one axis, no binding.
3. **Manga.** The spread, the flip, the spiral. Hardest, built last on top of
   two working sections.

Each ships on its own. Nothing about a later section changes an earlier one.

## Open questions

- Polaroid scatter on mobile: a scatter you drag needs room. Fall back to a
  tidy column under some breakpoint?
- Does a picture open larger on click, or only drag?
- Manga: page-turn on click anywhere, or corner-drag like a real page?
- Are drawings and manga scans on hand yet, or is pictures the only section
  with content today?
