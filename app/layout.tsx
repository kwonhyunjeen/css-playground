import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
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
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <aside className="sticky top-0 h-[calc(100vh-57px)] overflow-y-auto border-r border-gray-200 dark:border-gray-800">
                <Sidebar />
              </aside>
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
