import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const prerendered = new Set(Object.keys(manifest.routes));
const src = readFileSync("src/data/catalog.ts", "utf8");
const categorySlugs = [...src.matchAll(/slug: "([a-z0-9-]+)", name: "[^"]+",(?: seoName: "[^"]+",)? tagline/g)].map((m) => m[1]);
const productEntries = [...src.matchAll(/base\(\{ slug: "([a-z0-9-]+)", name: "[^"]+", category: "([a-z]+)"/g)].map((m) => ({ slug: m[1], category: m[2] }));

const expected = [
  "/", "/products", "/certifications", "/services", "/about", "/insights", "/contact",
  ...categorySlugs.map((c) => `/products/${c}`),
  ...productEntries.map((p) => `/products/${p.category}/${p.slug}`),
];

const NON_PAGE_ROUTES = new Set(["/_global-error", "/_not-found", "/icon.svg", "/opengraph-image", "/robots.txt", "/sitemap.xml"]);
const EXPECTED_PAGE_COUNT = 37; // 7 static + 6 categories + 24 products; change deliberately with the catalog
const prerenderedPages = [...prerendered].filter((r) => !NON_PAGE_ROUTES.has(r));

const missing = expected.filter((r) => !prerendered.has(r));
const unexpected = prerenderedPages.filter((r) => !expected.includes(r));
const problems = [];
if (missing.length) problems.push("Not prerendered:\n" + missing.join("\n"));
if (unexpected.length) problems.push("Prerendered but not derived from catalog.ts (regex drift?):\n" + unexpected.join("\n"));
if (expected.length !== EXPECTED_PAGE_COUNT) problems.push(`Derived ${expected.length} page routes, expected ${EXPECTED_PAGE_COUNT}`);
if (problems.length) {
  console.error(problems.join("\n\n"));
  process.exit(1);
}
console.log(`ok: ${expected.length} routes prerendered`);
