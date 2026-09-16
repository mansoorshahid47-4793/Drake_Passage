import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OriginFigure } from "@/components/ui/OriginFigure";
import { ORIGIN_PHOTOS } from "@/data/origin";

describe("OriginFigure", () => {
  const photo = ORIGIN_PHOTOS.find((p) => p.id === "khewra-interior")!;

  it("renders the image alt text, caption and credit line with correct links", () => {
    render(<OriginFigure photo={photo} />);
    expect(screen.getByAltText(photo.alt)).toBeInTheDocument();
    expect(screen.getByText(photo.caption)).toBeInTheDocument();
    const authorLink = screen.getByRole("link", { name: photo.author });
    expect(authorLink).toHaveAttribute("href", photo.sourceUrl);
    expect(authorLink).toHaveAttribute("target", "_blank");
    expect(authorLink).toHaveAttribute("rel", "noopener noreferrer");
    const licenceLink = screen.getByRole("link", { name: photo.licence.name });
    expect(licenceLink).toHaveAttribute("href", photo.licence.url);
    expect(licenceLink).toHaveAttribute("target", "_blank");
    expect(licenceLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
