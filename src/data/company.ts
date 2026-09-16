import type { Company } from "@/lib/types";

export const company: Company = {
  name: "Drake Passage",
  legalName: "Drake Passage Pvt Limited",
  phoneDisplay: "+92 304 740 9567",
  phoneE164: "923047409567",
  email: "mansoorshahid47@gmail.com",
  office: "Lahore, Punjab, Pakistan",
  hours: "Mon–Sat 09:00–18:00 PKT",
  tradeTerms: ["FOB", "CIF"],
  paymentTerms: {
    newBuyers: "100% advance",
    repeatBuyers: "70% advance, 30% against BL copy",
  },
  sampleCouriers: ["DHL", "Leopard Courier"],
  certifications: [
    { name: "ISO 9001", covers: "Quality management system" },
    { name: "Halal", covers: "Halal certification for food products" },
    { name: "Certificate of origin", covers: "Confirms goods originate in Pakistan" },
    { name: "Certificate of analysis (COA)", covers: "Lab analysis of a shipment lot" },
    { name: "SGS inspection", covers: "Third-party pre-shipment inspection" },
    { name: "Phytosanitary certificate", covers: "Plant-health clearance for agricultural goods" },
  ],
};
