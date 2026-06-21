interface SectionHeaderProps {
  number: string;
  label: string;
  title: React.ReactNode;
  className?: string;
}

export function SectionHeader({ number, label, title, className = "" }: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className="mb-3.5 flex items-center gap-3">
        <span className="font-display text-[13px] font-semibold text-text-primary/25">{number}</span>
        <div className="h-px w-7 bg-white/[0.14]" />
        <span className="section-eyebrow">{label}</span>
      </div>
      <h2 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.03em] text-text-primary">
        {title}
      </h2>
    </div>
  );
}
