import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/company";
import { joinOr, lowerFirst } from "@/lib/seo";
import { whatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About us: our aim and mission",
  description: "Drake Passage Private Limited is an export company in Lahore, Pakistan, supplying Himalayan salt, rice, potatoes, onions, spices and fruit to wholesale buyers. Our aim, mission and how we work.",
  alternates: { canonical: "/about" },
};

const VALUES: { title: string; detail: string; icon: React.ReactNode }[] = [
  {
    title: "Quality you can check",
    detail: `Samples by ${company.sampleCouriers.join(" or ")} before you order, and pre-shipment inspection such as SGS on request.`,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Packed your way",
    detail: "Bulk bags, retail pouches, cartons or private label where the product allows, graded to the specification you ask for.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8l9-4 9 4-9 4-9-4z" />
        <path d="M3 8v8l9 4 9-4V8" />
        <path d="M12 12v8" />
      </svg>
    ),
  },
  {
    title: "Clear terms",
    detail: `${joinOr(company.tradeTerms)} quotes, with payment terms stated up front: ${lowerFirst(company.paymentTerms.newBuyers)} for new buyers, ${lowerFirst(company.paymentTerms.repeatBuyers)} for repeat buyers.`,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M14 3v4h4" />
        <path d="M9 12.5h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    title: "One point of contact",
    detail: "Talk to us directly on WhatsApp, phone or email, from your first enquiry until the goods are shipped.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <Container className="py-16">
        <h1>About Drake Passage</h1>
        <p className="mt-4 max-w-prose text-muted text-[1.2rem]">{company.legalName} is an export company based in {company.office}. We export Himalayan salt, Basmati and non-Basmati rice, potatoes, onions, spices and fruit. We source from producing regions in Pakistan and ship to wholesale buyers on {joinOr(company.tradeTerms)} terms.</p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <section className="rounded-tile bg-navy p-8 text-salt">
            <h2 className="text-salt text-[1.6rem]">Our aim</h2>
            <p className="mt-3 mb-0 text-salt/85">To be a dependable source of Pakistani salt, rice, produce, spices and fruit for wholesale buyers abroad: the right grade, packed the way you asked for it and shipped when we said it would be.</p>
          </section>
          <section className="rounded-tile border border-line bg-white p-8">
            <h2 className="text-[1.6rem]">Our mission</h2>
            <p className="mt-3 mb-0 text-muted">To connect buyers with Pakistan&apos;s producing regions, from the Salt Range at Khewra to the rice belt of Punjab, the potato fields of Okara and the Kinnow orchards of Sargodha. We source from growers, mills and processors in each region, check grade and packing before dispatch, and prepare the export documents so that every shipment arrives as quoted.</p>
          </section>
        </div>

        <h2 className="mt-16">How we work</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-tile border border-line bg-white p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-salt text-teal">{v.icon}</span>
              <h3 className="mt-4 text-[1.25rem]">{v.title}</h3>
              <p className="mt-2 mb-0 text-muted text-[15px]">{v.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16">What we handle for you</h2>
        <ul className="mt-4 list-disc pl-5">
          <li>Sourcing and grading at origin</li>
          <li>Packing to your specification, including private label where the product allows</li>
          <li>Documents: ISO 9001, Halal, certificate of origin, certificate of analysis (COA), SGS inspection and phytosanitary certificate on request</li>
          <li>Samples by {company.sampleCouriers.join(" or ")}</li>
        </ul>
      </Container>

      <section className="py-20 border-t border-line">
        <Container className="text-center">
          <h2>Tell us what you need</h2>
          <p className="mt-4 text-muted mx-auto">Send the product, quantity and destination and we will come back with a quote.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact">Get a quote</Button>
            <Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
