import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { OriginFigure } from "@/components/ui/OriginFigure";
import { getCategories, getCategory, groupBySubCategory, ENQUIRY_NOTE } from "@/lib/catalog";
import { getOriginPhotos } from "@/lib/origin";
import { categoryTitle } from "@/lib/seo";
import { whatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  const description = category.tier === "primary"
    ? `${category.tagline}. FOB or CIF quotes from Drake Passage, Lahore, Pakistan; samples by courier, documents on request.`
    : `${category.tagline}, supplied on enquiry by Drake Passage, Lahore, Pakistan. FOB or CIF quotes; tell us the grade, quantity and destination.`;
  return {
    title: categoryTitle(category),
    description,
    alternates: { canonical: `/products/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const groups = groupBySubCategory(category);
  const originPhotos = category.originPhotoIds ? getOriginPhotos(category.originPhotoIds) : [];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/products/${category.slug}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="relative h-[40vh] min-h-[280px] bg-navy">
        <Image src={category.heroImage} alt={`${category.name}: ${category.tagline}`} fill preload sizes="100vw" className="object-cover opacity-80" />
      </div>
      <Container className="py-12">
        <p className="m-0 text-[15px]"><Link href="/products">Products</Link></p>
        <h1 className="mt-2">{category.name}</h1>
        <p className="mt-3 text-muted text-[1.2rem]">{category.tagline}</p>
        <p className="mt-3 text-muted text-[15px] max-w-prose">{category.description}</p>
        {category.tier === "enquiry" && (
          <p className="mt-4 max-w-prose rounded-control bg-white border border-line px-4 py-3 text-[15px]">{ENQUIRY_NOTE}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/contact?category=${category.slug}`}>Get a quote for {category.name.toLowerCase()}</Button>
          <Button href={whatsAppUrl(`Quote request: ${category.name}`)} external variant="whatsapp">Chat on WhatsApp</Button>
        </div>
        {groups.map((g) => (
          <section key={g.subCategory ?? "all"} className="mt-12">
            {g.subCategory && <h2 className="text-[1.6rem]">{g.subCategory}</h2>}
            <ul className="mt-4 grid list-none gap-6 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3">
              {g.products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${category.slug}/${p.slug}`} className="block no-underline text-ink group">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
                      <Image src={p.images[0]} alt={`${p.name}: ${p.tagline}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    </div>
                    <h3 className="mt-3 text-[1.25rem] group-hover:text-teal">{p.name}</h3>
                    <p className="m-0 text-muted text-[15px]">{p.tagline}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {originPhotos.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[1.6rem]">From the source</h2>
            <div className={`mt-4 grid gap-8 ${originPhotos.length > 1 ? "sm:grid-cols-2" : "max-w-2xl"}`}>
              {originPhotos.map((photo) => (
                <OriginFigure key={photo.id} photo={photo} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
