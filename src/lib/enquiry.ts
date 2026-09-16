export const ENQUIRY_TYPES = ["quote", "sample", "certificate"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
export const TRADE_TERMS = ["FOB", "CIF"] as const;

export interface EnquiryInput {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  category: string;
  product: string;
  destination: string;
  quantity: string;
  tradeTerm: string;
  message: string;
  enquiryType: string;
}

export const ENQUIRY_FIELDS: (keyof EnquiryInput)[] = [
  "enquiryType", "fullName", "email", "company", "phone", "category", "product", "destination", "quantity", "tradeTerm", "message",
];

// A category paired with the product slugs valid within it, used to check
// that `product` (when set) actually belongs to the chosen `category`.
export type EnquiryCatalog = { slug: string; products: string[] }[];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Strip ASCII control characters (including CR/LF) from every single-line
// field. This is the main defense against header/body injection into the
// email provider (e.g. a `product` value of "\r\nBcc: x" reaching the
// provider as literal CRLF) and keeps stored/rendered values free of
// non-printable noise.
const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;
// `message` is a multi-line field, so it keeps \n, \r and \t and only strips
// the remaining control characters.
const MESSAGE_CONTROL_CHARS = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;

const MAX_LENGTHS = {
  fullName: 200, company: 200, destination: 200, quantity: 200,
  email: 254, phone: 40, product: 100, message: 4000,
} as const;

export type ValidationResult =
  | { ok: true; value: EnquiryInput }
  | { ok: false; errors: Partial<Record<keyof EnquiryInput, string>> };

export function validateEnquiry(input: Record<string, unknown>, catalog: EnquiryCatalog): ValidationResult {
  const v = Object.fromEntries(
    ENQUIRY_FIELDS.map((k) => {
      // Non-string values (numbers, booleans, objects, arrays, ...) are
      // rejected rather than coerced to a string, so e.g. `fullName: {}`
      // fails validation instead of becoming "[object Object]".
      const raw = typeof input[k] === "string" ? (input[k] as string) : "";
      const clean = raw.replace(k === "message" ? MESSAGE_CONTROL_CHARS : CONTROL_CHARS, "");
      return [k, clean.trim()];
    }),
  ) as unknown as EnquiryInput;
  const errors: Partial<Record<keyof EnquiryInput, string>> = {};

  if (!(ENQUIRY_TYPES as readonly string[]).includes(v.enquiryType)) errors.enquiryType = "Choose what you are asking for";

  if (v.fullName.length < 2) errors.fullName = "Enter your full name";
  else if (v.fullName.length > MAX_LENGTHS.fullName) errors.fullName = "Keep your name under 200 characters";

  if (!EMAIL.test(v.email)) errors.email = "Enter a valid email address";
  else if (v.email.length > MAX_LENGTHS.email) errors.email = "Keep your email under 254 characters";

  if (v.company.length > MAX_LENGTHS.company) errors.company = "Keep the company name under 200 characters";

  if (v.phone.length > MAX_LENGTHS.phone) errors.phone = "Keep the phone number under 40 characters";

  const categoryEntry = catalog.find((c) => c.slug === v.category);
  if (!categoryEntry) errors.category = "Choose a product category";

  if (v.product.length > MAX_LENGTHS.product) errors.product = "Keep the product under 100 characters";
  else if (v.product && categoryEntry && !categoryEntry.products.includes(v.product)) {
    errors.product = "Choose a product from the selected category";
  }

  if (v.destination.length < 2) errors.destination = "Enter the destination country or port";
  else if (v.destination.length > MAX_LENGTHS.destination) errors.destination = "Keep the destination under 200 characters";

  if (v.quantity.length < 1) errors.quantity = "Enter the quantity, for example 2 x 40ft containers";
  else if (v.quantity.length > MAX_LENGTHS.quantity) errors.quantity = "Keep the quantity under 200 characters";

  if (!(TRADE_TERMS as readonly string[]).includes(v.tradeTerm)) errors.tradeTerm = "Choose FOB or CIF";

  if (v.message.length < 10) errors.message = "Add a few details so we can quote accurately";
  else if (v.message.length > MAX_LENGTHS.message) errors.message = "Keep the message under 4000 characters";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: v };
}
