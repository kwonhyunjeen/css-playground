import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Marquee } from "@/components/Marquee";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "css-playground",
  description:
    "A personal collection of CSS and JavaScript animation experiments.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-w-[748px]" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          <Marquee />
          <Header />
          <main className="px-6 py-10">{children}</main>
          {modal}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
