import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-gray-900 dark:text-gray-100">css-playground</p>
      <ThemeToggle />
    </main>
  );
}
