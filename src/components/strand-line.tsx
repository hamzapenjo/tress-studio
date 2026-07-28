export function StrandLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M -20 60 C 200 20, 280 160, 480 120 S 780 260, 860 200"
        fill="none"
        stroke="var(--color-brass)"
        strokeWidth="1"
        className="strand-draw"
      />
    </svg>
  );
}
