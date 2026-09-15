"use client";

import { useEffect, useRef, useState } from "react";
import "./dial.css";
import type { DialItem } from "./types";
import { CategoryPanel } from "./CategoryPanel";
import { DialItemCard } from "./DialItemCard";
import { relativeOffset, useDialState } from "./useDialState";

const SWIPE_PX = 40;

export function ProductDial({ items }: { items: DialItem[] }) {
  const count = items.length;
  const { index, next, prev, goTo } = useDialState(count);
  const [expanded, setExpanded] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const current = items[index];

  // If a card button holds focus when the dial moves, follow the centre so focus
  // never sits inside an aria-hidden slide. Focus on the controls or region stays put.
  useEffect(() => {
    const stage = stageRef.current;
    const active = document.activeElement;
    if (!stage || !active || !active.closest(".dial-item")) return;
    const center = stage.querySelector<HTMLButtonElement>('.dial-item[data-offset="0"] button');
    if (center && center !== active) center.focus();
  }, [index]);

  const move = (fn: () => void) => { setExpanded(false); fn(); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Only the region itself and the cards drive the dial from the keyboard; keys pressed
    // on the prev/next buttons or inside the expanded panel are theirs to handle.
    const target = e.target as Node;
    if (target !== e.currentTarget && !stageRef.current?.contains(target)) return;
    swiped.current = false;
    if (e.key === "ArrowRight") { e.preventDefault(); move(next); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); move(prev); }
    else if (e.key === "Home") { e.preventDefault(); move(() => goTo(0)); }
    else if (e.key === "End") { e.preventDefault(); move(() => goTo(count - 1)); }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    dragStart.current = e.clientX;
    swiped.current = false;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (dx <= -SWIPE_PX) { swiped.current = true; move(next); }
    else if (dx >= SWIPE_PX) { swiped.current = true; move(prev); }
  };
  const onPointerCancel = () => { dragStart.current = null; };
  const onClickCapture = (e: React.MouseEvent) => {
    if (!swiped.current) return;
    swiped.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section aria-label="Product categories" aria-roledescription="carousel" className="w-full" tabIndex={0} onKeyDown={onKeyDown}>
      <div
        ref={stageRef}
        className="dial-stage touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        {items.map((item, i) => {
          const d = relativeOffset(i, index, count);
          const offset: number | "hidden" = Math.abs(d) <= 2 ? d : "hidden";
          return (
            <DialItemCard
              key={item.slug}
              item={item}
              offset={offset}
              position={i + 1}
              total={count}
              isCenter={d === 0}
              expanded={expanded}
              preload={i === 0}
              onSelect={() => (d === 0 ? setExpanded((v) => !v) : move(() => goTo(i)))}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button type="button" onClick={() => move(prev)} aria-label="Previous category" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy text-navy hover:bg-navy hover:text-salt cursor-pointer">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4l-6 6 6 6" /></svg>
        </button>
        <p role="status" aria-live="polite" className="m-0 min-w-[16ch] text-center text-[15px] text-muted">
          {index + 1} of {count}, {current.name}
        </p>
        <button type="button" onClick={() => move(next)} aria-label="Next category" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy text-navy hover:bg-navy hover:text-salt cursor-pointer">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 4l6 6-6 6" /></svg>
        </button>
      </div>
      <p className="mt-2 text-center text-muted text-[15px]">{current.tagline}</p>
      <p className="mt-2 max-w-prose text-center text-muted text-[15px] mx-auto">{current.description}</p>
      {expanded && <CategoryPanel item={current} />}
    </section>
  );
}
