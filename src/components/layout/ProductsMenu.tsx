"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Category } from "@/lib/types";

export function ProductsMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const primaryCategories = categories.filter((c) => c.tier === "primary");
  const enquiryCategories = categories.filter((c) => c.tier === "enquiry");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-1 px-2 font-semibold text-ink hover:text-teal cursor-pointer"
      >
        Products
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className={`transition-transform duration-[var(--dur-micro)] ${open ? "rotate-180" : ""}`}>
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </button>
      <div id={menuId} hidden={!open} className="absolute left-0 top-full z-40 mt-2 w-64 rounded-control border border-line bg-white p-2 shadow-lg">
        <p className="m-0 px-3 pt-1 text-[13px] font-semibold text-muted">Primary lines</p>
        <ul className="m-0 list-none p-0">
          {primaryCategories.map((c) => (
            <li key={c.slug}>
              <Link href={`/products/${c.slug}`} onClick={() => setOpen(false)} className="block rounded-control px-3 py-2 text-ink no-underline hover:bg-salt hover:text-teal">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-1 border-t border-line px-3 pt-2 text-[13px] font-semibold text-muted">On enquiry</p>
        <ul className="m-0 list-none p-0">
          {enquiryCategories.map((c) => (
            <li key={c.slug}>
              <Link href={`/products/${c.slug}`} onClick={() => setOpen(false)} className="block rounded-control px-3 py-2 text-ink no-underline hover:bg-salt hover:text-teal">
                {c.name}
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-line pt-1">
            <Link href="/products" onClick={() => setOpen(false)} className="block rounded-control px-3 py-2 no-underline hover:bg-salt">
              All products
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
