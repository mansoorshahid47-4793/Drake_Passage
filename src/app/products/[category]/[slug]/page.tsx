import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SpecTable } from "@/components/ui/SpecTable";
import { getCategory, getProduct, getProducts } from "@/lib/catalog";
import { productTitle } from "@/lib/seo";
import { whatsAppUrl } from "@/lib/whatsapp";
import { company } from "@/data/company";

type Params = { category: string; slug: string };

export function generateStaticParams(): Params[] {
  return getProducts().map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category: c, slug } = await params;
  const category = getCategory(c);
  const product = getProduct(c, slug);
  if (!category || !product) return {};
  return { title: productTitle(product, category), description: `${product.tagline}. ${product.summary}` };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { category: c, slug } = await params;
  const category = getCategory(c);
  const product = getProduct(c, slug);
  if (!category || !product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    category: category.name,
    brand: { "@type": "Organization", name: company.legalName },
  };

  return (
    <Container className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="m-0 text-[15px]">
        <Link href="/products">Products</Link> / <Link href={`/products/${category.slug}`}>{category.name}</Link>
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
            <Image src={product.images[0]} alt={`${product.name}: ${product.tagline}`} fill preload sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6">
          <h1>{product.name}</h1>
          <p className="mt-3 text-muted text-[1.2rem]">{product.tagline}</p>
          <p className="mt-4">{product.summary}</p>
          <h2 className="mt-8 text-[1.6rem]">Specifications</h2>
          <div className="mt-3"><SpecTable caption={`${product.name} specifications`} specs={product.specs} /></div>
          {product.packagingOptions.length > 0 && (
            <>
              <h2 className="mt-8 text-[1.6rem]">Packing</h2>
              <ul className="mt-3 list-disc pl-5">{product.packagingOptions.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          )}
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 border-t border-line pt-6">
            <div><dt className="font-semibold">Trade terms</dt><dd className="m-0 text-muted">{product.supportedTradeTerms.join(" or ")}</dd></div>
            {product.moq && <div><dt className="font-semibold">Minimum order</dt><dd className="m-0 text-muted">{product.moq}</dd></div>}
            <div><dt className="font-semibold">Samples</dt><dd className="m-0 text-muted">By {company.sampleCouriers.join(" or ")}</dd></div>
            <div><dt className="font-semibold">Documents</dt><dd className="m-0 text-muted">Available on request</dd></div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/contact?category=${category.slug}&product=${product.slug}`}>Get a quote</Button>
            <Button href={whatsAppUrl(`Quote request: ${product.name}`)} external variant="whatsapp">Chat on WhatsApp</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
