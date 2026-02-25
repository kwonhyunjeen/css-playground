const TEXT = "Fun CSS Animations · ".repeat(20);

export function Marquee() {
  return (
    <div className="overflow-hidden bg-neutral-200 py-4 dark:bg-neutral-900">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <span className="text-sm font-light tracking-widest text-neutral-700 dark:text-neutral-500">
          {TEXT}
        </span>
        <span
          aria-hidden
          className="text-sm font-light tracking-widest text-neutral-700 dark:text-neutral-500"
        >
          {TEXT}
        </span>
      </div>
    </div>
  );
}
