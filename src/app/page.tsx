import { Container } from "@/components/ui/Container";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProofStrip } from "@/components/home/ProofStrip";
import { TermsBand } from "@/components/home/TermsBand";
import { SampleKit } from "@/components/home/SampleKit";
import { FinalCta } from "@/components/home/FinalCta";
import { ProductDial } from "@/components/dial/ProductDial";
import { PROCESS_STEPS } from "@/data/process";
import { getCategories, getProductsByCategory } from "@/lib/catalog";
import { toDialItems } from "@/lib/dial";

export default function Home() {
  const categories = getCategories();
  const counts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
  return (
    <>
      <Hero>
        <ProductDial items={toDialItems()} />
      </Hero>
      <ProofStrip />
      <section className="py-20">
        <Container>
          <h2>What we export</h2>
          <div className="mt-10"><CategoryGrid categories={categories} counts={counts} /></div>
        </Container>
      </section>
      <section className="py-20">
        <Container>
          <h2>How an order works</h2>
          <div className="mt-10"><ProcessSteps steps={PROCESS_STEPS} /></div>
        </Container>
      </section>
      <TermsBand />
      <SampleKit />
      <FinalCta />
    </>
  );
}
