import { describe, it, expect } from "vitest";
import { getOriginPhotos } from "@/lib/origin";

describe("getOriginPhotos", () => {
  it("resolves ids to photo records in the order given", () => {
    const photos = getOriginPhotos(["paddy-chunian", "khewra-interior"]);
    expect(photos.map((p) => p.id)).toEqual(["paddy-chunian", "khewra-interior"]);
  });

  it("throws on an unknown id", () => {
    expect(() => getOriginPhotos(["not-a-real-photo"])).toThrow(/Unknown origin photo id/);
  });
});
