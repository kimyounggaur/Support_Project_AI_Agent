import { describe, expect, it } from "vitest";
import { metadata } from "./site-metadata";

describe("Root layout metadata", () => {
  it("uses Korean product metadata", () => {
    expect(metadata.title).toBe("지원나침반 AI");
    expect(metadata.description).toContain("지원사업");
  });
});
