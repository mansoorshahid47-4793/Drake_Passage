"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EnquiryForm, type FormCategory } from "./EnquiryForm";

function Inner({ categories }: { categories: FormCategory[] }) {
  const sp = useSearchParams();
  const inquiry = sp.get("inquiry");
  const initial = {
    category: sp.get("category") ?? "",
    product: sp.get("product") ?? "",
    enquiryType: inquiry === "sample" || inquiry === "certificate" ? inquiry : "quote",
    message: inquiry === "certificate" && sp.get("name") ? `Please send a copy of: ${sp.get("name")}` : "",
  };
  return <EnquiryForm categories={categories} initial={initial} />;
}

export function EnquiryFormLoader({ categories }: { categories: FormCategory[] }) {
  return (
    <Suspense fallback={<EnquiryForm categories={categories} initial={{}} />}>
      <Inner categories={categories} />
    </Suspense>
  );
}
