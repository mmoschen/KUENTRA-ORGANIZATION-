"use client";

import { Check, ExternalLink, LoaderCircle, LogOut, ShieldCheck, Star, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Review = {
  id: string;
  displayName: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  hasProof: boolean;
  createdAt: string;
};

type SessionState = "checking" | "signed-out" | "signed-in";

export function AdminReviewsPanel() {
  const [session, setSession] = useState<SessionState>("checking");
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/reviews?status=PENDING", { cache: "no-store" });
      if (response.status === 401) {
        setSession("signed-out");
        return;
      }
      const payload = await response.json() as Review[] | { message?: string };
      if (!response.ok || !Array.isArray(payload)) throw new Error("No se pudieron cargar las opiniones.");
      setReviews(payload);
      setSession("signed-in");
    } catch (error) {
      setSession("signed-in");
      setNotice(error instanceof Error ? error.message : "No se pudo cargar el panel.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ authenticated: boolean }>)
      .then(({ authenticated }) => {
        if (!authenticated) setSession("signed-out");
        else void loadReviews();
      })
      .catch(() => setSession("signed-out"));
  }, [loadReviews]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json() as { message?: string };
      if (!response.ok) throw new Error(payload.message ?? "No se pudo iniciar sesión.");
      setPassword("");
      await loadReviews();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    setIsLoading(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json() as { message?: string };
      if (!response.ok) throw new Error(payload.message ?? "No se pudo actualizar la opinión.");
      setReviews((current) => current.filter((review) => review.id !== id));
      setNotice(status === "APPROVED" ? "Opinión aprobada y publicada." : "Opinión rechazada.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo actualizar la opinión.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setReviews([]);
    setSession("signed-out");
  };

  if (session === "checking") return <div className="grid min-h-64 place-items-center"><LoaderCircle className="size-6 animate-spin text-brand" /></div>;

  if (session === "signed-out") {
    return (
      <form onSubmit={login} className="mx-auto mt-20 max-w-sm rounded-card border border-line bg-white p-7 shadow-[0_16px_45px_rgba(12,56,104,.08)]">
        <ShieldCheck className="size-6 text-brand" />
        <h1 className="mt-4 font-display text-3xl font-medium tracking-[-.055em] text-ink">Panel de opiniones</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Ingresá con la contraseña administrativa para moderar las opiniones pendientes.</p>
        <label className="mt-6 block text-sm font-bold text-ink">
          Contraseña
          <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 h-11 w-full rounded-lg border border-line bg-canvas px-3 outline-none focus:border-brand" />
        </label>
        {notice && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{notice}</p>}
        <button disabled={isLoading} className="button button-primary mt-5 w-full disabled:opacity-60">{isLoading ? "Ingresando…" : "Ingresar al panel"}</button>
      </form>
    );
  }

  return (
    <div className="site-container py-28">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
        <div>
          <p className="eyebrow text-brand">Administración</p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-[-.07em] text-ink">Opiniones pendientes</h1>
        </div>
        <button type="button" onClick={logout} className="button button-secondary h-10 min-h-10 px-4"><LogOut className="size-4" /> Salir</button>
      </div>
      {notice && <p className="mt-5 rounded-lg bg-ice p-3 text-sm font-semibold text-brand-dark">{notice}</p>}
      {isLoading && <p className="mt-5 flex items-center gap-2 text-sm text-muted"><LoaderCircle className="size-4 animate-spin" /> Actualizando…</p>}
      {reviews.length === 0 && !isLoading ? <p className="py-16 text-center text-muted">No hay opiniones pendientes para revisar.</p> : (
        <div className="mt-8 grid gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-card border border-line bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1" aria-label={`${review.rating} estrellas`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < review.rating ? "fill-brand text-brand" : "text-line"}`} />)}</div>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-.045em] text-ink">{review.displayName}</h2>
                </div>
                <time className="text-xs text-muted">{new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(review.createdAt))}</time>
              </div>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">{review.comment}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                {review.hasProof && <a href={`/api/admin/reviews/${review.id}/proof`} target="_blank" rel="noreferrer" className="button button-secondary h-10 min-h-10 px-4"><ExternalLink className="size-4" /> Ver captura</a>}
                <button disabled={isLoading} type="button" onClick={() => void updateReview(review.id, "APPROVED")} className="button button-primary h-10 min-h-10 px-4"><Check className="size-4" /> Aprobar</button>
                <button disabled={isLoading} type="button" onClick={() => void updateReview(review.id, "REJECTED")} className="button h-10 min-h-10 border border-red-200 bg-red-50 px-4 text-red-700"><X className="size-4" /> Rechazar</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
