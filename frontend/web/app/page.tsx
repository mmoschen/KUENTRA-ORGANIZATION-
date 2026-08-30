import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { FAQ, FeaturedProducts, FinalCTA, HowItWorks, Testimonials } from "@/components/sections";
import { WhatsAppButton } from "@/components/whatsapp-button";
import type { OfficialDollarRate } from "@kuentra/shared";

const pricingApiUrl = process.env.KUENTRA_API_URL ?? "http://localhost:4000";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kuentra.com.ar/#organization",
      name: "Kuentra",
      url: "https://kuentra.com.ar/",
      logo: "https://kuentra.com.ar/kuentra-mark.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://kuentra.com.ar/#website",
      name: "Kuentra",
      url: "https://kuentra.com.ar/",
      inLanguage: "es",
      publisher: { "@id": "https://kuentra.com.ar/#organization" },
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
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
