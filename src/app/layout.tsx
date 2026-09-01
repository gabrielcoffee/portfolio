import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "~/components/ThemeProvider";
import Header from "~/components/Header";
import { site } from "~/data/site";
import "~/styles/globals.css";

/* Aeonik ships as static weights, so each cut is declared on its own. The
   site only reaches for 400/500/600, plus 700 and italics for prose. */
const aeonik = localFont({
  src: [
    { path: "../fonts/Aeonik-Regular.woff2", weight: "400", style: "normal" },
    {
      path: "../fonts/Aeonik-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    { path: "../fonts/Aeonik-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Aeonik-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Aeonik-Bold.woff2", weight: "700", style: "normal" },
    {
      path: "../fonts/Aeonik-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.fullName,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={aeonik.variable}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="flex min-h-dvh flex-col">
            {/* pt matches the header's own mb, so it sits in even air. */}
            <main className="mx-auto w-full max-w-[40rem] flex-1 px-6 pb-16 pt-12 md:px-0">
              <Header />
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
