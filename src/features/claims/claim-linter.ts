export type ClaimIssueType =
  | "unsupported_number"
  | "unsupported_superlative";

export type ClaimIssue = {
  type: ClaimIssueType;
  text: string;
};

const NUMBER_PATTERN =
  /(\d[\d,.]*\s*(명|개|건|원|만원|천만|억|%|퍼센트|년|개월)|[일이삼사오육칠팔구십백천만억]+\s*(명|개|건|원|만원|천만|억|%|퍼센트|년|개월))/g;

const SUPERLATIVE_PATTERN = /(최고|최대|최초|유일|1위|가장|압도적)/g;

export function auditUnsupportedClaims(text: string): ClaimIssue[] {
  if (text.includes("[[확인 필요")) {
    return [];
  }

  const issues: ClaimIssue[] = [];

  for (const match of text.matchAll(NUMBER_PATTERN)) {
    issues.push({ type: "unsupported_number", text: match[0] });
  }

  for (const match of text.matchAll(SUPERLATIVE_PATTERN)) {
    issues.push({ type: "unsupported_superlative", text: match[0] });
  }

  return issues;
}
