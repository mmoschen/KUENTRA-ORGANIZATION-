import { ArrowUpRight, Camera, MessageCircle } from "lucide-react";
import { Brand } from "./brand";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="site-container py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div>
            <Brand />
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">Servicios digitales, atención cercana y una experiencia simple de principio a fin.</p>
          </div>
          <div>
            <p className="eyebrow text-muted">Navegación</p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-ink">
              <a href="#productos">Productos</a><a href="#como-funciona">Cómo funciona</a><a href="#preguntas">Preguntas frecuentes</a>
            </div>
          </div>
          <div>
            <p className="eyebrow text-muted">Contacto</p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-ink">
              <a className="flex items-center gap-2" href="https://wa.me/5493624203266?text=Hola%2C%20vengo%20desde%20la%20p%C3%A1gina%20de%20Kuentra%20y%20quer%C3%ADa%20hacer%20una%20consulta."><MessageCircle className="size-4 text-brand" /> WhatsApp <ArrowUpRight className="size-3" /></a>
              <a className="flex items-center gap-2" href="https://www.instagram.com/kuentra_ar/"><Camera className="size-4 text-brand" /> Instagram <ArrowUpRight className="size-3" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Kuentra. Todos los derechos reservados.</span><span>Hecho para avanzar / Argentina</span>
        </div>
      </div>
    </footer>
  );
}
