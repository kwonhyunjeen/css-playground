import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "css-playground",
  description: "CSS & JS 애니메이션 학습 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider defaultTheme="system" enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
