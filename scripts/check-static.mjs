import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const prerendered = new Set(Object.keys(manifest.routes));
const src = readFileSync("src/data/catalog.ts", "utf8");
const categorySlugs = [...src.matchAll(/slug: "([a-z0-9-]+)", name: "[^"]+", tagline/g)].map((m) => m[1]);
const productEntries = [...src.matchAll(/base\(\{ slug: "([a-z0-9-]+)", name: "[^"]+", category: "([a-z]+)"/g)].map((m) => ({ slug: m[1], category: m[2] }));

const expected = [
  "/", "/products", "/certifications", "/services", "/about", "/insights", "/contact",
  ...categorySlugs.map((c) => `/products/${c}`),
  ...productEntries.map((p) => `/products/${p.category}/${p.slug}`),
];

const missing = expected.filter((r) => !prerendered.has(r));
if (missing.length) {
  console.error("Not prerendered:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`ok: ${expected.length} routes prerendered`);
