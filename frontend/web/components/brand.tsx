import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Kuentra, inicio">
      <span className="grid size-8 place-items-center rounded-[8px] bg-brand text-[13px] font-extrabold tracking-[-0.12em] text-white transition-transform duration-300 group-hover:-rotate-3">
        K
      </span>
      <span className={`font-display text-[19px] font-semibold tracking-[-0.04em] ${inverse ? "text-white" : "text-ink"}`}>
        KUENTRA
      </span>
    </Link>
  );
}
