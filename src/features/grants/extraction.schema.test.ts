import { describe, expect, it } from "vitest";
import { grantNoticeExtractionSchema } from "./extraction.schema";

describe("grantNoticeExtractionSchema", () => {
  it("accepts known extracted fields with citations", () => {
    const result = grantNoticeExtractionSchema.parse({
      title: {
        status: "known",
        value: "예비창업 지원사업",
        citation_ids: ["c1"],
      },
      eligibility: [
        {
          rule_type: "business_age",
          status: "known",
          value: "신청 마감일 기준 업력 3년 이내",
          citation_ids: ["c2"],
        },
      ],
      required_documents: [],
      evaluation_criteria: [],
      warnings: [],
    });

    expect(result.title.value).toBe("예비창업 지원사업");
  });

  it("rejects known conclusions without citations", () => {
    expect(() =>
      grantNoticeExtractionSchema.parse({
        title: {
          status: "known",
          value: "근거 없는 제목",
          citation_ids: [],
        },
        eligibility: [],
        required_documents: [],
        evaluation_criteria: [],
        warnings: [],
      }),
    ).toThrow();
  });
});
