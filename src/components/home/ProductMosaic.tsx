import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export type MosaicTile = { label: string; href: string; image: string };

export function ProductMosaic({ tiles }: { tiles: MosaicTile[] }) {
  return (
    <section className="bg-gold-soft py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2>Our products</h2>
            <p className="mt-4 text-muted text-[1.2rem] max-w-prose">Sourced from Pakistan&apos;s producing regions, graded and packed for export. Open any product for its origin, specifications and packing.</p>
          </div>
          <Button href="/products" variant="secondary">All products</Button>
        </div>
        <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 m-0 md:grid-cols-4 md:gap-4">
          {tiles.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="group relative block aspect-square overflow-hidden rounded-tile bg-navy no-underline">
                <Image src={t.image} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none" />
                <span className="absolute inset-0 bg-navy/35 transition-colors duration-500 group-hover:bg-navy/55" />
                <span className="absolute inset-0 grid place-items-center p-3 text-center font-display font-semibold uppercase tracking-wide text-white text-[clamp(1.1rem,0.9rem+1.2vw,1.9rem)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                  {t.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
