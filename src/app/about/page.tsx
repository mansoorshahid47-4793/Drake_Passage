import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";
import { joinOr } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About our Lahore export company",
  description: "Drake Passage Private Limited is an export company in Lahore, Pakistan, supplying Himalayan salt, rice, potatoes, onions, spices and fruit to wholesale buyers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <h1>About Drake Passage</h1>
      <div className="mt-4 max-w-prose">
        <p className="m-0 text-muted text-[1.2rem]">{company.legalName} is an export company based in {company.office}. We export Himalayan salt, Basmati and non-Basmati rice, potatoes, onions, spices and fruit. We source from producing regions in Pakistan and ship to wholesale buyers on {joinOr(company.tradeTerms)} terms.</p>
      </div>
      <h2 className="mt-12">What we handle for you</h2>
      <ul className="mt-4 list-disc pl-5">
        <li>Sourcing and grading at origin</li>
        <li>Packing to your specification, including private label where the product allows</li>
        <li>Documents: ISO 9001, Halal, certificate of origin, certificate of analysis (COA), SGS inspection and phytosanitary certificate on request</li>
        <li>Samples by {company.sampleCouriers.join(" or ")}</li>
      </ul>
    </Container>
  );
}
