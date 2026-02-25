import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        Hyunjin Kwon{" "}
        <span className="text-base font-normal text-gray-500 italic dark:text-gray-400">
          · CSS & Animation
        </span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
