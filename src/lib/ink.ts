/* Text ink measurement.
   A line box is sized from the font's em metrics and the advance width, neither
   of which matches where the letters actually are: side bearings, the trailing
   letter-spacing gap, and the fact that lowercase words may have no caps and no
   descenders all push the visible glyphs off the box's centre. Canvas is the
   only place the browser exposes true ink extents, so measurement happens on an
   offscreen one. */

export interface InkMetrics {
  /* Ink edges, as offsets from an alphabetic baseline drawn at x = 0. */
  left: number;
  right: number;
  ascent: number;
  descent: number;
  /* Advance width — what the element's layout box is sized from. */
  advance: number;
  /* The font's own em extents, for locating the baseline inside a line box.
     Constant for a given font and size, whatever the text. */
  fontAscent: number;
  fontDescent: number;
  /* Height of a lowercase 'x' above the baseline. Also font-constant, and the
     optical middle of a lowercase word sits about halfway up it. */
  xHeight: number;
}

export interface InkFont {
  fontSize: number; // px
  fontFamily: string;
  fontWeight: string | number;
  letterSpacing?: string; // any CSS length; omit for normal
}

/* Returns null on browsers without ink metrics (Safari before 17); callers fall
   back to the layout box rather than mispositioning. */
export function measureInk(text: string, font: InkFont): InkMetrics | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;

  ctx.font = `${font.fontWeight} ${font.fontSize}px ${font.fontFamily}`;
  if (font.letterSpacing) ctx.letterSpacing = font.letterSpacing;

  const m = ctx.measureText(text);
  if (m.actualBoundingBoxRight === undefined) return null;

  return {
    left: -m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    ascent: m.actualBoundingBoxAscent,
    descent: m.actualBoundingBoxDescent,
    advance: m.width,
    fontAscent: m.fontBoundingBoxAscent,
    fontDescent: m.fontBoundingBoxDescent,
    xHeight: ctx.measureText("x").actualBoundingBoxAscent,
  };
}

/* How far to nudge an element so the text it holds lands on the centre it was
   positioned at. Assumes `line-height: 1`, so the box height is the font size
   and the half-leading splits evenly above and below.

   The two axes deliberately use different anchors:

   x — the word's own ink, since horizontal centring is about the letters that
       are actually there.
   y — the baseline and x-height, which are font-constant. Anchoring on the
       word's ink instead makes the position depend on which letters it happens
       to contain: a descender ("journal") deepens the ink box and rides the
       word up, while a word without one ("archive") drops. Every page has to
       sit on the same line, so the vertical anchor cannot see the text. */
export function inkCenteringOffset(ink: InkMetrics, fontSize: number) {
  const halfLeading = (fontSize - (ink.fontAscent + ink.fontDescent)) / 2;
  const baselineFromTop = halfLeading + ink.fontAscent;

  const inkCenterX = (ink.left + ink.right) / 2;
  const opticalCenterY = baselineFromTop - ink.xHeight / 2;

  return {
    x: ink.advance / 2 - inkCenterX,
    y: fontSize / 2 - opticalCenterY,
  };
}
