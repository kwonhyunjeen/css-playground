import { RefObject, useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: (event?: PointerEvent) => void,
) {
  useEffect(() => {
    function handleEvent(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick(e);
      }
    }

    document.addEventListener("pointerdown", handleEvent);
    return () => document.removeEventListener("pointerdown", handleEvent);
  }, [ref, onOutsideClick]);
}
