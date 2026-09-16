"use client";

import Image from "next/image";
import type { DialItem } from "./types";

type Props = {
  item: DialItem;
  offset: number | "hidden";
  position: number;
  total: number;
  isCenter: boolean;
  expanded: boolean;
  preload: boolean;
  onSelect: () => void;
};

export function DialItemCard({ item, offset, position, total, isCenter, expanded, preload, onSelect }: Props) {
  return (
    <div
      className="dial-item"
      data-offset={String(offset)}
      data-testid={`dial-item-${item.slug}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${total}, ${item.name}`}
      aria-hidden={offset === "hidden" || undefined}
    >
      <button
        type="button"
        onClick={onSelect}
        tabIndex={isCenter ? 0 : -1}
        aria-expanded={isCenter ? expanded : undefined}
        aria-controls={isCenter ? `dial-panel-${item.slug}` : undefined}
        className="dial-card block w-full overflow-hidden rounded-tile bg-navy text-left text-salt cursor-pointer"
      >
        <div className="dial-photo relative aspect-[4/3]">
          <Image src={item.image} alt="" fill sizes="(min-width: 520px) 320px, 62vw" preload={preload} draggable={false} className="object-cover" />
        </div>
        <div className="px-4 py-3">
          <span className="block font-display text-xl font-semibold">{item.name}</span>
          <span className="block text-salt/80 text-[15px]">{item.productCount} {item.productCount === 1 ? "product" : "products"}</span>
        </div>
      </button>
    </div>
  );
}
