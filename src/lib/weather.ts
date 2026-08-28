export type WeatherKind =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export interface WeatherNow {
  kind: WeatherKind;
  label: string;
  temperature: number;
  isDay: boolean;
}

export interface WeatherPalette {
  /** Base fill behind the blurred blobs. */
  base: string;
  /** Three blobs, blurred heavily and layered to make the gradient mesh. */
  blobs: [string, string, string];
  /** Foreground text color. */
  text: string;
  /** Secondary/dimmed text color. */
  textMuted: string;
  /** Hairline highlight along the top edge, mimicking glass. */
  rim: string;
}

const LABELS: Record<WeatherKind, string> = {
  clear: "Clear",
  partly: "Partly cloudy",
  cloudy: "Cloudy",
  fog: "Foggy",
  rain: "Rain",
  snow: "Snow",
  storm: "Storm",
};

/** WMO weather interpretation codes used by Open-Meteo. */
export function kindFromCode(code: number): WeatherKind {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 71 && code <= 77) return "snow";
  if (code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "rain"; // 51-67 drizzle/rain/freezing, 80-82 showers
}

const DARK = "#0d1b26";
const DARK_MUTED = "rgba(13, 27, 38, 0.62)";
const LIGHT = "#f7f9fb";
const LIGHT_MUTED = "rgba(247, 249, 251, 0.66)";

const DAY: Record<WeatherKind, WeatherPalette> = {
  clear: {
    base: "#79c7ef",
    blobs: ["#ffe08a", "#c7ecff", "#3f9fdd"],
    text: DARK,
    textMuted: DARK_MUTED,
    rim: "rgba(255,255,255,0.55)",
  },
  partly: {
    base: "#8ec5e6",
    blobs: ["#ffffff", "#ffd79a", "#5ba3d0"],
    text: DARK,
    textMuted: DARK_MUTED,
    rim: "rgba(255,255,255,0.55)",
  },
  cloudy: {
    base: "#a9b6c2",
    blobs: ["#e8eef3", "#8fa0b0", "#cbd6de"],
    text: DARK,
    textMuted: DARK_MUTED,
    rim: "rgba(255,255,255,0.5)",
  },
  fog: {
    base: "#bdbcb6",
    blobs: ["#e9e7e0", "#9c9c96", "#d4d2cb"],
    text: DARK,
    textMuted: DARK_MUTED,
    rim: "rgba(255,255,255,0.5)",
  },
  rain: {
    base: "#63788c",
    blobs: ["#9fb6c8", "#3f5567", "#82a0b8"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.28)",
  },
  snow: {
    base: "#cfdde8",
    blobs: ["#ffffff", "#a6c4da", "#eaf3f9"],
    text: DARK,
    textMuted: DARK_MUTED,
    rim: "rgba(255,255,255,0.7)",
  },
  storm: {
    base: "#494757",
    blobs: ["#7d7894", "#2e2c3a", "#9a93b0"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.24)",
  },
};

const NIGHT: Record<WeatherKind, WeatherPalette> = {
  clear: {
    base: "#101a34",
    blobs: ["#2b3f7a", "#5566b8", "#080d1c"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.22)",
  },
  partly: {
    base: "#151d33",
    blobs: ["#33406b", "#4a5a94", "#0b1020"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.2)",
  },
  cloudy: {
    base: "#1c2029",
    blobs: ["#343b48", "#4a5361", "#111419"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.18)",
  },
  fog: {
    base: "#22242a",
    blobs: ["#3a3d45", "#4d5058", "#141519"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.18)",
  },
  rain: {
    base: "#121a22",
    blobs: ["#28323e", "#3d4c5d", "#090d12"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.18)",
  },
  snow: {
    base: "#1b2230", 
    blobs: ["#39445c", "#5b6a91", "#0f141f"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.24)",
  },
  storm: {
    base: "#0e0d14",
    blobs: ["#2a2736", "#443e5b", "#060509"],
    text: LIGHT,
    textMuted: LIGHT_MUTED,
    rim: "rgba(255,255,255,0.16)",
  },
};

export function paletteFor(kind: WeatherKind, isDay: boolean): WeatherPalette {
  return (isDay ? DAY : NIGHT)[kind];
}

export const NEUTRAL_PALETTE: WeatherPalette = {
  base: "#8d949c",
  blobs: ["#b8bfc6", "#6f767e", "#a2a9b1"],
  text: LIGHT,
  textMuted: LIGHT_MUTED,
  rim: "rgba(255,255,255,0.3)",
};

export const CURITIBA = {
  latitude: -25.4284,
  longitude: -49.2733,
  timeZone: "America/Sao_Paulo",
  city: "Curitiba",
  country: "Brazil",
} as const;

const ENDPOINT =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${CURITIBA.latitude}&longitude=${CURITIBA.longitude}` +
  `&current=temperature_2m,weather_code,is_day` +
  `&timezone=${encodeURIComponent(CURITIBA.timeZone)}`;

export async function fetchWeather(signal?: AbortSignal): Promise<WeatherNow> {
  const res = await fetch(ENDPOINT, { signal });
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);

  const json = (await res.json()) as {
    current: { temperature_2m: number; weather_code: number; is_day: number };
  };

  const kind = kindFromCode(json.current.weather_code);

  return {
    kind,
    label: LABELS[kind],
    temperature: Math.round(json.current.temperature_2m),
    isDay: json.current.is_day === 1,
  };
}
