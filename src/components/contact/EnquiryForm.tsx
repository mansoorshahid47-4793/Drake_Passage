"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ENQUIRY_FIELDS, ENQUIRY_TYPES, TRADE_TERMS, validateEnquiry, type EnquiryInput } from "@/lib/enquiry";
import { whatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

export type FormCategory = { slug: string; name: string; products: { slug: string; name: string }[] };

type Errors = Partial<Record<keyof EnquiryInput, string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

const LABELS: Record<keyof EnquiryInput, string> = {
  enquiryType: "What are you asking for?",
  fullName: "Full name",
  email: "Business email",
  company: "Company (optional)",
  phone: "Phone or WhatsApp (optional)",
  category: "Product category",
  product: "Product (optional)",
  destination: "Destination country or port",
  quantity: "Quantity",
  tradeTerm: "Trade term",
  message: "Message",
};

const TYPE_LABELS: Record<(typeof ENQUIRY_TYPES)[number], string> = { quote: "A price quote", sample: "A sample", certificate: "A copy of a certificate" };

const empty: EnquiryInput = { enquiryType: "quote", fullName: "", email: "", company: "", phone: "", category: "", product: "", destination: "", quantity: "", tradeTerm: "", message: "" };

export function EnquiryForm({ categories, initial }: { categories: FormCategory[]; initial: Partial<EnquiryInput> }) {
  const [values, setValues] = useState<EnquiryInput>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [focusToken, setFocusToken] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const fid = (k: keyof EnquiryInput) => `${id}-${k}`;
  const eid = (k: keyof EnquiryInput) => `${id}-${k}-error`;
  const products = categories.find((c) => c.slug === values.category)?.products ?? [];

  useEffect(() => {
    if (focusToken > 0) summaryRef.current?.focus();
  }, [focusToken]);

  const set = (k: keyof EnquiryInput, v: string) => {
    setValues((s) => ({ ...s, [k]: v, ...(k === "category" ? { product: "" } : {}) }));
  };

  const validateField = (k: keyof EnquiryInput) => {
    const r = validateEnquiry(values, categories.map((c) => c.slug));
    setErrors((e) => ({ ...e, [k]: r.ok ? undefined : r.errors[k] }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const r = validateEnquiry(values, categories.map((c) => c.slug));
    if (!r.ok) {
      setErrors(r.errors);
      setStatus({ kind: "idle" });
      setFocusToken((t) => t + 1);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    const botcheck = (form.elements.namedItem("botcheck") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...r.value, botcheck }) });
      const data = (await res.json()) as { ok: boolean; error?: string; errors?: Errors };
      if (res.ok && data.ok) { setStatus({ kind: "sent" }); return; }
      if (data.errors) { setErrors(data.errors); setStatus({ kind: "idle" }); setFocusToken((t) => t + 1); return; }
      setStatus({ kind: "failed", message: data.error ?? "We could not send your enquiry." });
    } catch {
      setStatus({ kind: "failed", message: "We could not send your enquiry. Check your connection and try again." });
    }
  };

  const errorList = ENQUIRY_FIELDS.filter((k) => errors[k]);
  const field = (k: keyof EnquiryInput, control: React.ReactNode) => (
    <div>
      <label htmlFor={fid(k)} className="mb-1 block font-semibold">{LABELS[k]}</label>
      {control}
      {errors[k] && <p id={eid(k)} className="mt-1 mb-0 text-[15px] text-danger">{errors[k]}</p>}
    </div>
  );
  const inputClass = "w-full min-h-11 rounded-control border border-line bg-white px-3 py-2 aria-[invalid=true]:border-danger";
  const a11y = (k: keyof EnquiryInput) => ({ id: fid(k), "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? eid(k) : undefined });

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-tile border border-success bg-white p-6">
        <h2 className="text-success">Enquiry sent</h2>
        <p className="mt-2">We reply within one business day. For anything urgent, message us on WhatsApp.</p>
        <div className="mt-4"><Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button></div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {errorList.length > 0 && (
        <div ref={summaryRef} role="alert" tabIndex={-1} className="rounded-control border border-danger bg-white p-4">
          <p className="m-0 font-semibold">Check these fields</p>
          <ul className="mt-2 mb-0 list-disc pl-5">
            {errorList.map((k) => <li key={k}><a href={`#${fid(k)}`} className="text-danger">{errors[k]}</a></li>)}
          </ul>
        </div>
      )}
      {status.kind === "failed" && (
        <div role="alert" className="rounded-control border border-danger bg-white p-4">
          <p className="m-0">{status.message}</p>
          <p className="mt-2 mb-0"><a href={whatsAppUrl(`Enquiry: ${values.category} ${values.product}`.trim())} target="_blank" rel="noopener noreferrer">Send it on WhatsApp instead</a></p>
        </div>
      )}

      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />

      {field("enquiryType", (
        <select {...a11y("enquiryType")} value={values.enquiryType} onChange={(e) => set("enquiryType", e.target.value)} className={inputClass}>
          {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
      ))}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("fullName", <input {...a11y("fullName")} value={values.fullName} onChange={(e) => set("fullName", e.target.value)} onBlur={() => validateField("fullName")} autoComplete="name" className={inputClass} />)}
        {field("email", <input {...a11y("email")} type="email" value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => validateField("email")} autoComplete="email" className={inputClass} />)}
        {field("company", <input {...a11y("company")} value={values.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={inputClass} />)}
        {field("phone", <input {...a11y("phone")} type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" className={inputClass} />)}
        {field("category", (
          <select {...a11y("category")} value={values.category} onChange={(e) => set("category", e.target.value)} onBlur={() => validateField("category")} className={inputClass}>
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        ))}
        {field("product", (
          <select {...a11y("product")} value={values.product} onChange={(e) => set("product", e.target.value)} disabled={products.length === 0} className={inputClass}>
            <option value="">{products.length ? "Any product in this category" : "Choose a category first"}</option>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        ))}
        {field("destination", <input {...a11y("destination")} value={values.destination} onChange={(e) => set("destination", e.target.value)} onBlur={() => validateField("destination")} className={inputClass} />)}
        {field("quantity", <input {...a11y("quantity")} value={values.quantity} onChange={(e) => set("quantity", e.target.value)} onBlur={() => validateField("quantity")} placeholder="e.g. 2 x 40ft containers or 25 MT" className={inputClass} />)}
        {field("tradeTerm", (
          <select {...a11y("tradeTerm")} value={values.tradeTerm} onChange={(e) => set("tradeTerm", e.target.value)} onBlur={() => validateField("tradeTerm")} className={inputClass}>
            <option value="">Choose FOB or CIF</option>
            {TRADE_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        ))}
      </div>
      {field("message", <textarea {...a11y("message")} value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => validateField("message")} rows={5} className={inputClass} />)}
      <Button type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Sending…" : "Send enquiry"}</Button>
    </form>
  );
}
