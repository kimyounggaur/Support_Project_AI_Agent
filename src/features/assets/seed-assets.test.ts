import { describe, expect, it } from "vitest";
import { seedAssets } from "./seed-assets";

describe("seedAssets", () => {
  it("contains the 30 approved music education assets", () => {
    expect(seedAssets).toHaveLength(30);
  });

  it("starts every asset as needs_review", () => {
    expect(
      seedAssets.every((asset) => asset.verification_status === "needs_review"),
    ).toBe(true);
  });

  it("uses unique URL values", () => {
    const urls = new Set(seedAssets.map((asset) => asset.url));

    expect(urls.size).toBe(seedAssets.length);
  });
});
