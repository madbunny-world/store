// Intentional media placeholder: a card-gray block with a mono label, sized by
// the caller to the FINAL aspect ratio so the real film/photo swaps in with
// zero layout shift. Every placeholder on the site goes through this component
// so they read as deliberate, not broken.
export default function Placeholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-card ${className}`}
    >
      <span className="px-4 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-gun-metal/60">
        {label}
      </span>
    </div>
  );
}
