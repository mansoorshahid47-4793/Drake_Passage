import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Insights", description: "Notes on grades, packing and export documentation from Drake Passage.", alternates: { canonical: "/insights" } };

export default function InsightsPage() {
  return (
    <Container className="py-16">
      <h1>Insights</h1>
      <p className="mt-4 text-muted">Articles on grades, packing and export documents are being prepared. Ask us directly in the meantime.</p>
    </Container>
  );
}
