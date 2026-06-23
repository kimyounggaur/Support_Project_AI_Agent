import { describe, expect, it } from "vitest";
import { isSafeNoticeImportUrl } from "./url-safety";

describe("isSafeNoticeImportUrl", () => {
  it("allows http and https URLs that resolve to public IPs", async () => {
    await expect(
      isSafeNoticeImportUrl("https://example.com/notice", async () => [
        "93.184.216.34",
      ]),
    ).resolves.toBe(true);
  });

  it("rejects private IPv4 targets", async () => {
    await expect(
      isSafeNoticeImportUrl("https://internal.example/notice", async () => [
        "192.168.0.10",
      ]),
    ).resolves.toBe(false);
  });

  it("rejects non-http protocols", async () => {
    await expect(
      isSafeNoticeImportUrl("file:///etc/passwd", async () => ["93.184.216.34"]),
    ).resolves.toBe(false);
  });
});
