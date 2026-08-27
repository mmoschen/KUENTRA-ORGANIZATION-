import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { FAQ, FeaturedProducts, FinalCTA, HowItWorks, Testimonials } from "@/components/sections";
import { WhatsAppButton } from "@/components/whatsapp-button";
import type { OfficialDollarRate } from "@kuentra/shared";

const pricingApiUrl = process.env.KUENTRA_API_URL ?? "http://localhost:4000";

async function getOfficialDollarRate(): Promise<OfficialDollarRate | undefined> {
  try {
    const response = await fetch(`${pricingApiUrl}/pricing/reference`, { next: { revalidate: 60 * 60 } });
    if (!response.ok) return undefined;
    return response.json() as Promise<OfficialDollarRate>;
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const officialDollarRate = await getOfficialDollarRate();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedProducts officialDollarRate={officialDollarRate} />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
