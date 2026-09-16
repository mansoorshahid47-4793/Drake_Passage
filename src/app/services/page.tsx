import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { TermsBand } from "@/components/home/TermsBand";
import { PROCESS_STEPS } from "@/data/process";

export const metadata: Metadata = {
  title: "Export process and trade terms",
  description: "How an order works: enquiry, quote, sample, contract, quality checks and shipment. FOB or CIF, 100% advance for new buyers, samples by DHL or Leopard Courier.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Container className="py-16">
        <h1>Export services</h1>
        <p className="mt-4 text-muted">From first enquiry to shipping documents, this is the sequence every order follows.</p>
        <div className="mt-10"><ProcessSteps steps={PROCESS_STEPS} /></div>
      </Container>
      <TermsBand />
    </>
  );
}
