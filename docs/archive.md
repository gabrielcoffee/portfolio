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

**Pictures** — day-to-day life. **Built.** A grid of polaroids, each one rotated
and nudged a few degrees off true so the wall reads as scattered rather than
laid out. White border, thicker at the bottom, handwritten title bottom-left and
year bottom-right on that band. Hovering leans a photo toward the cursor.
Clicking lifts it: it straightens, grows to the centre, the page blurs behind
it. Clicking away drops it back into its tilt — slow and springy up, quick down,
a bump at both ends. (Dragging photos around was considered and dropped.)

## Data — filesystem, no CMS

Same trick `archive/page.tsx` already uses: read the folder at build time,
filename is the metadata. No JSON, no frontmatter, no admin.

```
public/archive/
  pictures/2019-summer-in-rio.jpg        -> "summer in rio", 2019
  pictures/band-rehearsal.jpg            -> "band rehearsal", no year
  drawings/a4/2024-hands.png             -> "Hands", 2024, A4 stock
  drawings/lined/2023-bus-doodle.png     -> "Bus doodle", 2023, lined stock
  manga/the-red-fox/{cover,01,02,...}.png -> "The red fox", pages in order
```

Convention: `YYYY-title-with-dashes.ext`. The year prefix is **optional** — a
photo without one just renders a blank year slot and sorts after the dated ones.
Paper stock is the folder, not the filename.

Today's nine photos live in `public/archive/pictures/`; none carry a year yet.
See `src/lib/archive.ts`.

## Technical decisions

**No WebGL.** All three effects are CSS 3D — `perspective`, `transform-style:
preserve-3d`, `rotateY`, `backface-visibility` — animated by framer-motion,
which is already a dependency. `three.js` would be a bigger bundle, a new
mental model, and worse text rendering, for effects the browser does natively.

**Zoom is shared-layout.** The grid card and the overlay card carry the same
framer `layoutId`, so the flight between them is measured, not hand-animated.
One catch: framer measures bounding boxes, and a rotated box is the wrong one —
so the scatter rotation lives on a wrapper *outside* the `layoutId` element and
is only restored once the photo has landed. See `src/components/PolaroidWall.tsx`.

**Scatter must be deterministic.** `Math.random()` at render gives the server
one layout and the browser another, and React screams about it. Hash the
filename into the offsets/rotation so both sides agree, and the same photo
lands in the same spot every visit.

**Handwriting font** — Gloria Hallelujah, via `next/font/google`, exposed as
`font-hand`. Swapping in a real handwriting file later is one line in
`src/app/layout.tsx`.

**Images** — `next/image` everywhere in the new sections. Manga pages are the
heavy case: load the spread plus its immediate neighbours, not the story.

**Reduced motion** — `prefers-reduced-motion` kills the flips and the fly-to-
camera; content stays reachable as plain images.

## Build order

1. ~~**Pictures.**~~ Done, along with the `/archive` landing cards, the folder
   convention and the filename parser. Mini Manga and Drawings are placeholder
   cards there: right size, right titles, not clickable.
2. **Drawings.** First 3D, but one sheet, one axis, no binding.
3. **Manga.** The spread, the flip, the spiral. Hardest, built last on top of
   two working sections.

Each ships on its own. Nothing about a later section changes an earlier one.

## Open questions

- Manga: page-turn on click anywhere, or corner-drag like a real page?
- Are drawings and manga scans on hand yet, or is pictures the only section
  with content today?
