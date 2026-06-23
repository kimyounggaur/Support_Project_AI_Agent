import { describe, expect, it } from "vitest";
import { grantNoticeTextInputSchema } from "./notices.schema";

describe("grantNoticeTextInputSchema", () => {
  it("accepts a pasted Korean grant notice text draft", () => {
    const result = grantNoticeTextInputSchema.parse({
      title: "2026 예비창업 지원사업",
      source_text: "신청 대상: 예비창업자\n마감: 2026-07-31",
    });

    expect(result.title).toBe("2026 예비창업 지원사업");
  });

  it("rejects nearly empty notice text", () => {
    expect(() =>
      grantNoticeTextInputSchema.parse({
        title: "빈 공고",
        source_text: "짧음",
      }),
    ).toThrow();
  });
});
