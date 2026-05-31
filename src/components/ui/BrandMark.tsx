interface BrandMarkProps {
  compact?: boolean;
}

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="brand-badge" aria-hidden="true">
        <span>26</span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--wc-gold)]">
            World Cup
          </span>
          <span className="block text-sm font-black tracking-wide text-white">
            Tracker
          </span>
        </span>
      )}
    </span>
  );
}
