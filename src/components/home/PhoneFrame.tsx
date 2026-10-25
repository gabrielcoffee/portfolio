import Image from "next/image";
import type { PhoneScreen } from "~/data/craft";

/* An iPhone 17 Pro drawn in CSS, so it stays sharp at any zoom: a titanium
   rim, a black border around the glass, the action button and volume keys
   on the left, the side button on the right. Every measure is a share of the
   phone's own width (cqw), so it scales as one piece. Simulator screenshots
   carry their own Dynamic Island; `island` draws one for web captures. */
export default function PhoneFrame({
  screen,
  sizes,
}: {
  screen: PhoneScreen;
  sizes: string;
}) {
  return (
    <div className="relative w-full [container-type:inline-size]">
      {/* Keys sit behind the rim and stick out past it. */}
      <Key side="left" top="17.5%" height="5.5%" />
      <Key side="left" top="25.5%" height="9%" />
      <Key side="left" top="36.5%" height="9%" />
      <Key side="right" top="28%" height="14%" />

      <div
        className="relative z-10 rounded-[17.5cqw] p-[1.3cqw] shadow-[0_2cqw_6cqw_-2cqw_rgba(0,0,0,0.45)]"
        style={{
          background:
            "linear-gradient(145deg, #5a5a5e 0%, #2c2c2e 18%, #1c1c1e 50%, #2c2c2e 82%, #4a4a4e 100%)",
        }}
      >
        <div className="rounded-[16.2cqw] bg-black p-[2.6cqw] shadow-[inset_0_0_0_0.35cqw_rgba(255,255,255,0.06)]">
          <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-[13.6cqw] bg-black">
            <ScreenMedia screen={screen} sizes={sizes} />
            {screen.island && (
              <div className="absolute left-1/2 top-[3.2cqw] h-[8.6cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Key({
  side,
  top,
  height,
}: {
  side: "left" | "right";
  top: string;
  height: string;
}) {
  return (
    <div
      className={`absolute w-[1.6cqw] rounded-[0.8cqw] ${side === "left" ? "-left-[0.9cqw]" : "-right-[0.9cqw]"}`}
      style={{
        top,
        height,
        background:
          side === "left"
            ? "linear-gradient(90deg, #1c1c1e, #48484c 60%, #2c2c2e)"
            : "linear-gradient(90deg, #2c2c2e, #48484c 40%, #1c1c1e)",
      }}
    />
  );
}

function ScreenMedia({ screen, sizes }: { screen: PhoneScreen; sizes: string }) {
  if (screen.video) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={screen.video.poster}
        aria-label={screen.alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
      >
        {screen.video.webm && <source src={screen.video.webm} type="video/webm" />}
        <source src={screen.video.mp4} type="video/mp4" />
      </video>
    );
  }
  if (!screen.src) return null;
  return (
    <Image
      src={screen.src}
      alt={screen.alt}
      fill
      sizes={sizes}
      quality={90}
      draggable={false}
      className="pointer-events-none object-cover object-top"
    />
  );
}
