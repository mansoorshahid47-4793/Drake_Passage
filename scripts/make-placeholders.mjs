import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/data/catalog.ts", "utf8");
const categorySlugs = [...src.matchAll(/slug: "([a-z0-9-]+)", name: "[^"]+", tagline/g)].map((m) => m[1]);
const productSlugs = [...src.matchAll(/base\(\{ slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);

function svg(label, bg) {
  const text = label.replace(/-/g, " ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
<rect width="800" height="600" fill="${bg}"/>
<path d="M0 520c100-60 200-60 300 0s200 60 300 0 200-60 300 0v80H0z" fill="#22b8bc" opacity="0.35"/>
<text x="40" y="80" font-family="Georgia, serif" font-size="40" fill="#f4f7f6">${text}</text>
<text x="40" y="120" font-family="sans-serif" font-size="20" fill="#f4f7f6" opacity="0.8">placeholder — replace with photography</text>
</svg>`;
}

mkdirSync("public/images/categories", { recursive: true });
mkdirSync("public/images/products", { recursive: true });
for (const s of categorySlugs) writeFileSync(`public/images/categories/${s}.svg`, svg(s, "#0b2545"));
for (const s of productSlugs) writeFileSync(`public/images/products/${s}.svg`, svg(s, "#123a66"));
console.log(`wrote ${categorySlugs.length} category and ${productSlugs.length} product placeholders`);
