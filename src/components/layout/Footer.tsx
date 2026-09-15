import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";
import { getCategories } from "@/lib/catalog";
import { NAV_LINKS } from "./nav";

export function Footer() {
  const categories = getCategories();
  return (
    <footer className="mt-24 bg-navy text-salt">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold m-0">{company.name}</p>
          <p className="mt-2 text-salt/80 m-0">{company.legalName}</p>
          <p className="mt-4 m-0">{company.office}</p>
          <p className="m-0"><a href={`tel:+${company.phoneE164}`} className="text-teal-bright">{company.phoneDisplay}</a></p>
          <p className="m-0"><a href={`mailto:${company.email}`} className="text-teal-bright">{company.email}</a></p>
          <p className="mt-2 m-0 text-salt/80">{company.hours}</p>
        </div>
        <div>
          <p className="font-semibold m-0 mb-3">Products</p>
          <ul className="m-0 list-none p-0 space-y-2">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/products/${c.slug}`} className="text-salt/90 no-underline hover:text-teal-bright">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold m-0 mb-3">Company</p>
          <ul className="m-0 list-none p-0 space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-salt/90 no-underline hover:text-teal-bright">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold m-0 mb-3">Terms</p>
          <p className="m-0 text-salt/90">Trade terms: {company.tradeTerms.join(" or ")}</p>
          <p className="m-0 text-salt/90">New buyers: {company.paymentTerms.newBuyers}</p>
          <p className="m-0 text-salt/90">Repeat buyers: {company.paymentTerms.repeatBuyers}</p>
          <p className="m-0 text-salt/90">Samples by {company.sampleCouriers.join(" or ")}</p>
        </div>
      </Container>
      <div className="border-t border-salt/15">
        <Container className="py-4 text-[15px] text-salt/70">© {new Date().getFullYear()} {company.legalName}</Container>
      </div>
    </footer>
  );
}
