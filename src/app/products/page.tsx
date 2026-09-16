import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EnquiryCategoryList } from "@/components/ui/EnquiryCategoryList";
import { getCategories, getPrimaryCategories, getEnquiryCategories, getProductsByCategory, groupBySubCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Himalayan salt and Basmati rice products",
  description: "Himalayan pink salt grades, lamps and decor, Basmati 1121, 1509, 1847 and IRRI-6 rice, with potatoes, onions, tomatoes and spices on enquiry. From Pakistan.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const categories = getCategories();
  const primaryCategories = getPrimaryCategories();
  const enquiryCategories = getEnquiryCategories();
  const counts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
  return (
    <Container className="py-16">
      <h1>Products</h1>
      <p className="mt-4 text-muted">Salt and rice are our primary lines. Potatoes, onions, tomatoes and spices are available on enquiry. Open a category for its varieties and packing options, or ask for a quote on anything you do not see.</p>
      <h2 className="mt-10">Primary lines</h2>
      <div className="mt-6"><CategoryGrid categories={primaryCategories} counts={counts} /></div>
      <h2 className="mt-12">On enquiry</h2>
      <div className="mt-6"><EnquiryCategoryList categories={enquiryCategories} /></div>
      {categories.map((c) => (
        <section key={c.slug} className="mt-16 border-t border-line pt-10">
          <h2><Link href={`/products/${c.slug}`} className="text-ink no-underline hover:text-teal">All {c.name.toLowerCase()}</Link></h2>
          {groupBySubCategory(c).map((g) => (
            <div key={g.subCategory ?? "all"} className="mt-6">
              {g.subCategory && <h3 className="text-[1.25rem]">{g.subCategory}</h3>}
              <ul className="mt-2 grid list-none gap-2 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3">
                {g.products.map((p) => (
                  <li key={p.slug}><Link href={`/products/${c.slug}/${p.slug}`}>{p.name}</Link> <span className="text-muted text-[15px]">· {p.tagline}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </Container>
  );
}
