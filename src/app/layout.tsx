import type { Metadata } from "next";
import localFont from "next/font/local";
import { Albert_Sans, Nanum_Myeongjo } from "next/font/google";
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

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* Not variable, so the weight is picked here. Headings only. No accented
   Latin in this font, so keep titles accent-free. */
const nanumMyeongjo = Nanum_Myeongjo({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  // Link previews need absolute URLs, e.g. for opengraph-image.png.
  metadataBase: new URL("https://www.gabrielfp.com"),
  title: site.fullName,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${aeonik.variable} ${albertSans.variable} ${nanumMyeongjo.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col">
          <main className="mx-auto w-full max-w-[40rem] flex-1 px-8 pb-16 pt-6 md:px-0 md:pt-14">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
