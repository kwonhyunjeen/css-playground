import Link from "next/link";
import { Search } from "lucide-react";
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
      <div className="flex items-center gap-3">
        <div className="relative flex w-56 items-center transition-all duration-300 focus-within:w-72">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search projects..."
            className="w-full rounded-md border border-gray-200 bg-transparent py-1.5 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:outline-none dark:border-gray-700"
          />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
