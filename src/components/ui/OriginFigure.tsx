import Image from "next/image";
import type { OriginPhoto } from "@/lib/types";

export function OriginFigure({ photo, sizes = "(min-width: 640px) 50vw, 100vw", className = "" }: { photo: OriginPhoto; sizes?: string; className?: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-2">
        <span className="block text-[15px] text-muted">{photo.caption}</span>
        <span className="mt-1 block text-[15px] text-muted">
          Photo: <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.author}</a>,{" "}
          <a href={photo.licence.url} target="_blank" rel="noopener noreferrer">{photo.licence.name}</a>
        </span>
      </figcaption>
    </figure>
  );
}
