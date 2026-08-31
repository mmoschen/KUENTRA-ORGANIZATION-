import { ArrowUpRight, Menu, MessageCircle } from "lucide-react";
import { Brand } from "./brand";

const nav = [
  ["Productos", "#productos"],
  ["Cómo funciona", "#como-funciona"],
  ["Opiniones", "#opiniones"],
  ["Preguntas frecuentes", "#preguntas"],
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between rounded-[14px] border border-white/10 bg-ink/95 px-3.5 shadow-[0_12px_35px_rgba(4,20,38,0.14)] backdrop-blur-xl sm:px-4">
        <Brand inverse />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {nav.map(([label, href]) => (
            <a key={href} href={href} className="text-[13px] font-semibold text-white/72 transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <a
          className="hidden h-10 items-center gap-2 rounded-[9px] bg-white px-4 text-[13px] font-bold text-ink transition-transform hover:-translate-y-0.5 sm:inline-flex"
          href="https://wa.me/5493624203266?text=Hola%2C%20vengo%20desde%20la%20p%C3%A1gina%20de%20Kuentra%20y%20quer%C3%ADa%20hacer%20una%20consulta."
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="size-4" /> WhatsApp <ArrowUpRight className="size-3.5" />
        </a>
        <details className="group relative sm:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-[9px] bg-white/10 text-white [&::-webkit-details-marker]:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Abrir navegación</span>
          </summary>
          <nav className="absolute right-0 top-12 flex w-[min(82vw,320px)] flex-col rounded-xl border border-white/10 bg-ink p-2 shadow-2xl">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">
                {label}
              </a>
            ))}
            <a href="https://wa.me/5493624203266?text=Hola%2C%20vengo%20desde%20la%20p%C3%A1gina%20de%20Kuentra%20y%20quer%C3%ADa%20hacer%20una%20consulta." className="mt-2 rounded-lg bg-brand px-4 py-3 text-center text-sm font-bold text-white">
              Hablar por WhatsApp
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
