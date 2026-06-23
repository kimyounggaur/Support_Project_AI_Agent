import { describe, expect, it } from "vitest";
import {
  analyzeNoticeDocumentText,
  extractNoticeFileText,
} from "./file-analysis";

describe("notice file analysis", () => {
  it("extracts text from a plain text notice attachment", async () => {
    const file = new File(
      [
        "2026년도 초기창업패키지 공고\n접수기간: 2026. 2. 1. ~ 2026. 2. 20.\n제출서류: 사업계획서, 사업자등록증",
      ],
      "notice.txt",
      { type: "text/plain" },
    );

    const result = await extractNoticeFileText(file);

    expect(result.text).toContain("초기창업패키지");
    expect(result.text).toContain("사업계획서");
    expect(result.truncated).toBe(false);
    expect(result.warnings).toEqual([]);
  });

  it("summarizes grant-critical signals from extracted text", () => {
    const analysis = analyzeNoticeDocumentText({
      fileName: "2026 초기창업패키지 공고.txt",
      mimeType: "text/plain",
      text: [
        "2026년도 초기창업패키지 일반형 참여기업 모집 공고",
        "접수기간: 2026. 2. 1. ~ 2026. 2. 20. 16:00",
        "지원대상: 업력 3년 이내 창업기업",
        "지원내용: 사업화 자금 최대 1억원",
        "제출서류: 사업계획서, 사업자등록증, 개인정보 수집이용 동의서",
      ].join("\n"),
      warnings: [],
    });

    expect(analysis.documentType).toBe("grant_notice");
    expect(analysis.summary).toContain("초기창업패키지");
    expect(analysis.deadlines.join(" ")).toContain("2026. 2. 20");
    expect(analysis.fundingAmounts.join(" ")).toContain("1억원");
    expect(analysis.eligibilitySignals.join(" ")).toContain("업력 3년 이내");
    expect(analysis.requiredDocuments.join(" ")).toContain("사업계획서");
  });
});
