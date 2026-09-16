import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1>That page is not here</h1>
      <p className="mt-4 text-muted mx-auto">The link may be old. Start from the products list or contact us directly.</p>
      <div className="mt-8 flex justify-center gap-3"><Button href="/products" variant="secondary">See products</Button><Button href="/contact">Contact us</Button></div>
    </Container>
  );
}
