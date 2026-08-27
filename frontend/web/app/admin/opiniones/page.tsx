import type { Metadata } from "next";
import { AdminReviewsPanel } from "@/components/admin-reviews-panel";

export const metadata: Metadata = { title: "Panel de opiniones", robots: { index: false, follow: false } };

export default function AdminReviewsPage() {
  return <main className="min-h-screen bg-canvas"><AdminReviewsPanel /></main>;
}
