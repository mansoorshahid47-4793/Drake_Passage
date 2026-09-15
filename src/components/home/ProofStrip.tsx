import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";
import Link from "next/link";

export function ProofStrip() {
  return (
    <section className="border-y border-line bg-white py-8">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="m-0 font-semibold">Documents available on request</p>
          <p className="m-0 text-muted text-[15px]">{company.office} · {company.hours}</p>
        </div>
        <ul className="mt-4 grid list-none gap-x-8 gap-y-2 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3">
          {company.certifications.map((c) => (
            <li key={c.name} className="text-[15px]"><span className="font-semibold">{c.name}</span> <span className="text-muted">— {c.covers}</span></li>
          ))}
        </ul>
        <p className="mt-4 mb-0 text-[15px]"><Link href="/certifications">How each document is provided</Link></p>
      </Container>
    </section>
  );
}
