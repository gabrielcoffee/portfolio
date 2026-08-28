import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "~/components/ThemeProvider";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
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
  title: "Gabriel Pereira",
  description: "Brazilian software engineer",
  openGraph: {
    title: "Gabriel Pereira",
    description: "Brazilian software engineer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel Pereira",
    description: "Brazilian software engineer",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="flex min-h-dvh flex-col">
            <main className="mx-auto w-full max-w-[40rem] flex-1 px-6 pt-12 sm:pt-20 md:px-0">
              <Header />
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
