import { describe, expect, it } from "vitest";
import { validateNoticeFile } from "./file-validation";

describe("validateNoticeFile", () => {
  it("accepts a supported PDF under the size limit", () => {
    const result = validateNoticeFile({
      name: "notice.pdf",
      type: "application/pdf",
      size: 1024,
    });

    expect(result.ok).toBe(true);
  });

  it("rejects unsupported executable files", () => {
    const result = validateNoticeFile({
      name: "notice.exe",
      type: "application/x-msdownload",
      size: 1024,
    });

    expect(result.ok).toBe(false);
  });

  it("rejects oversized files", () => {
    const result = validateNoticeFile({
      name: "notice.pdf",
      type: "application/pdf",
      size: 51 * 1024 * 1024,
    });

    expect(result.ok).toBe(false);
  });
});
