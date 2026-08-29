import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "~/components/ThemeProvider";
import Header from "~/components/Header";
import { site } from "~/data/site";
import "~/styles/globals.css";

const inter = localFont({
  src: [
    {
      path: "../../node_modules/inter-ui/variable/InterVariable.woff2",
      style: "normal",
    },
    {
      path: "../../node_modules/inter-ui/variable/InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: site.fullName,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
  // Only the card style: X falls back to the og: tags for title/description.
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="flex min-h-dvh flex-col">
            {/* pt matches the header's own mb-loose, so it sits centred in its
                own band of space rather than pushed down. */}
            <main className="mx-auto w-full max-w-measure flex-1 px-wide pb-page-bottom pt-page-top md:px-0">
              <Header />
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
