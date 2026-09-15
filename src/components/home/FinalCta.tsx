import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { whatsAppUrl } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section className="py-20 border-t border-line">
      <Container className="text-center">
        <h2>Tell us what you need, where it is going, and how much</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/contact">Get a quote</Button>
          <Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button>
        </div>
      </Container>
    </section>
  );
}
