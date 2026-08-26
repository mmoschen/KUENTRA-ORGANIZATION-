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
  icon: "sparkles" | "gem" | "scissors" | "palette" | "search";
  featured: boolean;
  badge?: string;
  plans: Plan[];
}
