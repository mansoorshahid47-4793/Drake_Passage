import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getCategories, getCategory, groupBySubCategory } from "@/lib/catalog";
import { categoryTitle } from "@/lib/seo";
import { whatsAppUrl } from "@/lib/whatsapp";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: categoryTitle(category),
    description: `${category.tagline}. FOB or CIF quotes for wholesale buyers.`,
    alternates: { canonical: `/products/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const groups = groupBySubCategory(category);
  return (
    <>
      <div className="relative h-[40vh] min-h-[280px] bg-navy">
        <Image src={category.heroImage} alt={`${category.name}: ${category.tagline}`} fill preload sizes="100vw" className="object-cover opacity-80" />
      </div>
      <Container className="py-12">
        <p className="m-0 text-[15px]"><Link href="/products">Products</Link></p>
        <h1 className="mt-2">{category.name}</h1>
        <p className="mt-3 text-muted text-[1.2rem]">{category.tagline}</p>
        <p className="mt-3 text-muted text-[15px] max-w-prose">{category.description}</p>
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
      </Container>
    </>
  );
}
