"use client";

import { Check, LoaderCircle, Star, X } from "lucide-react";
import { FormEvent, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_KUENTRA_API_URL ?? "http://localhost:4000";

export function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [startedAt, setStartedAt] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const openForm = () => {
    setStartedAt(new Date().toISOString());
    setStatus("idle");
    setMessage("");
    setIsOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const proof = data.get("proof");
    if (proof instanceof File && proof.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("La captura puede pesar hasta 5 MB.");
      return;
    }

    data.set("rating", String(rating));
    data.set("startedAt", startedAt);
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(`${apiUrl}/reviews`, { method: "POST", body: data });
      const payload = await response.json().catch(() => null) as { message?: string | string[] } | null;
      if (!response.ok) {
        const error = Array.isArray(payload?.message) ? payload?.message[0] : payload?.message;
        throw new Error(error ?? "No pudimos enviar tu opinión. Probá de nuevo más tarde.");
      }
      form.reset();
      setRating(5);
      setStatus("success");
      setMessage("¡Gracias! Tu opinión quedó pendiente de verificación antes de publicarse.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No pudimos enviar tu opinión.");
    }
  };

  return (
    <>
      <button type="button" onClick={openForm} className="button button-secondary h-11 min-h-11 px-4">
        Dejá tu opinión
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="review-form-title" className="w-full max-w-lg rounded-card border border-line bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-brand">Opinión verificada</p>
                <h2 id="review-form-title" className="mt-3 font-display text-3xl font-medium tracking-[-0.055em] text-ink">Contanos tu experiencia.</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:text-ink" aria-label="Cerrar formulario">
                <X className="size-4" />
              </button>
            </div>

            {status === "success" ? (
              <div className="mt-8 rounded-xl border border-brand/25 bg-ice p-5 text-center">
                <Check className="mx-auto size-6 text-brand" />
                <p className="mt-3 text-sm font-semibold leading-6 text-ink">{message}</p>
              </div>
            ) : (
              <form className="mt-7 space-y-5" onSubmit={submit}>
                <label className="block text-sm font-bold text-ink">
                  Tu nombre
                  <input required name="displayName" minLength={2} maxLength={80} autoComplete="name" className="mt-2 h-11 w-full rounded-lg border border-line bg-canvas px-3 text-sm font-medium outline-none transition-colors focus:border-brand" placeholder="Ej.: Martina R." />
                </label>
                <fieldset>
                  <legend className="text-sm font-bold text-ink">Tu calificación</legend>
                  <div className="mt-2 flex gap-1" aria-label={`${rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1;
                      return <button key={value} type="button" onClick={() => setRating(value)} className="rounded p-1 text-brand transition-transform hover:scale-110" aria-label={`${value} estrellas`}><Star className={`size-6 ${value <= rating ? "fill-brand" : "fill-transparent text-line"}`} /></button>;
                    })}
                  </div>
                </fieldset>
                <label className="block text-sm font-bold text-ink">
                  Comentario
                  <textarea required name="comment" minLength={12} maxLength={1000} rows={4} className="mt-2 w-full resize-y rounded-lg border border-line bg-canvas p-3 text-sm leading-6 outline-none transition-colors focus:border-brand" placeholder="¿Cómo fue tu experiencia con Kuentra?" />
                </label>
                <label className="block text-sm font-bold text-ink">
                  Captura de la entrega <span className="font-normal text-muted">(opcional)</span>
                  <input name="proof" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-ice file:px-3 file:py-2 file:text-xs file:font-bold file:text-brand-dark" />
                  <span className="mt-1 block text-xs font-normal text-muted">JPG, PNG o WEBP · hasta 5 MB. Solo la verá el equipo de Kuentra.</span>
                </label>
                <input name="website" tabIndex={-1} autoComplete="off" className="absolute h-px w-px opacity-0" aria-hidden="true" />
                {status === "error" && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{message}</p>}
                <button disabled={status === "sending"} className="button button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
                  {status === "sending" ? <><LoaderCircle className="size-4 animate-spin" /> Enviando</> : "Enviar para verificación"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
