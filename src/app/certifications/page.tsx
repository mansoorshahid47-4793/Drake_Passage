import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CertificationRow } from "@/components/ui/CertificationRow";
import { company } from "@/data/company";

export const metadata: Metadata = { title: "Certifications and documents", description: "ISO 9001, Halal, certificate of origin, COA, SGS inspection and phytosanitary certificate — available on request for every shipment." };

export default function CertificationsPage() {
  return (
    <Container className="py-16">
      <h1>Certifications and documents</h1>
      <p className="mt-4 text-muted">Each document below is available on request. Tell us the shipment or product and we send the current copy with your quote or with the shipping documents.</p>
      <div className="mt-10">
        {company.certifications.map((c) => <CertificationRow key={c.name} certification={c} />)}
      </div>
    </Container>
  );
}
