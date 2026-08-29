import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Replaces Tailwind's default spacing scale outright — `p-4`, `gap-2`,
    // `mb-6` etc. no longer exist, so the rhythm can't drift back. Every
    // margin, padding and gap picks a ROLE, not a number.
    //   hair     hairline separation (a row of stars)
    //   tight    inside a control
    //   snug     between two tightly-bound lines
    //   cozy     between a title and its description
    //   base     between rows of a list
    //   wide     between a heading and its content; page gutter
    //   section  between one section of a page and the next
    //   loose    grid row gutter; below the header
    //   page     the biggest break a page makes on its own
    // Sizes below the rule are element dimensions, not rhythm.
    spacing: {
      0: "0px",
      px: "1px",
      hair: "0.125rem",
      tight: "0.25rem",
      snug: "0.5rem",
      cozy: "0.75rem",
      base: "1rem",
      wide: "1.5rem",
      section: "2rem",
      loose: "3rem",
      page: "4rem",
      // ---- page frame ----
      "page-top": "8rem",
      "page-bottom": "16rem",
      // ---- element sizes ----
      icon: "0.75rem",   // every inline icon, no exceptions
      control: "2rem",   // square tap target
      menu: "9rem",      // dropdown min width
      avatar: "5rem",
      cover: "12rem",
      measure: "40rem",  // the text column
    },
    // Replaces Tailwind's default scale outright — `text-xs`, `text-lg`,
    // `text-2xl` etc. no longer exist, so the system can't drift back.
    //   big     page titles, your name
    //   medium  nav, section labels, item titles (also the body default)
    //   small   descriptions, dates, metadata
    // The footer wordmark is a graphic, not text — it sizes itself in Footer.tsx.
    fontSize: {
      big: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
      medium: ["1rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
      small: ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["Georgia", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        selected: {
          DEFAULT: "hsl(var(--selected))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
