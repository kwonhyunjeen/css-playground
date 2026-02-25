const TEXT = "Fun CSS Animations · ";

export function Marquee() {
  return (
    <div className="overflow-hidden bg-neutral-200 py-4 dark:bg-neutral-900">
      <p className="animate-marquee text-sm font-light tracking-widest whitespace-nowrap text-neutral-700 dark:text-neutral-500">
        {TEXT.repeat(10)}
      </p>
    </div>
  );
}
