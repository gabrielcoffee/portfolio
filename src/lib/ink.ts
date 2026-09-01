/* TEXT INK MEASUREMENT
   A line box is sized from the font's em metrics and the advance width, and
   neither matches where the letters actually are. Canvas is the only place the
   browser exposes true ink extents. */

export interface InkMetrics {
  /* Ink edges, as offsets from an alphabetic baseline drawn at x = 0. */
  left: number;
  right: number;
  ascent: number;
  descent: number;
  /* Advance width — what the element's layout box is sized from. */
  advance: number;
  /* The font's own em extents. Constant for a given font and size. */
  fontAscent: number;
  fontDescent: number;
  xHeight: number;
}

export interface InkFont {
  fontSize: number; // px
  fontFamily: string;
  fontWeight: string | number;
  letterSpacing?: string;
}

/* Null on browsers without ink metrics (Safari before 17). */
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

/* How far to nudge an element so its text lands on the centre it was
   positioned at. Assumes `line-height: 1`.

   x — the word's own ink.
   y — baseline and x-height, which are font-constant: anchoring on the word's
       ink would ride "writings" up on its descender and drop "archive". */
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
