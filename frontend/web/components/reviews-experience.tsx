"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ReviewForm } from "./review-form";

type FallbackReview = { quote: string; name: string; role: string };
type PublishedReview = { id: string; displayName: string; rating: number; comment: string; createdAt: string };

const apiUrl = process.env.NEXT_PUBLIC_KUENTRA_API_URL ?? "http://localhost:4000";

export function ReviewsExperience({ fallback }: { fallback: FallbackReview[] }) {
  const [reviews, setReviews] = useState<PublishedReview[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/reviews`, { signal: controller.signal })
      .then(async (response) => response.ok ? response.json() as Promise<PublishedReview[]> : [])
      .then((items) => setReviews(items))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const items = reviews.length > 0
    ? reviews.map((review) => ({ id: review.id, quote: review.comment, name: review.displayName, role: "Opinión verificada", rating: review.rating }))
    : fallback.map((review, index) => ({ id: `sample-${index}`, quote: review.quote, name: review.name, role: review.role, rating: 5 }));

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.slice(0, 3).map((testimonial, index) => (
          <figure key={testimonial.id} className="flex min-h-64 flex-col justify-between rounded-card border border-line bg-canvas p-6 md:p-7">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.16em] text-brand">KUENTRA / {String(index + 1).padStart(2, "0")}</span>
                <span className="flex gap-0.5" role="img" aria-label={`Calificación de ${testimonial.rating} estrellas`}>
                  {Array.from({ length: 5 }, (_, star) => <Star key={star} className={`size-3.5 ${star < testimonial.rating ? "fill-brand text-brand" : "text-line"}`} strokeWidth={1.5} />)}
                </span>
              </div>
              <blockquote className="mt-6 font-display text-[19px] leading-[1.32] tracking-[-0.035em] text-ink">“{testimonial.quote}”</blockquote>
            </div>
            <figcaption className="mt-7 border-t border-line pt-4">
              <p className="text-sm font-bold text-ink">{testimonial.name}</p>
              <p className="mt-1 text-sm text-muted">{testimonial.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">{reviews.length > 0 ? "Opiniones publicadas luego de una verificación manual." : "Testimonios de muestra — preparados para reemplazarse por opiniones verificadas."}</p>
        <ReviewForm />
      </div>
    </>
  );
}
