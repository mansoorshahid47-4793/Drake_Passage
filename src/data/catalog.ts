import type { Category, Product } from "@/lib/types";

const jpg = (folder: "categories" | "products", name: string) => `/images/${folder}/${name}.jpg`;

export const categories: Category[] = [
  { slug: "salt", name: "Salt", tagline: "Himalayan pink salt from the Khewra range",
    description: "Rock salt from Pakistan's Salt Range, offered as edible grades, cooking and grilling slabs, table and kitchen pieces, salt lamps, wellness products, home and decor items and industrial grades.",
    heroImage: jpg("categories", "salt"),
    subCategories: ["Edible Salt", "Cooking & Grilling", "Table Products", "Kitchen Products", "Salt Lamps", "Wellness Products", "Home & Decor", "Industrial Products"] },
  { slug: "rice", name: "Rice", tagline: "Basmati and non-basmati from the Punjab plains",
    description: "Basmati and non-basmati varieties from the Punjab plains, including 1121 steam, 1509 sella, 1847 and IRRI-6, milled and graded for export.",
    heroImage: jpg("categories", "rice"),
    subCategories: ["Basmati", "Non-Basmati"] },
  { slug: "potato", name: "Potato", tagline: "Red and white table potatoes",
    description: "Red-skinned and white-skinned table potatoes, sorted and graded by size before dispatch.",
    heroImage: jpg("categories", "potato"),
    subCategories: ["Red", "White"] },
  { slug: "onion", name: "Onion", tagline: "Fresh onions for wholesale buyers",
    description: "Fresh onions sorted and graded by size for wholesale and food-service buyers.",
    heroImage: jpg("categories", "onion"), subCategories: [] },
  { slug: "tomato", name: "Tomato", tagline: "Fresh tomatoes for wholesale buyers",
    description: "Fresh tomatoes sorted by size and ripeness for wholesale buyers.",
    heroImage: jpg("categories", "tomato"), subCategories: [] },
  { slug: "spices", name: "Spices", tagline: "Ground turmeric and red chilli",
    description: "Ground turmeric and red chilli powder, cleaned, milled and packed for retail or bulk buyers.",
    heroImage: jpg("categories", "spices"), subCategories: [] },
];

const base = (p: Omit<Product, "images" | "specs" | "packagingOptions" | "supportedTradeTerms" | "certifications" | "summary"> & Partial<Product>): Product => ({
  images: [jpg("products", p.slug)],
  specs: [],
  packagingOptions: [],
  supportedTradeTerms: ["FOB", "CIF"],
  certifications: [],
  summary: "Specifications, grades and packing options are confirmed per enquiry.",
  ...p,
});

export const products: Product[] = [
  // Salt
  base({ slug: "dark-pink-food-grade-salt", name: "Dark pink food grade salt", category: "salt", subCategory: "Edible Salt", tagline: "Fine and coarse grades" }),
  base({ slug: "light-pink-food-grade-salt", name: "Light pink food grade salt", category: "salt", subCategory: "Edible Salt", tagline: "Fine and coarse grades" }),
  base({ slug: "white-food-grade-salt", name: "White Himalayan food grade salt", category: "salt", subCategory: "Edible Salt", tagline: "Fine and coarse grades" }),
  base({ slug: "black-salt", name: "Black Himalayan salt", category: "salt", subCategory: "Edible Salt", tagline: "Kala namak" }),
  base({ slug: "grilling-slabs", name: "Salt grilling slabs", category: "salt", subCategory: "Cooking & Grilling", tagline: "With metal or wooden holders" }),
  base({ slug: "salt-bowls-and-plates", name: "Salt bowls and serving plates", category: "salt", subCategory: "Table Products", tagline: "Hand-carved serveware" }),
  base({ slug: "salt-pestle-and-mortar", name: "Salt pestle and mortar", category: "salt", subCategory: "Kitchen Products", tagline: "Solid rock salt" }),
  base({ slug: "natural-pink-salt-lamps", name: "Natural pink salt lamps", category: "salt", subCategory: "Salt Lamps", tagline: "Natural, fire-bowl and geometric shapes" }),
  base({ slug: "bath-salt", name: "Himalayan bath salt", category: "salt", subCategory: "Wellness Products", tagline: "Coarse and fine bath grades" }),
  base({ slug: "tea-lights-and-candle-holders", name: "Tea lights and candle holders", category: "salt", subCategory: "Home & Decor", tagline: "Carved salt decor" }),
  base({ slug: "rock-salt-bricks-and-tiles", name: "Rock salt bricks and tiles", category: "salt", subCategory: "Industrial Products", tagline: "For salt rooms and walls" }),
  base({ slug: "animal-licking-salt", name: "Animal licking salt", category: "salt", subCategory: "Industrial Products", tagline: "Lick blocks for livestock" }),
  base({ slug: "industrial-rock-salt", name: "Industrial rock salt", category: "salt", subCategory: "Industrial Products", tagline: "Bulk lumps and crushed" }),
  // Rice
  base({ slug: "basmati-1121-steam-single", name: "Basmati 1121 steam (single)", category: "rice", subCategory: "Basmati", tagline: "Extra-long grain, single steam" }),
  base({ slug: "basmati-1121-steam-double", name: "Basmati 1121 steam (double)", category: "rice", subCategory: "Basmati", tagline: "Extra-long grain, double steam" }),
  base({ slug: "basmati-1847", name: "Basmati 1847", category: "rice", subCategory: "Basmati", tagline: "Long grain basmati" }),
  base({ slug: "basmati-1509-sella", name: "Basmati 1509 sella", category: "rice", subCategory: "Basmati", tagline: "Parboiled basmati" }),
  base({ slug: "irri-6", name: "IRRI-6", category: "rice", subCategory: "Non-Basmati", tagline: "Long grain non-basmati" }),
  // Potato
  base({ slug: "red-potato", name: "Red potato", category: "potato", subCategory: "Red", tagline: "Red-skin table potato" }),
  base({ slug: "white-potato", name: "White potato", category: "potato", subCategory: "White", tagline: "White-skin table potato" }),
  // Onion, Tomato
  base({ slug: "fresh-onion", name: "Fresh onion", category: "onion", tagline: "Wholesale fresh onion" }),
  base({ slug: "fresh-tomato", name: "Fresh tomato", category: "tomato", tagline: "Wholesale fresh tomato" }),
  // Spices
  base({ slug: "turmeric-powder", name: "Turmeric powder", category: "spices", tagline: "Ground turmeric" }),
  base({ slug: "red-chilli-powder", name: "Red chilli powder", category: "spices", tagline: "Ground red chilli" }),
];
