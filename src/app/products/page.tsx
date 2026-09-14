import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { getCategories, getProductsByCategory, groupBySubCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description: "Himalayan salt, basmati and non-basmati rice, potatoes, onions, tomatoes and spices for export from Pakistan.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const categories = getCategories();
  const counts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
  return (
    <Container className="py-16">
      <h1>Products</h1>
      <p className="mt-4 text-muted">Six commodity groups. Open a category for its varieties and packing options, or ask for a quote on anything you do not see.</p>
      <div className="mt-10"><CategoryGrid categories={categories} counts={counts} /></div>
      {categories.map((c) => (
        <section key={c.slug} className="mt-16 border-t border-line pt-10">
          <h2><Link href={`/products/${c.slug}`} className="text-ink no-underline hover:text-teal">{c.name}</Link></h2>
          {groupBySubCategory(c).map((g) => (
            <div key={g.subCategory ?? "all"} className="mt-6">
              {g.subCategory && <h3 className="text-[1.25rem]">{g.subCategory}</h3>}
              <ul className="mt-2 grid list-none gap-2 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3">
                {g.products.map((p) => (
                  <li key={p.slug}><Link href={`/products/${c.slug}/${p.slug}`}>{p.name}</Link> <span className="text-muted text-[15px]">— {p.tagline}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </Container>
  );
}
