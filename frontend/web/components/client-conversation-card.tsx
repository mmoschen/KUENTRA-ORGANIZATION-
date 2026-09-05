"use client";

import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { FocusEvent, useEffect, useState } from "react";
import type { ClientConversation } from "@/data/client-conversations";

const AUTOPLAY_DELAY_MS = 3500;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export function ClientConversationCard({ conversation }: { conversation: ClientConversation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const slideCount = conversation.screenshots.length;
  const isPaused = isHovered || hasFocusWithin || prefersReducedMotion;

  useEffect(() => {
    if (slideCount < 2 || isPaused) return;

    const timeoutId = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, isPaused, slideCount]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHasFocusWithin(false);
    }
  };

  if (slideCount === 0) return null;

  return (
    <article
      className="overflow-hidden rounded-card border border-line bg-canvas"
      aria-label={`${conversation.label}: ${conversation.verificationLabel}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={handleBlur}
    >
      <header className="flex items-center justify-between gap-4 px-5 py-5 md:px-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark">
          {conversation.label}
        </p>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark">
          <BadgeCheck className="size-4 text-brand" aria-hidden="true" />
          {conversation.verificationLabel}
        </p>
      </header>

      <div className="px-4 md:px-5">
        <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-ink">
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)]"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {conversation.screenshots.map((screenshot, index) => (
              <div
                key={screenshot.src}
                className="relative h-full min-w-full"
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  unoptimized
                  className={`select-none ${screenshot.fit === "cover" ? "object-cover" : "object-contain"}`}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex min-h-14 items-center justify-center px-5 py-4">
        {slideCount > 1 && (
          <div className="flex items-center gap-3" aria-label={`Capturas de ${conversation.label}`}>
            {conversation.screenshots.map((screenshot, index) => (
              <button
                key={screenshot.src}
                type="button"
                className={`size-2 rounded-full transition-colors ${index === activeIndex ? "bg-brand" : "bg-line hover:bg-muted/50"}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Mostrar captura ${index + 1} de ${slideCount}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
