import { describe, expect, it } from "vitest";
import {
  deriveEligibilityDecision,
  sumFitScore,
  type EligibilityGate,
} from "./eligibility";

describe("deriveEligibilityDecision", () => {
  it("returns ineligible when any hard gate fails", () => {
    const gates: EligibilityGate[] = [
      { gate: "business_age", status: "pass", reason: "3년 이내" },
      { gate: "tax_arrears", status: "fail", reason: "체납 확인" },
    ];

    expect(deriveEligibilityDecision(gates)).toBe("ineligible");
  });

  it("returns needs_confirmation when required facts are missing", () => {
    const gates: EligibilityGate[] = [
      { gate: "business_age", status: "pass", reason: "3년 이내" },
      { gate: "region", status: "needs_confirmation", reason: "사업장 소재지 없음" },
    ];

    expect(deriveEligibilityDecision(gates)).toBe("needs_confirmation");
  });

  it("returns eligible only when every hard gate passes", () => {
    const gates: EligibilityGate[] = [
      { gate: "business_age", status: "pass", reason: "3년 이내" },
      { gate: "duplicate_support", status: "pass", reason: "중복 수혜 없음" },
    ];

    expect(deriveEligibilityDecision(gates)).toBe("eligible");
  });
});

describe("sumFitScore", () => {
  it("sums weighted score items and clamps the total to 100", () => {
    expect(
      sumFitScore([
        { label: "PSST 문제 인식", score: 40 },
        { label: "실현 가능성", score: 45 },
        { label: "팀 역량", score: 30 },
      ]),
    ).toBe(100);
  });
});
