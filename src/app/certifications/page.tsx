import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CertificationRow } from "@/components/ui/CertificationRow";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Certifications and documents",
  description: "ISO 9001, Halal, certificate of origin, COA, SGS inspection and phytosanitary certificate, available on request with your quote or shipping documents.",
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return (
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1>Certifications and documents</h1>
          <p className="mt-4 text-muted">Each document below is available on request. Tell us the shipment or product and we send the current copy with your quote or with the shipping documents.</p>
          <div className="mt-10">
            {company.certifications.map((c) => <CertificationRow key={c.name} certification={c} />)}
          </div>
        </div>
        <figure className="m-0 max-w-md lg:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-navy">
            <Image
              src="/images/inspection/rice-inspection.jpg"
              alt="An inspector in an SGS cap and high-visibility vest kneels beside piles of loose rice in a warehouse, examining a handful of grains"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 448px) 448px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 text-[15px] text-muted">SGS inspection of a rice lot</figcaption>
        </figure>
      </div>
    </Container>
  );
}
