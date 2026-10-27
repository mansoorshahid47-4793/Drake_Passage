import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { whatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Insights on grades, packing and documents",
  description: "Notes from Drake Passage on salt and rice grades, packing and export documentation for wholesale buyers. Guides are in preparation; ask us directly in the meantime.",
  alternates: { canonical: "/insights" },
};

const TOPICS: { title: string; detail: string; icon: React.ReactNode }[] = [
  {
    title: "Grading and packing standards",
    detail: "How we grade salt, rice and other commodities, and the packing options available for each.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8l9-4 9 4-9 4-9-4z" />
        <path d="M3 8v8l9 4 9-4V8" />
        <path d="M12 12v8" />
      </svg>
    ),
  },
  {
    title: "Export documentation",
    detail: "A plain-English look at the certificates and shipping paperwork a shipment needs.",
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
    title: "Shipping and logistics",
    detail: "Trade terms, sample dispatch and what to expect between enquiry and shipment.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16h16l-3 4H7z" />
        <path d="M12 16V4" />
        <path d="M12 5l6 6H12z" />
      </svg>
    ),
  },
];

export default function InsightsPage() {
  return (
    <>
      <Container className="py-16">
        <h1>Insights</h1>
        <p className="mt-4 text-muted text-[1.2rem] max-w-prose">Guides on grades, packing and export documentation are in preparation. Here is what they will cover, and how to reach us while we write them.</p>

        <h2 className="mt-16">What to expect</h2>
        <p className="mt-2 text-muted">These are the topics on our list — nothing below is published yet.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="rounded-tile border border-line bg-white p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-salt text-teal">{topic.icon}</span>
              <h3 className="mt-4 text-[1.25rem]">{topic.title}</h3>
              <p className="mt-2 mb-0 text-muted text-[15px]">{topic.detail}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="bg-leaf py-20">
        <Container className="text-center">
          <h2>Have a question before our guides are ready?</h2>
          <p className="mt-4 text-muted mx-auto">Ask us directly — most grading, packing and documentation questions can be answered on a call or over WhatsApp.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact">Get a quote</Button>
            <Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
