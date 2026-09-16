export type TradeTerm = "FOB" | "CIF";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Certification {
  name: string;
  verified: true;
  documentUrl?: string;
}

export type CategoryTier = "primary" | "enquiry";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  subCategories: string[];
  tier: CategoryTier;
  originPhotoIds?: string[];
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  subCategory?: string;
  tagline: string;
  summary: string;
  images: string[];
  specs: ProductSpec[];
  packagingOptions: string[];
  moq?: string;
  supportedTradeTerms: TradeTerm[];
  certifications: Certification[];
}

export interface OriginPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  author: string;
  licence: { name: string; url: string };
  sourceUrl: string;
  width: number;
  height: number;
}

export interface CompanyCertification {
  name: string;
  covers: string;
}

export interface Company {
  name: string;
  legalName: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  office: string;
  hours: string;
  tradeTerms: TradeTerm[];
  paymentTerms: { newBuyers: string; repeatBuyers: string };
  sampleCouriers: string[];
  certifications: CompanyCertification[];
}
