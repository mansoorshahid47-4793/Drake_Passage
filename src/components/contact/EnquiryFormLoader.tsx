"use client";

import { useMemo, useSyncExternalStore } from "react";
import { EnquiryForm, type FormCategory } from "./EnquiryForm";
import type { EnquiryInput } from "@/lib/enquiry";

// No real external store to subscribe to: we only need the URL's query string
// once, right after hydration. An empty unsubscribe means React re-reads the
// snapshot when it reconciles the server/client mismatch and then leaves it alone
// — router-driven hash changes (e.g. clicking an error-summary link) never re-run this.
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return window.location.search;
}

function getServerSnapshot() {
  return "";
}

function readInitial(search: string): Partial<EnquiryInput> {
  const sp = new URLSearchParams(search);
  const inquiry = sp.get("inquiry");
  const name = sp.get("name");
  return {
    category: sp.get("category") ?? "",
    product: sp.get("product") ?? "",
    enquiryType: inquiry === "sample" || inquiry === "certificate" ? inquiry : "quote",
    message: inquiry === "certificate" && name ? `Please send a copy of: ${name}` : "",
  };
}

export function EnquiryFormLoader({ categories }: { categories: FormCategory[] }) {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const initial = useMemo(() => readInitial(search), [search]);

  return <EnquiryForm categories={categories} initial={initial} />;
}
