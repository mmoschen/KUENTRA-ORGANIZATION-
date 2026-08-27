"use client";

import { useEffect } from "react";

const defaultTitle = "Kuentra | Servicios digitales más simples";
const awayTitles = [
  "Te estamos esperando · Kuentra",
  "No te vayas · Kuentra",
  "Las mejores opciones están acá · Kuentra",
];

export function PageTitleSwitcher() {
  useEffect(() => {
    let titleInterval: ReturnType<typeof setInterval> | undefined;

    const stopTitleMotion = () => {
      if (titleInterval) clearInterval(titleInterval);
      titleInterval = undefined;
    };

    const startTitleMotion = () => {
      stopTitleMotion();
      let offset = 0;
      const titleCarousel = `${awayTitles.join("   ·   ")}   ·   `;
      const updateTitle = () => {
        document.title = titleCarousel.slice(offset) + titleCarousel.slice(0, offset);
        offset = (offset + 1) % titleCarousel.length;
      };
      updateTitle();
      titleInterval = setInterval(updateTitle, 60);
    };

    const syncTitle = () => {
      if (document.hidden) {
        startTitleMotion();
      } else {
        stopTitleMotion();
        document.title = defaultTitle;
      }
    };

    document.addEventListener("visibilitychange", syncTitle);
    return () => {
      stopTitleMotion();
      document.removeEventListener("visibilitychange", syncTitle);
    };
  }, []);

  return null;
}
