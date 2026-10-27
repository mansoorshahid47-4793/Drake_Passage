import type { Category, Product } from "@/lib/types";
import { PRODUCT_DETAILS } from "./productDetails";

const jpg = (folder: "categories" | "products", name: string) => `/images/${folder}/${name}.jpg`;

export const categories: Category[] = [
  { slug: "salt", name: "Salt", seoName: "Himalayan salt", tagline: "Himalayan pink salt from the Khewra mine",
    description: "Rock salt from Pakistan's Salt Range, offered as edible grades, cooking and grilling slabs, table and kitchen pieces, salt lamps, wellness products, home and decor items and industrial grades.",
    heroImage: jpg("categories", "salt"), slide: { kicker: "Himalayan", title: "Pink salt" },
    subCategories: ["Edible salt", "Cooking and grilling", "Table products", "Kitchen products", "Salt lamps", "Wellness products", "Home and decor", "Industrial products"],
    originPhotoIds: ["khewra-interior", "khewra-landscape", "salt-coarse", "salt-block"] },
  { slug: "rice", name: "Rice", seoName: "Basmati rice", tagline: "Basmati and non-Basmati rice from the Punjab plains",
    description: "Basmati and non-Basmati varieties from the Punjab plains, including Basmati 1121 steam (single and double), 1847 and 1509 sella, and non-Basmati IRRI-6, milled and graded for export.",
    heroImage: jpg("categories", "rice"), slide: { kicker: "Pakistani", title: "Basmati rice" },
    subCategories: ["Basmati", "Non-Basmati"],
    originPhotoIds: ["paddy-chunian"] },
  { slug: "potato", name: "Potatoes", seoName: "Potato", tagline: "Red and white table potatoes",
    description: "Red-skinned and white-skinned table potatoes, sorted and graded by size before dispatch.",
    heroImage: jpg("categories", "potato"), slide: { kicker: "Farm fresh", title: "Potatoes" },
    subCategories: ["Red", "White"] },
  { slug: "onion", name: "Onions", seoName: "Onion", tagline: "Fresh onions for wholesale buyers",
    description: "Fresh onions sorted and graded by size for wholesale and food-service buyers.",
    heroImage: jpg("categories", "onion"), slide: { kicker: "Farm fresh", title: "Onions" }, subCategories: [] },
  { slug: "spices", name: "Spices", seoName: "Spice", tagline: "Turmeric and red chilli powder",
    description: "Ground turmeric from Kasur and red chilli from Kunri, cleaned, milled and packed for retail or bulk buyers.",
    heroImage: jpg("categories", "spices"), slide: { kicker: "Pure ground", title: "Spices" }, subCategories: [] },
  { slug: "fruits", name: "Fruits", seoName: "Fruit", tagline: "Mango and Kinnow oranges",
    description: "Mangoes from southern Punjab and Sindh, and Kinnow oranges from Sargodha, graded and packed in cartons for export.",
    heroImage: jpg("categories", "fruits"), slide: { kicker: "Sweet and juicy", title: "Fruits" }, subCategories: [] },
];

const base = (p: Omit<Product, "images" | "specs" | "packagingOptions" | "supportedTradeTerms" | "certifications" | "summary"> & Partial<Product>): Product => {
  const d = PRODUCT_DETAILS[p.slug];
  return {
    images: [jpg("products", p.slug)],
    specs: d?.specs ?? [],
    packagingOptions: d?.packagingOptions ?? [],
    supportedTradeTerms: ["FOB", "CIF", "CNF", "Ex-Works"],
    certifications: [],
    summary: d?.overview ?? "Specifications, grades and packing options are confirmed per enquiry.",
    ...(d ? { origin: d.origin, process: d.process, uses: d.uses } : {}),
    ...p,
  };
};

const EDIBLE_SALT_PACKING = [
  "Printed stand-up zipper pouches with your brand, 500 g or 1 kg",
  "Plain stand-up pouches for your own labels, 500 g or 1 kg",
  "Cotton drawstring bags, 500 g or 1 kg",
  "25 kg or 30 kg PP bags for bulk buyers and repackers",
];

export const products: Product[] = [
  // Salt
  base({ slug: "dark-pink-food-grade-salt", name: "Dark pink food-grade salt", category: "salt", subCategory: "Edible salt", tagline: "Fine and coarse grades", packagingOptions: EDIBLE_SALT_PACKING }),
  base({ slug: "light-pink-food-grade-salt", name: "Light pink food-grade salt", category: "salt", subCategory: "Edible salt", tagline: "Fine and coarse grades", packagingOptions: EDIBLE_SALT_PACKING }),
  base({ slug: "white-food-grade-salt", name: "White Himalayan food-grade salt", category: "salt", subCategory: "Edible salt", tagline: "Fine and coarse grades", packagingOptions: EDIBLE_SALT_PACKING }),
  base({ slug: "black-salt", name: "Black Himalayan salt", category: "salt", subCategory: "Edible salt", tagline: "Fine and coarse grades",packagingOptions: EDIBLE_SALT_PACKING }),
  base({ slug: "grilling-slabs", name: "Salt grilling slabs", category: "salt", subCategory: "Cooking and grilling", tagline: "With metal or wooden holders" }),
  base({ slug: "salt-bowls-and-plates", name: "Salt bowls and serving plates", category: "salt", subCategory: "Table products", tagline: "Hand-carved serveware" }),
  base({ slug: "salt-pestle-and-mortar", name: "Salt pestle and mortar", category: "salt", subCategory: "Kitchen products", tagline: "Solid rock salt" }),
  base({ slug: "natural-pink-salt-lamps", name: "Natural pink salt lamps", category: "salt", subCategory: "Salt lamps", tagline: "Natural, fire-bowl and geometric" }),
  base({ slug: "bath-salt", name: "Himalayan bath salt", category: "salt", subCategory: "Wellness products", tagline: "Coarse and fine bath grades" }),
  base({ slug: "tea-lights-and-candle-holders", name: "Tea lights and candle holders", category: "salt", subCategory: "Home and decor", tagline: "Carved salt decor" }),
  base({ slug: "rock-salt-bricks-and-tiles", name: "Rock salt bricks and tiles", category: "salt", subCategory: "Industrial products", tagline: "For salt rooms and walls" }),
  base({ slug: "animal-licking-salt", name: "Animal licking salt", category: "salt", subCategory: "Industrial products", tagline: "Lick blocks for livestock" }),
  base({ slug: "industrial-rock-salt", name: "Industrial rock salt", category: "salt", subCategory: "Industrial products", tagline: "Bulk lumps and crushed" }),
  // Rice
  base({ slug: "basmati-1121-steam-single", name: "Basmati 1121 steam (single)", category: "rice", subCategory: "Basmati", tagline: "Extra-long grain, single steam" }),
  base({ slug: "basmati-1121-steam-double", name: "Basmati 1121 steam (double)", category: "rice", subCategory: "Basmati", tagline: "Extra-long grain, double steam" }),
  base({ slug: "basmati-1847", name: "Basmati 1847", category: "rice", subCategory: "Basmati", tagline: "Long grain Basmati" }),
  base({ slug: "basmati-1509-sella", name: "Basmati 1509 sella", category: "rice", subCategory: "Basmati", tagline: "Parboiled Basmati" }),
  base({ slug: "irri-6", name: "IRRI-6", category: "rice", subCategory: "Non-Basmati", tagline: "Long grain non-Basmati" }),
  // Potato
  base({ slug: "red-potato", name: "Red potato", category: "potato", subCategory: "Red", tagline: "Red-skin table potato" }),
  base({ slug: "white-potato", name: "White potato", category: "potato", subCategory: "White", tagline: "White-skin table potato" }),
  // Onion
  base({ slug: "fresh-onion", name: "Fresh onion", category: "onion", tagline: "Wholesale fresh onion" }),
  // Spices
  base({ slug: "turmeric-powder", name: "Turmeric powder", category: "spices", tagline: "Ground turmeric" }),
  base({ slug: "red-chilli-powder", name: "Red chilli powder", category: "spices", tagline: "Ground red chilli" }),
  // Fruits
  base({ slug: "mango", name: "Mango", category: "fruits", tagline: "Sindhri and Chaunsa varieties" }),
  base({ slug: "kinnow-orange", name: "Kinnow orange", category: "fruits", tagline: "Sargodha Kinnow" }),
];
