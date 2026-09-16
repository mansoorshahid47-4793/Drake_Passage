import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1>Himalayan salt and basmati rice from Pakistan, packed to your spec</h1>
          <p className="mt-5 text-muted text-[1.2rem]">
            Drake Passage exports Himalayan pink salt and basmati and non-basmati rice to wholesale buyers, with potatoes, onions, tomatoes and spices available on enquiry. FOB or CIF quotes, samples by courier, documents included.
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
