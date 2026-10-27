import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { CategorySlider } from "@/components/home/CategorySlider";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ProductMosaic, type MosaicTile } from "@/components/home/ProductMosaic";
import { TermsBand } from "@/components/home/TermsBand";
import { SampleKit } from "@/components/home/SampleKit";
import { FinalCta } from "@/components/home/FinalCta";
import { PROCESS_STEPS } from "@/data/process";
import { getCategories } from "@/lib/catalog";
import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telephone: `+${company.phoneE164}`,
  email: company.email,
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressRegion: "Punjab", addressCountry: "PK" },
  contactPoint: { "@type": "ContactPoint", telephone: `+${company.phoneE164}`, contactType: "sales", availableLanguage: ["en"] },
};

const MOSAIC: MosaicTile[] = [
  { label: "Pink salt", href: "/products/salt", image: "/images/categories/salt.jpg" },
  { label: "Basmati rice", href: "/products/rice", image: "/images/categories/rice.jpg" },
  { label: "Salt lamps", href: "/products/salt/natural-pink-salt-lamps", image: "/images/products/natural-pink-salt-lamps.jpg" },
  { label: "Mangoes", href: "/products/fruits/mango", image: "/images/products/mango.jpg" },
  { label: "Kinnow", href: "/products/fruits/kinnow-orange", image: "/images/products/kinnow-orange.jpg" },
  { label: "Potatoes", href: "/products/potato", image: "/images/categories/potato.jpg" },
  { label: "Onions", href: "/products/onion", image: "/images/categories/onion.jpg" },
  { label: "Spices", href: "/products/spices", image: "/images/categories/spices.jpg" },
];

export default function Home() {
  const categories = getCategories();
  const slides = categories.map((c) => ({ slug: c.slug, kicker: c.slide.kicker, title: c.slide.title, tagline: c.tagline, image: c.heroImage }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <h1 className="sr-only">{company.legalName}: salt, rice, produce, spices and fruit exported from Pakistan</h1>
      <CategorySlider slides={slides} />

      <section className="py-16">
        <Container className="text-center">
          <h2>What we export</h2>
          <p className="mt-3 mx-auto text-muted text-[1.2rem]">Graded at origin, packed for export.</p>
          <ul className="mt-10 grid list-none grid-cols-3 gap-6 p-0 m-0 sm:grid-cols-6">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} className="group flex flex-col items-center gap-3 text-ink no-underline">
                  <span className="relative block h-20 w-20 overflow-hidden rounded-full ring-4 ring-white shadow-md transition-transform duration-[var(--dur-component)] group-hover:-translate-y-1 sm:h-24 sm:w-24">
                    <Image src={c.heroImage} alt="" fill sizes="96px" className="object-cover" />
                  </span>
                  <span className="font-semibold group-hover:text-teal-text">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <AboutTeaser />
      <ProductMosaic tiles={MOSAIC} />

      <section className="bg-leaf py-20">
        <Container>
          <h2>How an order works</h2>
          <div className="mt-10"><ProcessSteps steps={PROCESS_STEPS} /></div>
        </Container>
      </section>
      <TermsBand />
      <SampleKit />
      <FinalCta />
    </>
  );
}
