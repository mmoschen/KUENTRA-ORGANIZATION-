import type { OfficialDollarRate, Product } from "@kuentra/shared";
import { ArrowUpRight, Clapperboard, Gem, Palette, Scissors, Search, Sparkles } from "lucide-react";
import { formatPrice } from "@/data/products";

const icons = { sparkles: Sparkles, gem: Gem, scissors: Scissors, palette: Palette, search: Search, clapperboard: Clapperboard };

export function ProductCard({ product, index, officialDollarRate }: { product: Product; index: number; officialDollarRate?: OfficialDollarRate }) {
  const Icon = icons[product.icon];
  const lowestPlan = product.plans.reduce((lowest, plan) => plan.price < lowest.price ? plan : lowest);
  const price = lowestPlan.price;
  const planNames = [...new Set(product.plans.map((plan) => plan.name))].join(" / ");
  const planDurations = product.planOptions?.join(" / ") ?? [...new Set(product.plans.map((plan) => plan.duration))].join(" / ");
  const referencePrice = product.referencePriceUsd && officialDollarRate
    ? Math.round((product.referencePriceUsd * officialDollarRate.arsPerUsd * (1 + officialDollarRate.foreignServicePerceptionRate)) / 100) * 100
    : product.referencePriceArs;
  const prominent = index === 0;
  const referencePriceStyle = prominent
    ? "border-white/12 bg-white/[0.055] text-white"
    : "border-ink/10 bg-ink/[0.025] text-ink";
  const kuentraPriceStyle = prominent
    ? "border-white/15 bg-white/10 text-white"
    : "border-brand/20 bg-brand/[0.06] text-brand-dark";
  const referenceDetail = product.referencePriceUsd && officialDollarRate
    ? `USD ${product.referencePriceUsd} + ${officialDollarRate.foreignServicePerceptionRate * 100}%`
    : "ARS · mensual";
  const referenceSource = product.referencePriceUsd ? "Dólar BCRA" : "Tarifa local";

  return (
    <article className={`product-card group ${prominent ? "product-card--prominent" : ""}`}>
      <div className="flex items-start justify-between gap-5">
        <span className="eyebrow !text-current/55">{product.category} / {String(index + 1).padStart(2, "0")}</span>
        {product.badge && (
          <span className={product.badge === "Más elegido"
            ? "inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-dark shadow-[0_8px_20px_rgba(7,27,46,0.16)]"
            : "rounded-full border border-current/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"}
          >
            {product.badge === "Más elegido" && <span aria-hidden="true" className="size-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(76,157,219,0.18)]" />}
            {product.badge}
          </span>
        )}
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
      <div className="mt-10 grid grid-cols-2 gap-3 border-t border-current/12 pt-5">
        <div className={`min-h-[92px] rounded-lg border px-3 py-2 ${referencePriceStyle}`}>
          <span className="eyebrow !text-current/50">Precio oficial</span>
          {referencePrice ? (
            <>
              <p className="mt-1 font-display text-lg font-medium tracking-[-0.04em] opacity-55 line-through">{formatPrice(referencePrice)}</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] opacity-45">{referenceDetail}</p>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.1em] opacity-45">{referenceSource}</p>
            </>
          ) : <p className="mt-1 text-sm opacity-45">Actualizando...</p>}
        </div>
        <div className={`min-h-[92px] rounded-lg border px-3 py-2 text-right ${kuentraPriceStyle}`}>
          <span className={`eyebrow ${prominent ? "!text-brand-light" : "!text-brand"}`}>Kuentra desde</span>
          <p className="mt-1 font-display text-xl font-semibold tracking-[-0.04em]">{formatPrice(price)}</p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] opacity-60">{planDurations}</p>
          <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.1em] opacity-60">{planNames}</p>
        </div>
      </div>
    </article>
  );
}
