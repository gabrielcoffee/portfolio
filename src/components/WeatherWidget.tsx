"use client";

import { useEffect, useState } from "react";
import {
  CURITIBA,
  NEUTRAL_PALETTE,
  fetchWeather,
  paletteFor,
  type WeatherNow,
} from "~/lib/weather";

const REFRESH_MS = 15 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: CURITIBA.timeZone,
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: CURITIBA.timeZone,
});

/** Squircle where supported, plain rounded corners everywhere else. */
const CORNERS = "rounded-[30px] [corner-shape:squircle]";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  // Clock. Starts null so server and client markup agree on first paint.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = () => {
      fetchWeather(controller.signal)
        .then(setWeather)
        .catch(() => {
          /* keep the last good reading */
        });
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, []);

  const palette = weather
    ? paletteFor(weather.kind, weather.isDay)
    : NEUTRAL_PALETTE;

  return (
    <aside className="pointer-events-none fixed left-6 top-6 z-40 hidden xl:block">
      <div
        className={`relative h-44 w-44 overflow-hidden ${CORNERS} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] transition-colors duration-700`}
        style={{ backgroundColor: palette.base, color: palette.text }}
      >
        {/* Blurred colour mesh — this is the "weather" of the widget. */}
        <div aria-hidden className="absolute -inset-[40%]">
          <span
            className="absolute left-[8%] top-[2%] h-[62%] w-[62%] rounded-full blur-[26px] transition-colors duration-700"
            style={{ backgroundColor: palette.blobs[0] }}
          />
          <span
            className="absolute right-[4%] top-[24%] h-[58%] w-[58%] rounded-full blur-[30px] transition-colors duration-700"
            style={{ backgroundColor: palette.blobs[1] }}
          />
          <span
            className="absolute bottom-[6%] left-[18%] h-[64%] w-[64%] rounded-full blur-[34px] transition-colors duration-700"
            style={{ backgroundColor: palette.blobs[2] }}
          />
        </div>

        {/* Grain, so the gradient does not read as flat CSS. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{ backgroundImage: "url(/noise.png)", backgroundSize: "140px" }}
        />

        {/* Glass rim. */}
        <div
          aria-hidden
          className={`absolute inset-0 ${CORNERS}`}
          style={{
            boxShadow: `inset 0 1px 0 ${palette.rim}, inset 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-[-0.01em]">
                {CURITIBA.city}
              </div>
              <div className="text-[11px]" style={{ color: palette.textMuted }}>
                {CURITIBA.country}
              </div>
            </div>
            <div className="text-right leading-tight">
              <div className="text-[26px] font-light tabular-nums">
                {weather ? `${weather.temperature}°` : "—"}
              </div>
              <div
                className="text-[10px] tracking-[0.01em]"
                style={{ color: palette.textMuted }}
              >
                {weather?.label ?? ""}
              </div>
            </div>
          </div>

          <div
            className="flex items-end justify-between text-[11px] tracking-[0.01em]"
            style={{ color: palette.textMuted }}
          >
            <span>{now ? dateFormatter.format(now) : ""}</span>
            <span className="tabular-nums">
              {now ? timeFormatter.format(now) : ""}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
