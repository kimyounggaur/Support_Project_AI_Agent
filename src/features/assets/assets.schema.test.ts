import { describe, expect, it } from "vitest";
import { assetSchema, evidenceItemSchema } from "./assets.schema";

describe("assetSchema", () => {
  it("accepts a needs_review asset with an HTTPS URL", () => {
    const result = assetSchema.parse({
      category: "chord",
      title: "Guitar Chord Viewer",
      url: "https://guitar-chord-viewer.vercel.app/",
      description: "동적 기타 지판 다이어그램 코드 학습 도구",
      verification_status: "needs_review",
    });

    expect(result.verification_status).toBe("needs_review");
  });

  it("rejects untrusted non-http URLs", () => {
    expect(() =>
      assetSchema.parse({
        category: "unsafe",
        title: "Local file",
        url: "file:///C:/secret.txt",
        description: "invalid",
        verification_status: "needs_review",
      }),
    ).toThrow();
  });
});

describe("evidenceItemSchema", () => {
  it("requires evidence to start as unverified unless the user confirms it", () => {
    const result = evidenceItemSchema.parse({
      label: "기관 도입",
      value: "",
      source_type: "user_input",
      verification_status: "needs_review",
    });

    expect(result.verification_status).toBe("needs_review");
  });
});
