import Image from "next/image";
import AutoScroll from "~/components/home/AutoScroll";
import PhoneFrame from "~/components/home/PhoneFrame";
import {
  CELL,
  CRAFT_COLS,
  CRAFT_ROWS,
  GAP,
  TILE_SPAN,
  UNIT,
  type CraftTile,
} from "~/data/craft";

/* Breaks out of the text column to span the whole window, then scrolls
   sideways inside it. The gutter is padding on the scroller, so the strip
   starts and ends a few pixels from the screen edge. mx-auto centers the
   strip when the window is wider; narrower, the margins collapse to zero and
   it starts at the left edge, drifting left on touch screens until touched. */
export default function CraftGrid({ tiles }: { tiles: CraftTile[] }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 select-none py-2">
      <div className="mx-auto max-w-[1920px]">
        <AutoScroll className="hide-scroll-bar overflow-x-auto px-6 md:px-3">
          <div
            className="mx-auto grid w-max"
            style={{
              gap: GAP,
              gridTemplateColumns: `repeat(${CRAFT_COLS}, ${CELL}px)`,
              gridTemplateRows: `repeat(${CRAFT_ROWS}, ${CELL}px)`,
            }}
          >
            {tiles.map((tile) => (
              <Tile key={tile.id} tile={tile} />
            ))}
          </div>
        </AutoScroll>
      </div>
    </div>
  );
}

function Tile({ tile }: { tile: CraftTile }) {
  const { cols, rows } = TILE_SPAN[tile.kind];
  const placement = {
    gridColumn: `${tile.col} / span ${cols}`,
    gridRow: `${tile.row} / span ${rows}`,
  };

  const video = tile.video && (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={tile.video.poster}
      aria-label={tile.alt}
      className={
        tile.terminal
          ? "block h-full w-full"
          : `h-full w-full ${tile.contain ? "object-contain py-10" : "object-cover"}`
      }
    >
      {tile.video.webm && <source src={tile.video.webm} type="video/webm" />}
      <source src={tile.video.mp4} type="video/mp4" />
    </video>
  );

  const media = tile.terminal && video ? (
    <TerminalWindow
      wallpaper={tile.terminal.wallpaper}
      aspect={tile.terminal.aspect}
      cols={cols}
      rows={rows}
    >
      {video}
    </TerminalWindow>
  ) : tile.phones ? (
    <div className="flex h-full w-full items-center justify-center gap-4 px-[18px]">
      {tile.phones.map((screen) => (
        <div key={screen.alt} className="w-full max-w-[160px]">
          {/* Sized well past its 160px so a pinch zoom stays sharp. */}
          <PhoneFrame screen={screen} sizes="640px" />
        </div>
      ))}
    </div>
  ) : tile.icons ? (
    <div className="flex h-full w-full items-center justify-center gap-8">
      {tile.icons.map((icon) => (
        <div
          key={icon.src}
          className="relative h-[68px] w-[68px] drop-shadow-[0_8px_12px_rgba(0,0,0,0.12)]"
        >
          <Image
            src={icon.src}
            alt={icon.alt}
            fill
            sizes="320px"
            quality={90}
            draggable={false}
            className="pointer-events-none"
          />
        </div>
      ))}
    </div>
  ) : video ? (
    video
  ) : tile.src ? (
    <Image
      src={tile.src}
      alt={tile.alt}
      fill
      // Three times the tile's width, so a pinch zoom stays sharp.
      sizes={`${(UNIT * 2 + GAP) * 3}px`}
      quality={90}
      draggable={false}
      className={`pointer-events-none ${tile.contain ? "object-contain" : "object-cover"}`}
      style={{
        objectPosition: tile.position,
        transform: tile.zoom && `scale(${tile.zoom.scale})`,
        transformOrigin: tile.zoom?.origin,
      }}
    />
  ) : null;

  const box = "relative overflow-hidden rounded-2xl bg-[#f4f5f7]";

  // No destination, no affordance: a plain box that ignores the pointer.
  if (!tile.href) {
    return (
      <div className={box} style={placement} aria-hidden={!media}>
        {media}
      </div>
    );
  }

  return (
    <a
      href={tile.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tile.alt}
      className={`${box} block cursor-pointer transition-all duration-300 hover:drop-shadow-sm`}
      style={placement}
    >
      {media}
    </a>
  );
}

const TITLE_BAR = 18;
const INSET = 20;

/* A dark macOS terminal window, centered on a wallpaper. The tile's size is
   fixed, so the window is sized here: as tall as the inset allows, and as
   wide as the recording's aspect then asks for. */
function TerminalWindow({
  wallpaper,
  aspect,
  cols,
  rows,
  children,
}: {
  wallpaper: string;
  aspect: number;
  cols: number;
  rows: number;
  children: React.ReactNode;
}) {
  const tileWidth = cols * CELL + (cols - 1) * GAP;
  const tileHeight = rows * CELL + (rows - 1) * GAP;
  const screenHeight = tileHeight - INSET * 2 - TITLE_BAR;
  const width = Math.min(tileWidth - INSET * 2, screenHeight * aspect);

  return (
    <div className="relative h-full w-full">
      <Image
        src={wallpaper}
        alt=""
        fill
        sizes={`${tileWidth * 3}px`}
        quality={85}
        draggable={false}
        className="pointer-events-none object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="overflow-hidden rounded-[8px] bg-[#1c1e2b] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/50"
          style={{ width }}
        >
          <div
            className="flex items-center gap-[5px] border-b border-black/40 bg-[#2a2c39] px-[8px]"
            style={{ height: TITLE_BAR }}
          >
            <span className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#febc2e]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#28c840]" />
          </div>
          <div style={{ height: width / aspect }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
