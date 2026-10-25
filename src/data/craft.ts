/* The Creations strip, as a grid of half-unit cells.

   One unit is a 180px square. Cells are half a unit each way, so a tile can
   be 1.5 units wide or tall. The strip is five cells (2.5 units) high: a
   "1x1" or "2x1" tile takes two rows, a "1xTall" or "2xTall" three, a
   "1xFull", "1.5xFull" or "2xFull" all five. Kinds are named in units, spans
   are in cells. */

export type TileKind =
  | "1x1"
  | "1xTall"
  | "1xFull"
  | "1.5xFull"
  | "2x1"
  | "2xTall"
  | "2xFull";

export const TILE_SPAN: Record<TileKind, { cols: number; rows: number }> = {
  "1x1": { cols: 2, rows: 2 },
  "1xTall": { cols: 2, rows: 3 },
  "1xFull": { cols: 2, rows: 5 },
  "1.5xFull": { cols: 3, rows: 5 },
  "2x1": { cols: 4, rows: 2 },
  "2xTall": { cols: 4, rows: 3 },
  "2xFull": { cols: 4, rows: 5 },
};

export const CRAFT_COLS = 17;
export const CRAFT_ROWS = 5;
export const UNIT = 180;
export const GAP = 12;
// Two cells plus the gap between them make one unit.
export const CELL = (UNIT - GAP) / 2;

/* One screen inside an iPhone frame. Screenshots taken on a simulator
   already carry the status bar and Dynamic Island; web captures don't, so
   `island` draws one. */
export interface PhoneScreen {
  alt: string;
  src?: string;
  video?: { mp4: string; webm?: string; poster?: string };
  island?: boolean;
}

export interface CraftTile {
  id: string;
  kind: TileKind;
  /* 1-indexed grid line, in cells, where the tile starts. */
  col: number;
  row: number;
  alt: string;
  /* Full-bleed media: an image under /public, or a video. */
  src?: string;
  video?: { mp4: string; webm?: string; poster?: string };
  /* iPhone mockups standing in a row on a gray card. */
  phones?: PhoneScreen[];
  /* App icons in a row on a light card. */
  icons?: { src: string; alt: string }[];
  /* object-position for a full-bleed image the tile crops. */
  position?: string;
  /* Shrinks a full-bleed image inside its card toward `origin` (a CSS
     transform-origin), for transparent shots that sit too tight. */
  zoom?: { scale: number; origin: string };
  /* Show the whole media, centered on the card, instead of cropping it. */
  contain?: boolean;
  /* Plays `video` inside a macOS terminal window over a wallpaper.
     `aspect` is the recording's width over height. */
  terminal?: { wallpaper: string; aspect: number };
  /* Only tiles with a destination are clickable. */
  href?: string;
}

export const craft: CraftTile[] = [
  {
    id: "near-icons",
    kind: "2x1",
    col: 1,
    row: 1,
    alt: "Near app icons: tinted, dark and light",
    icons: [
      { src: "/projects/near/icon-mono.png", alt: "Near icon, tinted" },
      { src: "/projects/near/icon-dark.png", alt: "Near icon, dark" },
      { src: "/projects/near/icon-light.png", alt: "Near icon, light" },
    ],
    href: "https://nearapp.social",
  },
  {
    id: "working",
    kind: "2xTall",
    col: 1,
    row: 3,
    alt: "Near sketches on paper, on a table next to a laptop",
    src: "/projects/working.jpg",
    position: "50% 44%",
    href: "https://nearapp.social",
  },

  {
    id: "near-first-friend",
    kind: "1.5xFull",
    col: 5,
    row: 1,
    alt: "Near: adding a first friend on iPhone",
    video: {
      mp4: "/projects/near/first-friend-light.mp4",
      webm: "/projects/near/first-friend-light.webm",
      poster: "/projects/near/first-friend-light-poster.jpg",
    },
    // Already a framed iPhone on the card color: show it whole.
    contain: true,
    href: "https://nearapp.social",
  },

  {
    id: "paggo-ios",
    kind: "2xTall",
    col: 8,
    row: 1,
    alt: "Paggo wallet home screen on iPhone",
    src: "/projects/paggo/paggo-ios.png",
    // The shot cuts the phone off at the bottom: keep that edge on the card's.
    zoom: { scale: 0.96, origin: "50% 100%" },
    href: "https://github.com/gabrielcoffee/paggo-ios",
  },
  {
    id: "pio-website",
    kind: "2x1",
    col: 8,
    row: 4,
    alt: "Pio Brasileiro website home in a browser",
    src: "/projects/pio/website.png",
    // 4:3 shot in a 2:1 tile: keep the window chrome and hero in frame.
    position: "50% 40%",
    // Pulls the window off the top edge, staying anchored where it bleeds out.
    zoom: { scale: 0.92, origin: "100% 100%" },
    href: "https://github.com/gabrielcoffee/piobrasileiro",
  },

  {
    id: "birds",
    kind: "1xTall",
    col: 12,
    row: 1,
    alt: "A flock of white birds flying low over a green hillside",
    src: "/projects/birds.jpg",
  },
  {
    id: "head-pencil",
    kind: "1x1",
    col: 12,
    row: 4,
    alt: "Ink drawing of a head with a pencil through it",
    src: "/projects/drawings/head-pencil.jpg",
    position: "50% 30%",
  },

  {
    id: "zombie-chamber",
    kind: "2x1",
    col: 14,
    row: 1,
    alt: "Zombie Chamber, an online co-op shooter",
    src: "/projects/zombie-chamber-horde.png",
    // Bottom of the shot: the player in the corner, the horde closing in.
    position: "50% 100%",
    href: "https://coffeebreak1.itch.io/zombiechamber",
  },
  {
    id: "feels",
    kind: "2xTall",
    col: 14,
    row: 3,
    alt: "feels, a mood tracker for the terminal",
    video: {
      mp4: "/projects/feels.mp4",
      webm: "/projects/feels.webm",
      poster: "/projects/feels-poster.jpg",
    },
    terminal: { wallpaper: "/projects/mojave.jpg", aspect: 1488 / 1104 },
    href: "https://github.com/gabrielcoffee/feels",
  },
];
