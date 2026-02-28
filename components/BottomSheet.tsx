"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { FlatProject } from "@/types";

interface BottomSheetProps {
  project: FlatProject;
  onClose: () => void;
}

export function BottomSheet({ project, onClose }: BottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const titleId = `bottom-sheet-title-${project.slug}`;

  const close = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleAnimationEnd = () => {
    if (isClosing) {
      onClose();
    }
  };

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Esc key (desktop)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // Overlay click (desktop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
      close();
    }
  };

  // Touch swipe down (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80) close();
    touchStartY.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={handleBackdropClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onAnimationEnd={handleAnimationEnd}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative z-10 flex h-[85vh] w-full flex-col rounded-t-2xl bg-white dark:bg-gray-950 ${isClosing ? "animate-slide-down" : "animate-slide-up"}`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Close button (mobile) */}
        <button
          onClick={close}
          className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:text-gray-600 md:hidden dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h2 id={titleId} className="text-2xl font-semibold">
            {project.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {project.description}
          </p>

          <div className="mt-2 flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Demo placeholder */}
          <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400 dark:bg-gray-900">
            Demo coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
