import type { Product } from "@kuentra/shared";

export const products: Product[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    slug: "chatgpt-plus",
    category: "IA",
    icon: "sparkles",
    featured: true,
    badge: "Más elegido",
    referencePriceUsd: 20,
    shortDescription: "Tu asistente de IA para estudiar, trabajar y crear.",
    description: "Accedé a funciones avanzadas de inteligencia artificial con acompañamiento real de Kuentra.",
    plans: [
      { id: "chatgpt-shared", name: "Compartido", duration: "1 mes", price: 12900 },
      { id: "chatgpt-individual", name: "Individual", duration: "1 mes", price: 34900 },
    ],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    slug: "gemini-pro",
    category: "IA",
    icon: "gem",
    featured: true,
    badge: "Nuevo",
    referencePriceUsd: 19.99,
    shortDescription: "Ideas, análisis y productividad con la IA de Google.",
    description: "Una herramienta potente para investigar, redactar y resolver tareas complejas.",
    plans: [{ id: "gemini-monthly", name: "Individual", duration: "1 mes", price: 16900 }],
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro",
    slug: "capcut-pro",
    category: "Diseño",
    icon: "scissors",
    featured: true,
    referencePriceUsd: 9.99,
    shortDescription: "Edición profesional para contenido y redes sociales.",
    description: "Creá videos más rápido con herramientas premium de edición y recursos exclusivos.",
    plans: [
      { id: "capcut-monthly", name: "Mensual", duration: "1 mes", price: 9900 },
      { id: "capcut-quarter", name: "Trimestral", duration: "3 meses", price: 24900 },
    ],
  },
  {
    id: "canva-pro",
    name: "Canva Pro",
    slug: "canva-pro",
    category: "Diseño",
    icon: "palette",
    featured: true,
    referencePriceUsd: 120,
    shortDescription: "Diseñá piezas claras, rápidas y listas para publicar.",
    description: "Plantillas, recursos premium y herramientas de marca para todos tus proyectos.",
    plans: [{ id: "canva-year", name: "Individual", duration: "12 meses", price: 14900 }],
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    slug: "perplexity-pro",
    category: "Productividad",
    icon: "search",
    featured: true,
    referencePriceUsd: 20,
    shortDescription: "Investigá con fuentes y encontrá respuestas precisas.",
    description: "Búsqueda avanzada asistida por IA para aprender, comparar y decidir mejor.",
    plans: [{ id: "perplexity-monthly", name: "Pro", duration: "1 mes", price: 12900 }],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
