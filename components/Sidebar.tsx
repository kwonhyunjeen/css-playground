"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

export function Sidebar() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isActive = (slug: string) => pathname.startsWith(`/${slug}`);

  return (
    <nav className="w-56 shrink-0 p-4">
      <ul className="space-y-1">
        <li>
          <Link
            href="/"
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              isHome
                ? "bg-gray-100 font-medium dark:bg-gray-800"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            All
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/${cat.slug}`}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                isActive(cat.slug)
                  ? "bg-gray-100 font-medium dark:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
