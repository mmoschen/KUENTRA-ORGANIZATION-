import { ArrowDown, ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";
import { BrandMark } from "./brand";
import { OrbitCursorTrail } from "./orbit-cursor-trail";

export function Hero() {
  return (
    <section className="hero-grid relative flex min-h-[900px] items-center overflow-hidden bg-ice pt-28 md:min-h-[920px]">
      <div className="site-container relative z-10 grid items-center gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-dark backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand shadow-[0_0_0_4px_rgba(76,157,219,0.12)]" />
            Servicios digitales / Argentina
          </div>
          <h1 className="mt-9 max-w-[760px] font-display text-[clamp(3.5rem,5.2vw,6.25rem)] font-medium leading-[0.92] tracking-[-0.078em] text-ink">
            <span className="block">Tus servicios</span>
            <span className="block">digitales.</span>
            <span className="block text-brand">Más simples.</span>
            <span className="block">Más accesibles.</span>
          </h1>
          <p className="mt-8 max-w-xl text-[17px] leading-7 text-muted md:text-xl md:leading-8">Accedé a herramientas como ChatGPT, Gemini, CapCut y más desde un solo lugar.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#productos" className="button button-primary">Ver productos <ArrowRight className="size-4" /></a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="button button-secondary"><MessageCircle className="size-4" /> Hablar por WhatsApp</a>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-5">
            <span className="eyebrow flex items-center gap-2 text-muted"><BadgeCheck className="size-3.5 text-brand" /> Activación rápida</span>
            <span className="eyebrow flex items-center gap-2 text-muted"><BadgeCheck className="size-3.5 text-brand" /> Soporte real</span>
          </div>
        </div>
        <div className="hero-console relative mx-auto aspect-[0.92] w-full max-w-[530px] lg:justify-self-end">
          <div className="absolute inset-[9%] rounded-full border border-brand/20" />
          <div className="absolute inset-[20%] rounded-full border border-brand/15" />
          <div className="absolute left-1/2 top-1/2 grid size-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand/15 bg-white text-ink shadow-[0_25px_70px_rgba(12,56,104,0.18)] md:size-48">
            <div className="text-center">
              <BrandMark className="mx-auto size-16 md:size-20" />
              <p className="mt-3 font-brand text-lg font-semibold tracking-[-0.055em]">Kuentra</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">Digital hub</p>
            </div>
          </div>
          {[
            ["ChatGPT", "AI / 01", "left-[2%] top-[18%]"],
            ["Gemini", "AI / 02", "right-[0%] top-[31%]"],
            ["CapCut", "DESIGN / 03", "bottom-[13%] right-[4%]"],
            ["Canva", "DESIGN / 04", "bottom-[9%] left-[3%]"],
            ["Disney+", "STREAM / 06", "right-[19%] top-[12%]", "hero-orbit-deep"],
          ].map(([name, code, position, depth]) => (
            <div key={name} className={`absolute ${position} ${depth ?? ""} min-w-[126px] rounded-xl border border-line bg-white/90 p-3.5 shadow-[0_12px_40px_rgba(12,56,104,0.08)] backdrop-blur md:min-w-[148px]`}>
              <p className="font-display text-sm font-bold tracking-[-0.035em] text-ink">{name}</p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.13em] text-muted">{code}</p>
            </div>
          ))}
          <div className="absolute inset-x-[8%] bottom-0 flex items-center justify-between border-t border-ink/10 pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
            <span>Servicios activos</span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-grid h-2 w-3 overflow-hidden rounded-[1px] border border-ink/10 bg-white">
                <i className="bg-[#75c9ee]" />
                <i className="bg-white" />
                <i className="bg-[#75c9ee]" />
              </span>
              Argentina
            </span>
          </div>
          <OrbitCursorTrail />
        </div>
      </div>
      <a href="#productos" aria-label="Bajar a productos" className="absolute bottom-6 left-1/2 z-20 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-ink/15 text-ink/60 transition-colors hover:border-brand hover:text-brand">
        <ArrowDown className="size-4" />
      </a>
    </section>
  );
}
