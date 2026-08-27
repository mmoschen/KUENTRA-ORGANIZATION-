export type ProductCategory = "IA" | "Diseño" | "Productividad" | "Streaming";

export interface Plan {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  icon: "sparkles" | "gem" | "scissors" | "palette" | "search" | "clapperboard";
  featured: boolean;
  badge?: string;
  referencePriceUsd?: number;
  referencePriceArs?: number;
  planOptions?: string[];
  plans: Plan[];
}

export interface OfficialDollarRate {
  source: "BCRA";
  arsPerUsd: number;
  foreignServicePerceptionRate: number;
  rateDate: string;
  fetchedAt: string;
}
