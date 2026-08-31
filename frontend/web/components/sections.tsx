import { ArrowRight, CreditCard, KeyRound, MessageCircle, MousePointer2, Sparkles, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/products";
import { faqs, testimonials } from "@/data/content";
import { ProductCard } from "./product-card";
import { ReviewsExperience } from "./reviews-experience";
import type { OfficialDollarRate } from "@kuentra/shared";

export function FeaturedProducts({ officialDollarRate }: { officialDollarRate?: OfficialDollarRate }) {
  return (
    <section id="productos" className="catalog-section scroll-mt-24">
      <div className="site-container">
        <div className="catalog-divider" aria-hidden="true" />
        <div className="section-heading-row">
          <div>
            <p className="eyebrow text-brand">Catálogo / Selección</p>
            <h2 className="section-title mt-5">Herramientas que<br />mueven tus ideas.</h2>
          </div>
          <p className="section-intro">Elegimos servicios que realmente suman a tu día. Opciones claras, acompañamiento humano y sin vueltas.</p>
        </div>
        <div className="product-grid mt-10 md:mt-20">
          {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} officialDollarRate={officialDollarRate} />)}
        </div>
        <p className="mx-auto mt-5 max-w-4xl text-center text-xs leading-5 text-muted">Las referencias en USD incluyen la percepción vigente para servicios del exterior y se calculan con el dólar vendedor informado por el BCRA. Los precios publicados en ARS corresponden a la tarifa local informada por cada plataforma.</p>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps: Array<[string, LucideIcon, string, string]> = [
    ["01", MousePointer2, "Elegís tu servicio", "Explorás las opciones y encontrás la que mejor acompaña lo que querés hacer."],
    ["02", CreditCard, "Coordinás el pago", "Confirmamos el plan, el valor y cada detalle antes de avanzar."],
    ["03", KeyRound, "Recibís tu acceso", "Te guiamos durante la activación y seguimos disponibles si necesitás ayuda."],
  ];
  return (
    <section id="como-funciona" className="section-space process-section scroll-mt-20 bg-ink text-white">
      <div className="site-container">
        <div className="section-heading-row border-white/15">
          <div>
            <p className="eyebrow text-brand-light">Proceso / 01—03</p>
            <h2 className="section-title mt-5 text-white">Simple desde<br />el primer paso.</h2>
          </div>
          <div className="flex flex-col items-center">
            <Image src="/mascota.png" alt="Mascota de Kuentra" width={1974} height={797} className="mb-2 w-52 sm:w-64 md:w-80" />
            <p className="section-intro text-center !text-white/55">Sin formularios eternos ni procesos confusos. Sabés qué sigue en cada momento.</p>
          </div>
        </div>
        <ol className="mt-12 grid border-y border-white/15 md:grid-cols-3">
          {steps.map(([number, Icon, title, copy]) => (
            <li key={number} className="group min-h-56 border-white/15 px-1 py-8 text-center md:min-h-64 md:border-r md:px-8 md:text-left md:first:pl-0 md:last:border-r-0">
              <div className="flex items-center justify-center gap-3 md:justify-between">
                <span className="font-mono text-xs tracking-[0.18em] text-brand-light">{number}</span>
                <Icon className="size-5 text-brand-light" strokeWidth={1.7} />
              </div>
              <div className="mt-9 md:mt-14">
                <h3 className="font-display text-2xl font-medium tracking-[-0.04em]">{title}</h3>
                <p className="mx-auto mt-4 max-w-xs text-[15px] leading-6 text-white/50 md:mx-0">{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="opiniones" className="testimonials-section scroll-mt-20 border-t border-line bg-white">
      <div className="site-container">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow text-brand">Opiniones / Comunidad</p>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(3rem,4.8vw,5.25rem)] font-medium leading-[.94] tracking-[-0.07em] text-ink">Lo simple se nota.</h2>
          </div>
          <p className="section-intro">Experiencias de personas que usan Kuentra para estudiar, crear y trabajar mejor.</p>
        </div>
        <ReviewsExperience fallback={testimonials} />
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="preguntas" className="section-space scroll-mt-20 bg-canvas">
      <div className="site-container grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <div className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
          <p className="eyebrow text-brand">Preguntas frecuentes</p>
          <h2 className="section-title mx-auto mt-5 lg:mx-0">Antes de<br />empezar.</h2>
          <p className="mx-auto mt-7 max-w-sm text-[15px] leading-6 text-muted lg:mx-0">Si te queda alguna duda, escribinos. Te ayudamos a elegir sin compromiso.</p>
        </div>
        <div className="border-t border-line">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="faq group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-7 sm:gap-5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-3 sm:gap-5">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-brand">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl font-semibold tracking-[-0.035em] text-ink">{faq.question}</span>
                </span>
                <span className="relative size-5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-ink after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-ink after:transition-transform group-open:after:rotate-90" />
              </summary>
              <p className="max-w-2xl pb-7 pl-7 text-[15px] leading-7 text-muted sm:pl-10">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="contacto" className="bg-canvas px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[22px] bg-brand px-5 py-20 text-white md:px-14 md:py-28">
        <div className="site-container !px-0 text-center md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <Sparkles className="size-4" />
            <p className="eyebrow !text-white/70">Tu próximo servicio digital</p>
          </div>
          <h2 className="mx-auto mt-8 max-w-5xl font-display text-[clamp(3.1rem,7.8vw,7.6rem)] font-medium leading-[0.86] tracking-[-0.075em] md:mx-0">Todo listo para<br />dar el próximo paso.</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-3 md:justify-start">
            <a href="#productos" className="button button-light max-sm:w-full">Ver productos <ArrowRight className="size-4" /></a>
            <a href="https://wa.me/5493624203266?text=Hola%2C%20vengo%20desde%20la%20p%C3%A1gina%20de%20Kuentra%20y%20quer%C3%ADa%20hacer%20una%20consulta." target="_blank" rel="noreferrer" className="button border border-white/25 text-white hover:bg-white/10 max-sm:w-full"><MessageCircle className="size-4" /> Hablar por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
