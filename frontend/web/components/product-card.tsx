import type { Product } from "@kuentra/shared";
import { ArrowUpRight, Gem, Palette, Scissors, Search, Sparkles } from "lucide-react";
import { formatPrice } from "@/data/products";

const icons = { sparkles: Sparkles, gem: Gem, scissors: Scissors, palette: Palette, search: Search };

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = icons[product.icon];
  const price = Math.min(...product.plans.map((plan) => plan.price));
  const prominent = index === 0;

  return (
    <article className={`product-card group ${prominent ? "product-card--prominent" : ""}`}>
      <div className="flex items-start justify-between gap-5">
        <span className="eyebrow !text-current/55">{product.category} / {String(index + 1).padStart(2, "0")}</span>
        {product.badge && <span className="rounded-full border border-current/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">{product.badge}</span>}
      </div>
      <div className="mt-12 flex items-end justify-between gap-6 md:mt-16">
        <div>
          <div className="mb-6 grid size-12 place-items-center rounded-xl border border-current/15 bg-current/[0.035] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <Icon className="size-5.5" strokeWidth={1.7} />
          </div>
          <h3 className="font-display text-[clamp(1.8rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.055em]">{product.name}</h3>
          <p className="mt-4 max-w-[29rem] text-[15px] leading-6 opacity-65">{product.shortDescription}</p>
        </div>
        <a href="#contacto" className="grid size-11 shrink-0 place-items-center rounded-full border border-current/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white" aria-label={`Ver opciones de ${product.name}`}>
          <ArrowUpRight className="size-4.5" />
        </a>
      </div>
      <div className="mt-10 flex items-end justify-between border-t border-current/12 pt-5">
        <span className="eyebrow !text-current/45">Desde</span>
        <span className="font-display text-xl font-semibold tracking-[-0.04em]">{formatPrice(price)}</span>
      </div>
    </article>
  );
}
