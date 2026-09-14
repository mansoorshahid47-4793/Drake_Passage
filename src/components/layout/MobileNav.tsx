"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { Category } from "@/lib/types";
import { NAV_LINKS } from "./nav";
import { Button } from "@/components/ui/Button";
import { whatsAppUrl } from "@/lib/whatsapp";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-control text-ink cursor-pointer"
      >
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id={panelId} role="dialog" aria-label="Site menu" className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white p-4">
          <p className="mb-2 font-semibold">Products</p>
          <ul className="m-0 mb-4 list-none p-0">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} onClick={() => setOpen(false)} className="block py-3 text-ink no-underline border-b border-line">{c.name}</Link>
              </li>
            ))}
            <li><Link href="/products" onClick={() => setOpen(false)} className="block py-3 no-underline border-b border-line">All products</Link></li>
          </ul>
          <ul className="m-0 mb-6 list-none p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-ink no-underline border-b border-line">{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button>
            <Button href="/contact" onClick={() => setOpen(false)}>Get a quote</Button>
          </div>
        </div>
      )}
    </div>
  );
}
