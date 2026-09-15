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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ValidationResult =
  | { ok: true; value: EnquiryInput }
  | { ok: false; errors: Partial<Record<keyof EnquiryInput, string>> };

export function validateEnquiry(input: Partial<EnquiryInput>, categorySlugs: string[]): ValidationResult {
  const v = Object.fromEntries(ENQUIRY_FIELDS.map((k) => [k, (input[k] ?? "").toString().trim()])) as unknown as EnquiryInput;
  const errors: Partial<Record<keyof EnquiryInput, string>> = {};

  if (!(ENQUIRY_TYPES as readonly string[]).includes(v.enquiryType)) errors.enquiryType = "Choose what you are asking for";
  if (v.fullName.length < 2) errors.fullName = "Enter your full name";
  if (!EMAIL.test(v.email)) errors.email = "Enter a valid email address";
  if (!categorySlugs.includes(v.category)) errors.category = "Choose a product category";
  if (v.destination.length < 2) errors.destination = "Enter the destination country or port";
  if (v.quantity.length < 1) errors.quantity = "Enter the quantity, for example 2 x 40ft containers";
  if (!(TRADE_TERMS as readonly string[]).includes(v.tradeTerm)) errors.tradeTerm = "Choose FOB or CIF";
  if (v.message.length < 10) errors.message = "Add a few details so we can quote accurately";
  if (v.message.length > 4000) errors.message = "Keep the message under 4000 characters";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: v };
}
