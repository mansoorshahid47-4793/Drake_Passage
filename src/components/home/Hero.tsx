import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { whatsAppUrl } from "@/lib/whatsapp";
import { joinOr } from "@/lib/seo";
import { company } from "@/data/company";

export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-linear-to-br from-salt via-salt to-gold-soft py-16 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1>Salt, rice, produce, spices and fruit, exported from Pakistan</h1>
          <p className="mt-5 text-muted text-[1.2rem]">
            Drake Passage exports Himalayan pink salt, Basmati and non-Basmati rice, potatoes, onions, turmeric, red chilli, mangoes and Kinnow oranges to wholesale buyers abroad. {joinOr(company.tradeTerms)} quotes, samples by courier, documents on request.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact">Get a quote</Button>
            <Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button>
          </div>
        </div>
        <div className="lg:col-span-7">{children}</div>
      </Container>
    </section>
  );
}
