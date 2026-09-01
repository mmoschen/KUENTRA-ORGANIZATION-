"use client";

import { ShieldCheck } from "lucide-react";
import { clientConversations } from "@/data/client-conversations";
import { ClientConversationCard } from "./client-conversation-card";

export function ReviewsExperience() {
  const hasPublishedConversations = clientConversations.length > 0;

  return (
    <>
      {hasPublishedConversations && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {clientConversations.slice(0, 3).map((conversation) => (
            <ClientConversationCard key={conversation.id} conversation={conversation} />
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-center sm:justify-between sm:text-left">
        {hasPublishedConversations && (
          <p className="flex max-w-xl items-start gap-2 text-xs leading-5 text-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-dark" aria-hidden="true" />
            <span>Capturas reales de conversaciones con clientes. Datos personales ocultos por privacidad.</span>
          </p>
        )}
        <a
          href="https://www.instagram.com/kuentra_ar/"
          target="_blank"
          rel="noreferrer"
          className="button button-secondary h-11 min-h-11 px-4"
        >
          Ver más testimonios
        </a>
      </div>
    </>
  );
}
