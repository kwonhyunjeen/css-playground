import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "css-playground",
  description: "CSS & JS 애니메이션 학습 포트폴리오",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
