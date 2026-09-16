import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = { title: "About", description: "Drake Passage Pvt Limited, an export company based in Lahore, Punjab, Pakistan.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const categories = getCategories();
  return (
    <Container className="py-16">
      <h1>About Drake Passage</h1>
      <p className="mt-4 text-muted text-[1.2rem]">{company.legalName} is an export company based in {company.office}. We source {categories.map((c) => c.name.toLowerCase()).join(", ")} from producing regions in Pakistan and ship to wholesale buyers on {company.tradeTerms.join(" or ")} terms.</p>
      <h2 className="mt-12">What we handle for you</h2>
      <ul className="mt-4 list-disc pl-5">
        <li>Sourcing and grading at origin</li>
        <li>Packing to your specification, including private label where the product allows</li>
        <li>Documents: certificate of origin, COA, SGS inspection, phytosanitary, Halal and ISO 9001 on request</li>
        <li>Samples by {company.sampleCouriers.join(" or ")}</li>
      </ul>
    </Container>
  );
}
