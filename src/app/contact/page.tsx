import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { EnquiryFormLoader } from "@/components/contact/EnquiryFormLoader";
import { getCategories, getProductsByCategory } from "@/lib/catalog";

export const metadata: Metadata = { title: "Contact", description: "Request a quote or a sample from Drake Passage. WhatsApp, phone and email.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  const formCategories = getCategories().map((c) => ({
    slug: c.slug, name: c.name, products: getProductsByCategory(c.slug).map((p) => ({ slug: p.slug, name: p.name })),
  }));

  return (
    <Container className="py-16">
      <h1>Let&apos;s move your next shipment</h1>
      <p className="mt-4 text-muted">Tell us what you need, where it is going, and the quantity.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5"><ContactDetails /></div>
        <section id="enquiry" aria-label="Enquiry form" className="lg:col-span-7">
          <h2 className="mb-6">Send your requirement</h2>
          <EnquiryFormLoader categories={formCategories} />
        </section>
      </div>
    </Container>
  );
}
