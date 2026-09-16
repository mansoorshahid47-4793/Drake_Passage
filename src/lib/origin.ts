import { ORIGIN_PHOTOS } from "@/data/origin";
import type { OriginPhoto } from "@/lib/types";

/**
 * Resolves origin photo ids to their records, in the order given.
 * An unknown id throws, since it indicates a broken reference in the
 * catalog or a page, not a missing optional asset.
 */
export function getOriginPhotos(ids: string[]): OriginPhoto[] {
  return ids.map((id) => {
    const photo = ORIGIN_PHOTOS.find((p) => p.id === id);
    if (!photo) throw new Error(`Unknown origin photo id: ${id}`);
    return photo;
  });
}
