"use client";

import { useMemo, useSyncExternalStore } from "react";
import { EnquiryForm, type FormCategory } from "./EnquiryForm";
import type { EnquiryInput } from "@/lib/enquiry";

// No real external store to subscribe to: we only need the URL's query string
// once, right after hydration. An empty unsubscribe means React re-reads the
// snapshot when it reconciles the server/client mismatch and then leaves it
// alone: it never re-runs on a later same-route soft navigation (e.g. a
// client-side Link from `/contact?category=rice` to `/contact?category=salt`
// while this component stays mounted), so readInitial would not re-run and
// the form would keep the stale prefill. No such link exists today — nothing
// navigates to `/contact` with different query params without a full
// reload — so this is currently harmless, but a real subscription (e.g. to
// `popstate`, or keying this component by the route) would be needed if one
// were added.
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
