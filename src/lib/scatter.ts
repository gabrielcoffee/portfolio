/* A photo's resting angle and nudge on the wall.

   Derived from its filename rather than drawn at random: random would give the
   server one layout and the browser another (a hydration mismatch), and would
   move every photo on every visit. Hashed, a photo keeps its spot forever. */

const MAX_ROTATE = 3.5; // degrees
const MAX_OFFSET = 6; // px

function hash(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Three independent values out of one hash: each byte drives one axis. */
export function scatterOf(key: string) {
  const h = hash(key);
  const spread = (byte: number, max: number) => ((byte / 255) * 2 - 1) * max;

  return {
    rotate: spread(h & 0xff, MAX_ROTATE),
    x: spread((h >> 8) & 0xff, MAX_OFFSET),
    y: spread((h >> 16) & 0xff, MAX_OFFSET),
  };
}
