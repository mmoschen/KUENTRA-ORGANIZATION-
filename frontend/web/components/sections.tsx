import { ArrowRight, BadgeCheck, Bolt, Headphones, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { faqs, testimonials } from "@/data/content";
import { ProductCard } from "./product-card";
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
        <div className="product-grid mt-14 md:mt-20">
          {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} officialDollarRate={officialDollarRate} />)}
        </div>
        <p className="mt-5 text-xs leading-5 text-muted">Las referencias en USD incluyen la percepción vigente para servicios del exterior y se calculan con el dólar vendedor informado por el BCRA. Los precios publicados en ARS corresponden a la tarifa local informada por cada plataforma.</p>
        <div className="mt-8 flex justify-end">
          <a className="text-link" href="#contacto">Explorar todos los servicios <ArrowRight className="size-4" /></a>
        </div>
      </div>
    </section>
  );
}

export function BrandStatement() {
  return (
    <section className="overflow-hidden border-y border-line bg-white py-28 md:py-44">
      <div className="site-container">
        <p className="eyebrow text-muted">Una forma más simple</p>
        <h2 className="brand-statement mt-8">
          <span className="block">Todo lo que usás.</span>
          <span className="block">En un solo lugar.</span>
        </h2>
        <div className="mt-14 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_1fr_1fr]">
          <p className="eyebrow text-muted">Kuentra / Digital services</p>
          <p className="max-w-sm text-lg leading-7 text-ink">Menos tiempo comparando opciones. Más tiempo usando herramientas que te ayudan a avanzar.</p>
          <p className="max-w-sm text-[15px] leading-6 text-muted md:justify-self-end">Una experiencia organizada para acceder, activar y resolver todo desde el mismo lugar.</p>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    ["01", "Elegís tu servicio", "Explorás las opciones y encontrás la que mejor acompaña lo que querés hacer."],
    ["02", "Coordinás el pago", "Confirmamos el plan, el valor y cada detalle antes de avanzar."],
    ["03", "Recibís tu acceso", "Te guiamos durante la activación y seguimos disponibles si necesitás ayuda."],
  ];
  return (
    <section id="como-funciona" className="section-space scroll-mt-20 bg-ink text-white">
      <div className="site-container">
        <div className="section-heading-row border-white/15">
          <div>
            <p className="eyebrow text-brand-light">Proceso / 01—03</p>
            <h2 className="section-title mt-5 text-white">Simple desde<br />el primer paso.</h2>
          </div>
          <p className="section-intro !text-white/55">Sin formularios eternos ni procesos confusos. Sabés qué sigue en cada momento.</p>
        </div>
        <ol className="mt-16 grid border-y border-white/15 md:grid-cols-3">
          {steps.map(([number, title, copy]) => (
            <li key={number} className="group relative min-h-80 border-white/15 px-1 py-9 md:min-h-96 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <span className="font-mono text-xs tracking-[0.18em] text-brand-light">{number}</span>
              <div className="absolute bottom-9 left-1 right-4 md:left-8 md:first:left-0">
                <h3 className="font-display text-2xl font-medium tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 max-w-xs text-[15px] leading-6 text-white/50">{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Trust() {
  const benefits = [
    [Bolt, "Activación rápida", "Te informamos el tiempo real antes de confirmar."],
    [Headphones, "Soporte humano", "Una persona te acompaña cuando lo necesitás."],
    [ShieldCheck, "Garantía Kuentra", "Respondemos ante problemas con tu servicio."],
    [BadgeCheck, "Todo claro", "Planes, vigencia y condiciones sin letra chica."],
  ];
  return (
    <section className="section-space bg-canvas">
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-brand">Acompañamiento real</p>
          <h2 className="section-title mt-5">Tecnología, sin sentirte solo.</h2>
        </div>
        <div className="mt-14 grid border-y border-line md:grid-cols-4">
          {benefits.map(([Icon, title, copy], index) => {
            const BenefitIcon = Icon as typeof Bolt;
            return (
              <div key={title as string} className={`min-h-60 py-8 md:px-7 ${index > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
                <BenefitIcon className="size-5 text-brand" strokeWidth={1.8} />
                <h3 className="mt-16 font-display text-xl font-semibold tracking-[-0.04em]">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{copy as string}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="opiniones" className="section-space scroll-mt-20 border-t border-line bg-white">
      <div className="site-container">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow text-brand">Opiniones / Comunidad</p>
            <h2 className="section-title mt-5">Lo simple<br />se nota.</h2>
          </div>
          <p className="section-intro">Experiencias de personas que usan Kuentra para estudiar, crear y trabajar mejor.</p>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure key={testimonial.name} className="flex min-h-[330px] flex-col justify-between rounded-card border border-line bg-canvas p-7 md:p-8">
              <div>
                <span className="font-mono text-[11px] tracking-[0.16em] text-brand">KUENTRA / {String(index + 1).padStart(2, "0")}</span>
                <blockquote className="mt-8 font-display text-[22px] leading-[1.28] tracking-[-0.035em] text-ink">“{testimonial.quote}”</blockquote>
              </div>
              <figcaption className="mt-10 border-t border-line pt-5">
                <p className="text-sm font-bold text-ink">{testimonial.name}</p>
                <p className="mt-1 text-sm text-muted">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted">Testimonios de muestra — preparados para reemplazarse por opiniones verificadas.</p>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="preguntas" className="section-space scroll-mt-20 bg-canvas">
      <div className="site-container grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-brand">Preguntas frecuentes</p>
          <h2 className="section-title mt-5">Antes de<br />empezar.</h2>
          <p className="mt-7 max-w-sm text-[15px] leading-6 text-muted">Si te queda alguna duda, escribinos. Te ayudamos a elegir sin compromiso.</p>
        </div>
        <div className="border-t border-line">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="faq group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-7 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-5">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-brand">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl font-semibold tracking-[-0.035em] text-ink">{faq.question}</span>
                </span>
                <span className="relative size-5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-ink after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-ink after:transition-transform group-open:after:rotate-90" />
              </summary>
              <p className="max-w-2xl pb-7 pl-10 text-[15px] leading-7 text-muted">{faq.answer}</p>
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
        <div className="site-container !px-0">
          <div className="flex items-center gap-3">
            <Sparkles className="size-4" />
            <p className="eyebrow !text-white/70">Tu próximo servicio digital</p>
          </div>
          <h2 className="mt-8 max-w-5xl font-display text-[clamp(3.1rem,7.8vw,7.6rem)] font-medium leading-[0.86] tracking-[-0.075em]">Todo listo para<br />dar el próximo paso.</h2>
          <div className="mt-12 flex flex-wrap gap-3">
            <a href="#productos" className="button button-light">Ver productos <ArrowRight className="size-4" /></a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="button border border-white/25 text-white hover:bg-white/10"><MessageCircle className="size-4" /> Hablar por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
