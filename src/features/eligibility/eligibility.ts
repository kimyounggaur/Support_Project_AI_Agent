export type EligibilityDecision =
  | "eligible"
  | "ineligible"
  | "needs_confirmation";

export type EligibilityGateStatus = "pass" | "fail" | "needs_confirmation";

export type EligibilityGate = {
  gate:
    | "business_age"
    | "applicant_type"
    | "region"
    | "industry"
    | "duplicate_support"
    | "tax_arrears"
    | "debt_default"
    | "participation_restriction"
    | "required_document"
    | "other";
  status: EligibilityGateStatus;
  reason: string;
};

export type FitScoreItem = {
  label: string;
  score: number;
};

export function deriveEligibilityDecision(
  gates: EligibilityGate[],
): EligibilityDecision {
  if (gates.some((gate) => gate.status === "fail")) {
    return "ineligible";
  }

  if (gates.some((gate) => gate.status === "needs_confirmation")) {
    return "needs_confirmation";
  }

  return "eligible";
}

export function sumFitScore(items: FitScoreItem[]) {
  const total = items.reduce((sum, item) => sum + item.score, 0);

  return Math.max(0, Math.min(100, total));
}
