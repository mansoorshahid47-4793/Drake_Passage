import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/company";

export function AboutTeaser() {
  return (
    <>
      <section className="bg-navy py-16 text-center">
        <Container>
          <p className="m-0 mx-auto max-w-[22ch] font-display font-semibold uppercase leading-[1.05] text-teal-bright text-[clamp(2rem,1.2rem+3.5vw,4.25rem)]">
            Consistent quality, careful packing, complete documents
          </p>
        </Container>
      </section>
      <section className="relative overflow-hidden py-20">
        <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 m-0 -translate-y-1/2 select-none text-center font-display font-bold uppercase leading-none text-teal-bright/15 text-[clamp(5rem,2rem+14vw,15rem)]">
          Pakistan
        </p>
        <Container className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="m-0 font-semibold uppercase tracking-[0.25em] text-teal-text text-[15px]">About us</p>
            <h2 className="mt-2">{company.legalName}</h2>
            <p className="mt-4 text-muted text-[1.2rem]">An export company based in {company.office}. We source Himalayan salt, Basmati and non-Basmati rice, potatoes, onions, spices and fruit from Pakistan&apos;s producing regions, check grade and packing before dispatch, and ship to wholesale buyers abroad.</p>
            <div className="mt-8"><Button href="/about">More about us</Button></div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy shadow-xl">
            <Image src="/images/inspection/rice-inspection.jpg" alt="An SGS inspector checking Basmati rice before shipment" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_25%]" />
          </div>
        </Container>
      </section>
    </>
  );
}
