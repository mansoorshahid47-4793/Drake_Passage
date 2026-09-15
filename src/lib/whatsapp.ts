import { company } from "@/data/company";

export function whatsAppUrl(message = "Hello Drake Passage, I would like an export quote."): string {
  return `https://wa.me/${company.phoneE164}?text=${encodeURIComponent(message)}`;
}
