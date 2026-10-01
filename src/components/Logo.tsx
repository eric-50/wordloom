export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#1E1631" />
        <path d="M8 11.5h16M8 16h11M8 20.5h16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="18.5" y="14" width="7" height="4" rx="2" fill="#FFE45C" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">Wordloom</span>
    </span>
  );
}
