import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactDetails } from "@/components/contact/ContactDetails";

export const metadata: Metadata = { title: "Contact", description: "Request a quote or a sample from Drake Passage. WhatsApp, phone and email." };

export default function ContactPage() {
  return (
    <Container className="py-16">
      <h1>Let&apos;s move your next shipment</h1>
      <p className="mt-4 text-muted">Tell us what you need, where it is going, and the quantity.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5"><ContactDetails /></div>
        <section id="enquiry" aria-label="Enquiry form" className="lg:col-span-7">
          <p className="text-muted">The enquiry form is on its way. Until then, WhatsApp or email us with your requirement.</p>
        </section>
      </div>
    </Container>
  );
}
