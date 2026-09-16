import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Insights on grades, packing and documents",
  description: "Notes from Drake Passage on salt and rice grades, packing and export documentation for wholesale buyers. Articles are being prepared; ask us in the meantime.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <Container className="py-16">
      <h1>Insights</h1>
      <p className="mt-4 text-muted">Articles on grades, packing and export documents are being prepared. Ask us directly in the meantime.</p>
    </Container>
  );
}
