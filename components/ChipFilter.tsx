"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CHIPS = [
  { label: "All", value: "" },
  { label: "Interaction", value: "interaction" },
  { label: "Cursor", value: "cursor" },
  { label: "Scroll", value: "scroll" },
  { label: "Physics", value: "physics" },
  { label: "UI", value: "ui" },
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
];

export function ChipFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("tag", value);
    } else {
      params.delete("tag");
    }
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map(({ label, value }) => (
        <button
          key={value || "all"}
          onClick={() => handleClick(value)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTag === value
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "border border-gray-200 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
