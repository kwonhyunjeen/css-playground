"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useRef } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.set("q", value);
      router.replace(`/?${params.toString()}`);
    }, 300);
  };

  return (
    <div className="relative flex w-56 items-center transition-all duration-300 focus-within:w-72">
      <Search className="absolute left-3 h-4 w-4 text-gray-400" />
      <input
        type="search"
        placeholder="Search projects..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-200 bg-transparent py-1.5 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:outline-none dark:border-gray-700"
      />
    </div>
  );
}
