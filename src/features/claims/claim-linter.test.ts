import { describe, expect, it } from "vitest";
import { auditUnsupportedClaims } from "./claim-linter";

describe("auditUnsupportedClaims", () => {
  it("flags unsupported numeric claims", () => {
    const issues = auditUnsupportedClaims("월매출 5천만 원을 달성했습니다.");

    expect(issues).toEqual([
      expect.objectContaining({ type: "unsupported_number" }),
    ]);
  });

  it("flags unsupported superlative claims", () => {
    const issues = auditUnsupportedClaims("국내 최고의 음악교육 플랫폼입니다.");

    expect(issues).toEqual([
      expect.objectContaining({ type: "unsupported_superlative" }),
    ]);
  });

  it("does not flag claims already marked for confirmation", () => {
    const issues = auditUnsupportedClaims(
      "[[확인 필요: 월매출]] 월매출 5천만 원",
    );

    expect(issues).toEqual([]);
  });
});
