import { Marquee } from "@/components/Marquee";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Marquee />
      <Header />
      <main className="px-6 py-10">{children}</main>
      <Footer />
    </>
  );
}
