import Image from "next/image";
import Link from "next/link";

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image
        src="/kuentra-mark.svg"
        alt=""
        fill
        sizes="80px"
        className="object-contain"
        priority
      />
    </span>
  );
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2" aria-label="Kuentra, inicio">
      <span className="transition-transform duration-300 group-hover:-rotate-2"><BrandMark /></span>
      <span className={`font-brand text-[17px] font-semibold tracking-[-0.055em] ${inverse ? "text-white" : "text-ink"}`}>
        Kuentra
      </span>
    </Link>
  );
}
