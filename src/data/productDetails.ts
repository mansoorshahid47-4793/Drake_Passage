import type { ProductSpec } from "@/lib/types";

export interface ProductDetails {
  overview: string;        // 2–3 sentences: what it is, who buys it, what it's used for
  origin: string;          // 1–2 sentences: where in Pakistan it is sourced (real producing regions)
  process: string;         // 2–3 sentences: how it is sourced, cleaned/sorted/graded/milled and packed for export
  specs: ProductSpec[];    // 4–7 rows of {label, value}
  packagingOptions: string[]; // 3–5 export packing options
  uses?: string[];         // optional, 3–5 short items
}

// Same list as EDIBLE_SALT_PACKING in catalog.ts (client-confirmed packing).
const EDIBLE_SALT_PACKING = [
  "Printed stand-up zipper pouches with your brand, 500 g or 1 kg",
  "Plain stand-up pouches for your own labels, 500 g or 1 kg",
  "Cotton drawstring bags, 500 g or 1 kg",
  "25 kg or 30 kg PP bags for bulk buyers and repackers",
];

const SALT_ORIGIN =
  "Mined from the Khewra salt deposits in the Salt Range, Jhelum district, Punjab, one of the oldest and largest rock salt deposits in the world.";

const RICE_ORIGIN_PUNJAB =
  "Sourced from growers and mills in the Basmati belt of Punjab, mainly Gujranwala, Sheikhupura, Hafizabad and the Kallar belt around Sialkot and Narowal.";

export const PRODUCT_DETAILS: Record<string, ProductDetails> = {
  // ---------------------------------------------------------------- Salt
  "dark-pink-food-grade-salt": {
    overview:
      "Dark pink Himalayan rock salt for food use, with a deeper colour from its natural iron oxide content. It is bought by food brands, spice packers, distributors and repackers for retail jars, grinders and food manufacturing.",
    origin: SALT_ORIGIN + " Darker seams are selected for this grade.",
    process:
      "Rock salt is selected by colour at the mine, then washed, sun-dried and crushed. It is sieved into fine and coarse grades, passed over magnets to remove metal particles and packed to the buyer's chosen size and label.",
    specs: [
      { label: "Colour", value: "Dark pink to reddish pink" },
      { label: "Sodium chloride (NaCl)", value: "Min 97% (typical)" },
      { label: "Moisture", value: "Max 0.2%" },
      { label: "Insoluble matter", value: "Max 0.5% (typical)" },
      { label: "Grain sizes", value: "Fine 0–1 mm, medium 1–3 mm, coarse 2–5 mm" },
      { label: "Additives", value: "None, no anti-caking agent unless requested" },
    ],
    packagingOptions: EDIBLE_SALT_PACKING,
    uses: ["Table and cooking salt", "Salt grinders and shakers", "Seasoning blends", "Food processing"],
  },
  "light-pink-food-grade-salt": {
    overview:
      "Light pink Himalayan rock salt for food use, the most widely traded colour of Himalayan salt. Retail brands, distributors and food manufacturers buy it for table salt, grinders and seasoning blends.",
    origin: SALT_ORIGIN,
    process:
      "Light pink rock is sorted by colour, washed, dried and crushed. The salt is screened into fine and coarse grain sizes, passed over magnets and checked for colour consistency before packing.",
    specs: [
      { label: "Colour", value: "Light pink, even shade" },
      { label: "Sodium chloride (NaCl)", value: "Min 98% (typical)" },
      { label: "Moisture", value: "Max 0.2%" },
      { label: "Insoluble matter", value: "Max 0.5% (typical)" },
      { label: "Grain sizes", value: "Fine 0–1 mm, medium 1–3 mm, coarse 2–5 mm" },
      { label: "Additives", value: "None, no anti-caking agent unless requested" },
    ],
    packagingOptions: EDIBLE_SALT_PACKING,
    uses: ["Table and cooking salt", "Salt grinders and shakers", "Seasoning blends", "Food processing"],
  },
  "white-food-grade-salt": {
    overview:
      "White Himalayan rock salt from the clearer, low-iron seams of the Salt Range. It suits buyers who want natural rock salt without the pink colour, for table salt, food processing and seasoning.",
    origin: SALT_ORIGIN + " White and translucent rock is selected for this grade.",
    process:
      "White rock is hand-sorted from coloured pieces, washed, dried and crushed. It is sieved into fine and coarse grades, passed over magnets and packed in clean, food-grade packing.",
    specs: [
      { label: "Colour", value: "White to off-white, translucent" },
      { label: "Sodium chloride (NaCl)", value: "Min 98.5% (typical)" },
      { label: "Moisture", value: "Max 0.2%" },
      { label: "Insoluble matter", value: "Max 0.3% (typical)" },
      { label: "Grain sizes", value: "Fine 0–1 mm, medium 1–3 mm, coarse 2–5 mm" },
      { label: "Additives", value: "None, no anti-caking agent unless requested" },
    ],
    packagingOptions: EDIBLE_SALT_PACKING,
    uses: ["Table and cooking salt", "Food processing and brining", "Baking", "Seasoning blends"],
  },
  "black-salt": {
    overview:
      "Black salt is Himalayan rock salt that has been kiln-fired with plant material, which gives it a sulphurous aroma and a tangy taste. Spice packers, food brands and ethnic grocery distributors buy it for snacks, fruit seasoning, sauces, drinks and vegan egg-style dishes.",
    origin:
      "Made from rock salt mined in the Salt Range, Jhelum district, Punjab, then fired and processed by salt processors in Punjab.",
    process:
      "Rock salt is heated in kilns with plant material until it turns dark, then cooled, crushed and ground. It is sieved into lumps, coarse granules or fine powder and packed in moisture-proof packing to keep its aroma.",
    specs: [
      { label: "Colour", value: "Dark brownish black lumps, pinkish grey when ground" },
      { label: "Aroma", value: "Distinct sulphurous aroma" },
      { label: "Composition", value: "Mainly sodium chloride, with natural sulphur compounds" },
      { label: "Moisture", value: "Max 0.5% (typical)" },
      { label: "Forms", value: "Lumps, coarse granules 1–3 mm, fine powder" },
    ],
    packagingOptions: EDIBLE_SALT_PACKING,
    uses: ["Snacks and fruit seasoning", "Sauces and dips","Drinks", "Vegan egg-style dishes"],
  },
  "grilling-slabs": {
    overview:
      "Solid Himalayan salt blocks cut and polished for cooking, grilling and serving. Kitchenware importers, barbecue retailers and gift brands buy them, either as plain slabs or sets with metal or wooden holders.",
    origin: SALT_ORIGIN,
    process:
      "Large, dense salt blocks are selected for low cracking, cut to size on saws and sanded smooth on the cooking face. Each slab is checked for cracks before wrapping and packing in protective cartons.",
    specs: [
      { label: "Common sizes", value: "8 x 8 x 1.5 in, 8 x 12 x 1.5 in, 12 x 12 x 2 in" },
      { label: "Weight", value: "Approx. 3.5–9 kg depending on size" },
      { label: "Shapes", value: "Square, rectangular and round" },
      { label: "Finish", value: "Smooth polished cooking surface" },
      { label: "Holders", value: "Metal or wooden holders available" },
      { label: "Custom sizes", value: "Custom sizes and shapes on request" },
    ],
    packagingOptions: [
      "Shrink-wrapped slab in individual printed or plain box",
      "Gift box set with metal or wooden holder",
      "Bubble-wrapped slabs in 5-ply master cartons",
      "Palletised cartons for full container loads",
    ],
    uses: ["Grilling meat, fish and vegetables", "Serving chilled food", "Searing and curing", "Gift sets"],
  },
  "salt-bowls-and-plates": {
    overview:
      "Bowls, plates and serving dishes carved from solid Himalayan rock salt. They are sold by homeware and kitchenware retailers and gift brands for serving, presentation and decoration.",
    origin: SALT_ORIGIN,
    process:
      "Solid salt pieces are selected, cut and shaped by hand and on lathes, then sanded and polished. Each piece is checked for cracks and finish before individual wrapping and boxing.",
    specs: [
      { label: "Items", value: "Bowls, round and square plates, platters, shot glasses" },
      { label: "Bowl sizes", value: "Approx. 3–8 in diameter" },
      { label: "Plate sizes", value: "Approx. 6–12 in" },
      { label: "Colour", value: "Pink, light pink or white" },
      { label: "Finish", value: "Smooth polished" },
      { label: "Custom sizes", value: "Custom sizes and designs on request" },
    ],
    packagingOptions: [
      "Individual printed or plain gift box",
      "Bubble-wrapped pieces in 5-ply master cartons",
      "Mixed-item sets in gift packing",
      "Palletised cartons for full container loads",
    ],
    uses: ["Serving dips, nuts and salads", "Food presentation", "Decor and gifting"],
  },
  "salt-pestle-and-mortar": {
    overview:
      "A pestle and mortar carved from solid Himalayan rock salt, used to grind herbs and spices while adding a light seasoning. Kitchenware and gift retailers buy them as single items or in sets.",
    origin: SALT_ORIGIN,
    process:
      "Dense rock salt is selected, turned and hollowed on a lathe, then sanded smooth. Each set is checked for cracks before wrapping and boxing.",
    specs: [
      { label: "Mortar sizes", value: "Approx. 4 in, 5 in and 6 in diameter" },
      { label: "Weight", value: "Approx. 1.5–3.5 kg per set" },
      { label: "Colour", value: "Pink or light pink" },
      { label: "Finish", value: "Smooth outer finish, textured grinding surface" },
      { label: "Custom sizes", value: "Custom sizes on request" },
    ],
    packagingOptions: [
      "Individual printed or plain gift box",
      "Bubble-wrapped sets in 5-ply master cartons",
      "Palletised cartons for full container loads",
    ],
    uses: ["Grinding herbs and spices", "Making pastes and rubs", "Kitchen gifting"],
  },
  "natural-pink-salt-lamps": {
    overview:
      "Lamps carved from Himalayan rock salt and fitted with a bulb holder on a wooden base. Home decor retailers, wellness shops and online sellers buy them in natural rough shapes, fire bowls and geometric designs.",
    origin: SALT_ORIGIN,
    process:
      "Salt rock is shaped by hand for natural lamps or cut and polished for geometric shapes, then drilled for the bulb holder and fixed to a hardwood base. Lamps are graded by weight, wrapped and boxed individually.",
    specs: [
      { label: "Styles", value: "Natural, fire bowl, sphere, pyramid and other geometric shapes" },
      { label: "Weight range", value: "Approx. 2–3 kg up to 30 kg and above" },
      { label: "Colour", value: "Pink, orange-pink or white" },
      { label: "Base", value: "Hardwood base, natural or polished" },
      { label: "Electrical fittings", value: "Cord, switch and bulb to suit the buyer's market on request" },
      { label: "Custom shapes", value: "Custom shapes and sizes on request" },
    ],
    packagingOptions: [
      "Individual printed or plain box with foam or bubble wrap",
      "Retail-ready gift box with buyer's branding",
      "Master cartons by weight grade",
      "Palletised cartons for full container loads",
    ],
    uses: ["Home decor and night lighting", "Gift retail", "Spa and wellness interiors"],
  },
  "bath-salt": {
    overview:
      "Himalayan rock salt screened into bath grades for soaking, scrubs and spa use. Cosmetic brands, spas and wellness retailers buy it plain or for blending with oils and fragrances.",
    origin: SALT_ORIGIN,
    process:
      "Rock salt is washed, dried and crushed, then sieved into fine, medium and coarse bath grades. It is packed plain for blending or in retail packs for the buyer's label.",
    specs: [
      { label: "Colour", value: "Pink, light pink or white" },
      { label: "Grain sizes", value: "Fine 0.5–1 mm, medium 2–5 mm, coarse 5–10 mm" },
      { label: "Sodium chloride (NaCl)", value: "Min 97% (typical)" },
      { label: "Moisture", value: "Max 0.2%" },
      { label: "Additives", value: "Plain, scents and oils added by the buyer or on request" },
    ],
    packagingOptions: [
      "Stand-up zipper pouches, plain or printed, 250 g to 1 kg",
      "Cotton drawstring bags",
      "Glass or PET jars for retail",
      "25 kg PP bags for bulk buyers and blenders",
    ],
    uses: ["Bath soaks", "Body scrubs", "Foot soaks", "Spa treatments"],
  },
  "tea-lights-and-candle-holders": {
    overview:
      "Candle and tea light holders carved from Himalayan rock salt, which glow when lit. Home decor and gift retailers buy them in single, double and multi-hole designs and in natural or geometric shapes.",
    origin: SALT_ORIGIN,
    process:
      "Salt pieces are cut or hand-shaped, drilled to fit standard tea lights and sanded smooth. Finished holders are checked, wrapped and boxed individually or in sets.",
    specs: [
      { label: "Styles", value: "Natural, square, round, heart and multi-hole" },
      { label: "Size", value: "Approx. 3–4 in for single holders" },
      { label: "Weight", value: "Approx. 0.5–1.5 kg per piece" },
      { label: "Holes", value: "1, 2, 3 or 4 tea light holes" },
      { label: "Custom designs", value: "Custom shapes and sizes on request" },
    ],
    packagingOptions: [
      "Individual printed or plain gift box",
      "Gift sets with tea lights included",
      "Bubble-wrapped pieces in 5-ply master cartons",
      "Palletised cartons for full container loads",
    ],
    uses: ["Home decor", "Gift retail", "Spa and restaurant table settings"],
  },
  "rock-salt-bricks-and-tiles": {
    overview:
      "Himalayan salt bricks and tiles cut to size for building salt rooms, feature walls and spa interiors. Interior contractors, spa builders and wellness centres buy them in standard and custom sizes.",
    origin: SALT_ORIGIN,
    process:
      "Large salt blocks are cut on saws into bricks and tiles, then left rough or sanded smooth. Pieces are checked for size and cracks and packed on wooden pallets for shipping.",
    specs: [
      { label: "Standard brick", value: "8 x 4 x 2 in (approx. 200 x 100 x 50 mm)" },
      { label: "Standard tiles", value: "8 x 4 x 1 in and 8 x 8 x 1 in" },
      { label: "Weight", value: "Approx. 3.5 kg per standard brick" },
      { label: "Finish", value: "Natural rough, smooth or polished" },
      { label: "Colour", value: "Pink, light pink or mixed" },
      { label: "Custom sizes", value: "Custom sizes on request" },
    ],
    packagingOptions: [
      "Shrink-wrapped on fumigated wooden pallets",
      "5-ply cartons on pallets",
      "Wooden crates for polished tiles",
    ],
    uses: ["Salt rooms and spa walls", "Feature and backlit walls", "Saunas", "Bar and restaurant interiors"],
  },
  "animal-licking-salt": {
    overview:
      "Natural rock salt lick blocks for cattle, horses, sheep and goats. Livestock farms, feed suppliers and farm stores buy them as a natural source of salt and trace minerals.",
    origin: SALT_ORIGIN,
    process:
      "Natural salt lumps are selected by weight and shaped where needed, then drilled and fitted with a rope for hanging. Blocks are packed by weight grade in bags or cartons.",
    specs: [
      { label: "Weight range", value: "Approx. 2–5 kg, larger blocks up to 10 kg" },
      { label: "Shape", value: "Natural lumps or shaped blocks" },
      { label: "Fitting", value: "Drilled with rope for hanging" },
      { label: "Sodium chloride (NaCl)", value: "Min 95% (typical), with natural trace minerals" },
      { label: "Custom sizes", value: "Custom weights on request" },
    ],
    packagingOptions: [
      "25 kg PP bags",
      "Jumbo bags of about 1 tonne",
      "Cartons by weight grade",
      "Shrink-wrapped pallets",
    ],
    uses: ["Cattle", "Horses", "Sheep and goats", "Deer and game farms"],
  },
  "industrial-rock-salt": {
    overview:
      "Rock salt supplied in bulk as lumps or crushed grades for industrial use. It is bought by water treatment companies, chemical and tanning industries and road authorities for de-icing.",
    origin: SALT_ORIGIN,
    process:
      "Run-of-mine rock salt is crushed and screened to the size the buyer needs, or shipped as lumps. It is loaded in bulk bags or smaller bags for container shipment.",
    specs: [
      { label: "Forms", value: "Lumps and crushed grades" },
      { label: "Lump size", value: "Approx. 5–20 cm" },
      { label: "Crushed grades", value: "0–5 mm, 5–10 mm or as per buyer's specification" },
      { label: "Sodium chloride (NaCl)", value: "Min 95% (typical)" },
      { label: "Moisture", value: "Max 0.5% (typical)" },
    ],
    packagingOptions: [
      "25 kg or 50 kg PP bags",
      "Jumbo bags of about 1 tonne",
      "Loose bulk in lined containers on request",
    ],
    uses: ["Road de-icing", "Water softening", "Chemical industry", "Leather tanning"],
  },

  // ---------------------------------------------------------------- Rice
  "basmati-1121-steam-single": {
    overview:
      "Basmati 1121 is an extra-long grain Basmati known for its length after cooking. The single steam grade is lightly steamed paddy milled to a creamy white grain, bought by importers, wholesalers and food-service buyers for biryani, pulao and plain rice.",
    origin: RICE_ORIGIN_PUNJAB,
    process:
      "Paddy is steamed once and dried before milling, which firms the grain and reduces breakage. It is then hulled, polished, sortexed (colour sorted) and graded by length to remove broken, chalky and discoloured grains before packing.",
    specs: [
      { label: "Average grain length", value: "8.3–8.4 mm (typical)" },
      { label: "Moisture", value: "Max 12.5%" },
      { label: "Broken grains", value: "Max 1%" },
      { label: "Damaged and discoloured", value: "Max 0.5%" },
      { label: "Purity", value: "Min 95%" },
      { label: "Colour", value: "Creamy white" },
      { label: "Processing", value: "Single steam, double polished, sortexed" },
    ],
    packagingOptions: [
      "1 kg and 5 kg printed or plain retail bags",
      "10 kg and 20 kg non-woven or BOPP bags",
      "25 kg and 50 kg PP bags",
      "Private label packing to buyer's design",
    ],
    uses: ["Biryani and pulao", "Plain steamed rice", "Restaurants and catering"],
  },
  "basmati-1121-steam-double": {
    overview:
      "The double steam grade of Basmati 1121 is steamed twice before milling, giving a firmer grain that cooks separate and elongates well. It is bought by importers, wholesalers, restaurants and caterers who need consistent cooking in large batches.",
    origin: RICE_ORIGIN_PUNJAB,
    process:
      "Paddy is steamed twice and dried, then hulled, polished and sortexed. The rice is graded by length to remove broken, chalky and discoloured grains, then packed to the buyer's size and label.",
    specs: [
      { label: "Average grain length", value: "8.3–8.4 mm (typical)" },
      { label: "Moisture", value: "Max 12.5%" },
      { label: "Broken grains", value: "Max 1%" },
      { label: "Damaged and discoloured", value: "Max 0.5%" },
      { label: "Purity", value: "Min 95%" },
      { label: "Colour", value: "Creamy to light golden" },
      { label: "Processing", value: "Double steam, double polished, sortexed" },
    ],
    packagingOptions: [
      "1 kg and 5 kg printed or plain retail bags",
      "10 kg and 20 kg non-woven or BOPP bags",
      "25 kg and 50 kg PP bags",
      "Private label packing to buyer's design",
    ],
    uses: ["Biryani and pulao", "Restaurants and catering", "Bulk cooking"],
  },
  "basmati-1847": {
    overview:
      "Basmati 1847 is a long grain Basmati variety grown in Punjab, valued for its aroma and good elongation on cooking. Importers and wholesalers buy it as raw (white) and steam rice for retail and food service.",
    origin: RICE_ORIGIN_PUNJAB,
    process:
      "Paddy is milled as raw rice or steamed before milling, then polished and sortexed. Grains are graded by length to remove broken, chalky and discoloured grains before packing.",
    specs: [
      { label: "Average grain length", value: "7.8–8.0 mm (typical)" },
      { label: "Moisture", value: "Max 12.5%" },
      { label: "Broken grains", value: "Max 2%" },
      { label: "Damaged and discoloured", value: "Max 0.5%" },
      { label: "Purity", value: "Min 95%" },
      { label: "Types", value: "Raw (white) and steam, on request" },
    ],
    packagingOptions: [
      "1 kg and 5 kg printed or plain retail bags",
      "10 kg and 20 kg non-woven or BOPP bags",
      "25 kg and 50 kg PP bags",
      "Private label packing to buyer's design",
    ],
    uses: ["Biryani and pulao", "Plain steamed rice", "Retail packs"],
  },
  "basmati-1509-sella": {
    overview:
      "Basmati 1509 sella is a parboiled long grain Basmati with a golden or creamy colour. Parboiling makes the grain hard and non-sticky, so it is popular with restaurants, caterers and wholesalers, especially in Gulf markets.",
    origin: RICE_ORIGIN_PUNJAB,
    process:
      "Paddy is soaked, steamed and dried before milling, which sets the starch and gives the sella colour. It is then hulled, polished, sortexed and graded by length before packing.",
    specs: [
      { label: "Average grain length", value: "8.2 mm (typical)" },
      { label: "Moisture", value: "Max 12.5%" },
      { label: "Broken grains", value: "Max 1%" },
      { label: "Damaged and discoloured", value: "Max 0.5%" },
      { label: "Purity", value: "Min 95%" },
      { label: "Colour", value: "Golden sella or creamy (white) sella" },
    ],
    packagingOptions: [
      "5 kg printed or plain retail bags",
      "10 kg and 20 kg non-woven or BOPP bags",
      "25 kg, 39 kg and 50 kg PP bags",
      "Private label packing to buyer's design",
    ],
    uses: ["Biryani and kabsa", "Restaurants and catering", "Bulk cooking"],
  },
  "irri-6": {
    overview:
      "IRRI-6 is a long grain non-Basmati white rice, one of the main rice exports of Pakistan. It is bought by importers, wholesalers, food programmes and processors in Africa, the Middle East and Asia for everyday cooking.",
    origin:
      "Grown mainly in Sindh (Larkana, Shikarpur, Jacobabad and Thatta) and in the Nasirabad division of Balochistan, with some production in southern Punjab.",
    process:
      "Paddy is hulled, milled and polished, then sortexed and graded by the percentage of broken grains. Lots are blended to the grade the buyer needs and packed in PP bags.",
    specs: [
      { label: "Average grain length", value: "6.0 mm (typical)" },
      { label: "Moisture", value: "Max 14%" },
      { label: "Broken grains", value: "Grades of 5%, 10%, 15%, 25% and 100% broken" },
      { label: "Damaged and discoloured", value: "Max 1% (typical for 5% grade)" },
      { label: "Chalky grains", value: "Max 6% (typical)" },
      { label: "Processing", value: "Long grain white, double polished, sortexed" },
    ],
    packagingOptions: [
      "25 kg and 50 kg PP bags",
      "5 kg and 10 kg retail bags on request",
      "Jumbo bags for processors",
      "Private label packing to buyer's design",
    ],
    uses: ["Everyday cooking", "Food programmes and institutions", "Flour and food processing (broken grades)"],
  },

  // ---------------------------------------------------------------- Potato
  "red-potato": {
    overview:
      "Red-skinned table potatoes with firm, light yellow flesh, suited to boiling, roasting and frying. They are bought by wholesale markets, supermarket suppliers and food-service buyers in the Gulf, Central Asia and the Far East.",
    origin:
      "Sourced from growers in the main potato districts of Punjab, including Okara, Sahiwal, Pakpattan and Depalpur.",
    process:
      "Potatoes are harvested at maturity, cured and moved to cold storage where needed. Before dispatch they are cleaned of soil, sorted to remove cut, green and diseased tubers, graded by size and packed in mesh or jute bags.",
    specs: [
      { label: "Skin and flesh", value: "Red skin, light yellow flesh" },
      { label: "Size grades", value: "40–60 mm, 60–80 mm and above 80 mm, or as per buyer's specification" },
      { label: "Weight per tuber", value: "Approx. 80–150 g, 150–250 g and 250 g and above" },
      { label: "Quality", value: "Firm, clean, free from cuts, greening and rot" },
      { label: "Main season", value: "Fresh harvest January to March, cold store supply after" },
      { label: "Shipping", value: "Reefer containers at controlled temperature" },
    ],
    packagingOptions: [
      "10 kg, 25 kg and 50 kg mesh bags",
      "25 kg and 50 kg jute bags",
      "Cartons on request",
      "Buyer's printed bags on request",
    ],
    uses: ["Wholesale and retail markets", "Restaurants and catering", "Boiling, roasting and frying"],
  },
  "white-potato": {
    overview:
      "White and pale yellow-skinned table potatoes for household cooking and processing. Wholesalers, supermarket suppliers and food-service buyers purchase them for general cooking, chips and fries.",
    origin:
      "Sourced from growers in the main potato districts of Punjab, including Okara, Sahiwal, Pakpattan and Depalpur.",
    process:
      "Potatoes are harvested at maturity, cured and kept in cold storage where needed. Before dispatch they are cleaned, sorted to remove damaged and green tubers, graded by size and packed in mesh or jute bags.",
    specs: [
      { label: "Skin and flesh", value: "White to pale yellow skin, white to cream flesh" },
      { label: "Size grades", value: "40–60 mm, 60–80 mm and above 80 mm, or as per buyer's specification" },
      { label: "Weight per tuber", value: "Approx. 80–150 g, 150–250 g and 250 g and above" },
      { label: "Quality", value: "Firm, clean, free from cuts, greening and rot" },
      { label: "Main season", value: "Fresh harvest January to March, cold store supply after" },
      { label: "Shipping", value: "Reefer containers at controlled temperature" },
    ],
    packagingOptions: [
      "10 kg, 25 kg and 50 kg mesh bags",
      "25 kg and 50 kg jute bags",
      "Cartons on request",
      "Buyer's printed bags on request",
    ],
    uses: ["Wholesale and retail markets", "Chips and fries", "Restaurants and catering"],
  },

  // ---------------------------------------------------------------- Onion
  "fresh-onion": {
    overview:
      "Fresh red onions with dry outer skin and firm bulbs, suited to long transit. They are bought by wholesale markets, importers and food-service buyers, mainly in the Gulf, Malaysia, Sri Lanka and East Africa.",
    origin:
      "Sourced from growers in Sindh (Hyderabad, Mirpurkhas, Tando Allahyar and Badin) and Balochistan (Kalat and Mastung), with additional supply from Punjab, which spreads availability across much of the year.",
    process:
      "Onions are field-cured to dry the necks and outer skin, then topped, cleaned of loose skin and soil and sorted to remove soft, sprouted and damaged bulbs. They are graded by diameter and packed in ventilated mesh bags.",
    specs: [
      { label: "Type", value: "Red onion, dry skin" },
      { label: "Size grades", value: "40–60 mm, 50–70 mm, 60–80 mm and above 80 mm" },
      { label: "Quality", value: "Firm, well-cured, free from sprouting and rot" },
      { label: "Main supply", value: "Balochistan August to November, Sindh October to March" },
      { label: "Shipping", value: "Ventilated or reefer containers" },
    ],
    packagingOptions: [
      "5 kg, 10 kg and 25 kg mesh bags",
      "20 kg and 25 kg jute bags",
      "Buyer's printed mesh bags on request",
    ],
    uses: ["Wholesale and retail markets", "Restaurants and catering", "Food processing"],
  },

  // ---------------------------------------------------------------- Spices
  "turmeric-powder": {
    overview:
      "Ground turmeric made from dried turmeric fingers, with a bright yellow colour and earthy flavour. Spice packers, food manufacturers and wholesalers buy it for retail packs, curry blends and food colouring.",
    origin: "Turmeric is sourced from growers in Kasur district, Punjab, the main turmeric-producing area of Pakistan.",
    process:
      "Fresh rhizomes are boiled, sun-dried and polished, then cleaned of stones and dust. The dried fingers are milled, sieved to the required mesh and tested before packing.",
    specs: [
      { label: "Colour", value: "Bright yellow to yellow orange" },
      { label: "Curcumin", value: "Approx. 2–3% (typical), tested per lot" },
      { label: "Moisture", value: "Max 10%" },
      { label: "Total ash", value: "Max 7%" },
      { label: "Acid insoluble ash", value: "Max 1.5%" },
      { label: "Mesh size", value: "60–80 mesh or as per buyer's specification" },
      { label: "Additives", value: "None, no added colour" },
    ],
    packagingOptions: [
      "Retail pouches from 50 g to 1 kg, plain or printed",
      "Private label packing to buyer's design",
      "25 kg paper bags with poly liner",
      "25 kg PP bags with inner liner",
    ],
    uses: ["Curry powders and spice blends", "Retail spice packs", "Food colouring", "Food manufacturing"],
  },
  "red-chilli-powder": {
    overview:
      "Ground red chilli made from sun-dried whole chillies, with a strong red colour and medium to high heat. Spice packers, food manufacturers and wholesalers buy it for retail packs, sauces, snacks and spice blends.",
    origin:
      "Chillies are sourced from growers around Kunri in Umerkot district, Sindh, the main chilli market of Pakistan, with additional supply from other parts of Sindh.",
    process:
      "Dried chillies are sorted to remove stems, discoloured pods and foreign matter, then cleaned and milled. The powder is sieved to the required mesh and tested before packing.",
    specs: [
      { label: "Colour", value: "Bright red to deep red" },
      { label: "Pungency", value: "Medium to hot, heat grades on request" },
      { label: "Moisture", value: "Max 11%" },
      { label: "Total ash", value: "Max 8%" },
      { label: "Mesh size", value: "40–60 mesh or as per buyer's specification" },
      { label: "Aflatoxin", value: "Tested per lot to buyer's limits" },
      { label: "Additives", value: "None, no added colour" },
    ],
    packagingOptions: [
      "Retail pouches from 50 g to 1 kg, plain or printed",
      "Private label packing to buyer's design",
      "25 kg paper bags with poly liner",
      "25 kg PP bags with inner liner",
    ],
    uses: ["Spice blends", "Sauces and pickles", "Snack seasoning", "Retail spice packs"],
  },

  // ---------------------------------------------------------------- Fruits
  mango: {
    overview:
      "Fresh Pakistani mangoes, mainly the Sindhri and Chaunsa varieties, known for sweetness, aroma and fibre-free flesh. They are bought by fruit importers, wholesale markets and supermarket suppliers in the Gulf, the UK, Europe and Asia.",
    origin:
      "Sindhri is sourced from orchards around Mirpurkhas and Hyderabad in Sindh, and Chaunsa from Multan, Muzaffargarh and Rahim Yar Khan in southern Punjab.",
    process:
      "Mangoes are picked at mature green stage, de-sapped and washed, then sorted and graded by weight and appearance. Hot water treatment is applied where the destination market requires it, and the fruit is packed in ventilated cartons and pre-cooled before shipment.",
    specs: [
      { label: "Varieties", value: "Sindhri, Chaunsa (white and black) and others on request" },
      { label: "Fruit weight", value: "Approx. 250–700 g depending on variety and grade" },
      { label: "Count per carton", value: "Approx. 6–12 fruits per carton, by size" },
      { label: "Quality", value: "Clean, sound fruit, free from sap burn and pest damage" },
      { label: "Shipping", value: "Air freight or reefer containers" },
    ],
    packagingOptions: [
      "2.5 kg ventilated corrugated cartons",
      "4 kg and 5 kg ventilated corrugated cartons",
      "Cartons with foam nets or trays",
      "Buyer's printed cartons on request",
    ],
    uses: ["Fresh fruit retail", "Wholesale markets", "Juice and pulp processing"],
  },
  "kinnow-orange": {
    overview:
      "Kinnow is a mandarin grown widely in Pakistan, with bright orange, easy-peel skin and juicy, sweet and tangy flesh. It is bought by fruit importers and wholesale markets in the Gulf, Russia, Central Asia and South East Asia.",
    origin:
      "Sourced from orchards in Sargodha district, Punjab, mainly around Bhalwal, Kot Momin and Sillanwali, which is the main kinnow-growing area of Pakistan.",
    process:
      "Fruit is picked by hand and taken to packing houses, where it is washed, treated with fungicide, waxed and dried. It is then graded by size and colour, packed in ventilated cartons and pre-cooled before loading into reefer containers.",
    specs: [
      { label: "Size", value: "Approx. 55–80 mm diameter" },
      { label: "Count sizes", value: "48 to 120 count per 10 kg carton" },
      { label: "Colour", value: "Bright orange, full colour" },
      { label: "Treatment", value: "Washed, waxed and graded" },
      { label: "Shipping", value: "Reefer containers at controlled temperature" },
    ],
    packagingOptions: [
      "10 kg ventilated corrugated cartons",
      "8 kg and 13 kg cartons on request",
      "Mesh bags for wholesale markets",
      "Buyer's printed cartons on request",
    ],
    uses: ["Fresh fruit retail", "Wholesale markets", "Juice processing"],
  },
};
