import { company } from "@/data/company";

export const PROCESS_STEPS = [
  { title: "Enquiry", detail: "Send your requirement by WhatsApp or the enquiry form: product, quantity, destination." },
  { title: "Quote", detail: `We quote ${company.tradeTerms.join(" or ")} for your port, with packing options and lead time.` },
  { title: "Sample", detail: `Samples are dispatched by ${company.sampleCouriers.join(" or ")} so you can check grade and packing.` },
  { title: "Contract and advance", detail: `New buyers: ${company.paymentTerms.newBuyers}. Repeat buyers: ${company.paymentTerms.repeatBuyers}.` },
  { title: "Quality checks and documents", detail: "Inspection and the documents your import needs, such as COA, SGS inspection, phytosanitary and certificate of origin." },
  { title: "Shipment", detail: "Goods are loaded and shipped on the agreed terms; you receive the shipping documents." },
];
