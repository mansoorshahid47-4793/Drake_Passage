import { Container } from "@/components/ui/Container";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { EnquiryCategoryList } from "@/components/ui/EnquiryCategoryList";
import { OriginFigure } from "@/components/ui/OriginFigure";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProofStrip } from "@/components/home/ProofStrip";
import { TermsBand } from "@/components/home/TermsBand";
import { SampleKit } from "@/components/home/SampleKit";
import { FinalCta } from "@/components/home/FinalCta";
import { ProductDial } from "@/components/dial/ProductDial";
import { PROCESS_STEPS } from "@/data/process";
import { getCategories, getPrimaryCategories, getEnquiryCategories, getProductsByCategory } from "@/lib/catalog";
import { getOriginPhotos } from "@/lib/origin";
import { toDialItems } from "@/lib/dial";

export default function Home() {
  const categories = getCategories();
  const primaryCategories = getPrimaryCategories();
  const enquiryCategories = getEnquiryCategories();
  const counts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
  const originPhotos = getOriginPhotos(["khewra-interior", "paddy-chunian"]);
  return (
    <>
      <Hero>
        <ProductDial items={toDialItems()} />
      </Hero>
      <ProofStrip />
      <section className="py-20">
        <Container>
          <h2>What we export</h2>
          <div className="mt-10"><CategoryGrid categories={primaryCategories} counts={counts} /></div>
          <h3 className="mt-12">Also available on enquiry</h3>
          <div className="mt-6"><EnquiryCategoryList categories={enquiryCategories} /></div>
        </Container>
      </section>
      <section className="py-20">
        <Container>
          <h2>From the Salt Range to the Punjab plains</h2>
          <p className="mt-4 text-muted text-[1.2rem] max-w-prose">Our salt comes from the Khewra mine in the Salt Range; our rice from the paddies of Punjab. Both are graded and packed to your specification before dispatch.</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {originPhotos.map((photo) => (
              <OriginFigure key={photo.id} photo={photo} />
            ))}
          </div>
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
