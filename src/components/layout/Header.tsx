import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductsMenu } from "./ProductsMenu";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS } from "./nav";
import { whatsAppUrl } from "@/lib/whatsapp";
import { company } from "@/data/company";

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 no-underline text-navy" aria-label={`${company.legalName} home`}>
          <Image src="/logo.svg" alt="" width={36} height={36} preload />
          <span className="hidden sm:inline font-display text-xl font-semibold leading-none">{company.name}</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <ProductsMenu categories={categories} />
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center px-2 font-semibold text-ink no-underline hover:text-teal">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button>
            <Button href="/contact">Get a quote</Button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="inline-flex h-11 w-11 items-center justify-center rounded-control bg-whatsapp text-navy">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.5 3.9 1.7.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg>
            </a>
            <Button href="/contact" size="compact">Get a quote</Button>
            <MobileNav categories={categories} />
          </div>
        </div>
      </Container>
    </header>
  );
}
