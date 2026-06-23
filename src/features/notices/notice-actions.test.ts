import { describe, expect, it, vi } from "vitest";
import {
  saveGrantNotice,
  type GrantNoticeActionDependencies,
} from "./notice-actions";

function formData(values: Record<string, string>) {
  const data = new FormData();

  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }

  return data;
}

function validNoticeFormData() {
  return formData({
    title: "2026 초기창업패키지",
    source_text:
      "지원대상과 제출 서류가 포함된 충분히 긴 공고 본문입니다. 접수기간과 평가 기준도 포함합니다.",
  });
}

describe("saveGrantNotice", () => {
  it("asks for Supabase setup before attempting a save", async () => {
    const createClient = vi.fn();

    const result = await saveGrantNotice(validNoticeFormData(), {
      hasSupabaseEnv: () => false,
      createClient,
    });

    expect(result.status).toBe("error");
    expect(result.message).toContain("Supabase");
    expect(createClient).not.toHaveBeenCalled();
  });

  it("requires a signed-in user before inserting a grant notice", async () => {
    const dependencies: GrantNoticeActionDependencies = {
      hasSupabaseEnv: () => true,
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
        },
        from: vi.fn(),
        storage: {
          from: vi.fn(),
        },
      }),
    };

    const result = await saveGrantNotice(validNoticeFormData(), dependencies);

    expect(result.status).toBe("error");
    expect(result.message).toContain("로그인");
  });

  it("inserts a validated notice for the signed-in user", async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: "notice-123" },
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ insert }));

    const result = await saveGrantNotice(validNoticeFormData(), {
      hasSupabaseEnv: () => true,
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from,
        storage: {
          from: vi.fn(),
        },
      }),
    });

    expect(result.status).toBe("success");
    expect(from).toHaveBeenCalledWith("grant_notices");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        owner_id: "user-123",
        title: "2026 초기창업패키지",
        status: "ready_for_analysis",
      }),
    );
    expect(select).toHaveBeenCalledWith("id");
    expect(single).toHaveBeenCalled();
  });

  it("uploads and analyzes supported notice attachments", async () => {
    const data = validNoticeFormData();
    data.append(
      "attachments",
      new File(
        [
          [
            "2026년도 초기창업패키지 일반형 참여기업 모집 공고",
            "접수기간: 2026. 2. 1. ~ 2026. 2. 20. 16:00",
            "지원대상: 업력 3년 이내 창업기업",
            "제출서류: 사업계획서, 사업자등록증",
          ].join("\n"),
        ],
        "notice.txt",
        { type: "text/plain" },
      ),
    );

    const single = vi.fn().mockResolvedValue({
      data: { id: "notice-123" },
      error: null,
    });
    const noticeInsert = vi.fn(() => ({
      select: vi.fn(() => ({ single })),
    }));
    const documentInsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "grant_notices") {
        return { insert: noticeInsert };
      }

      return { insert: documentInsert };
    });
    const upload = vi.fn().mockResolvedValue({
      data: { path: "user-123/notice-123/hash-notice.txt" },
      error: null,
    });

    const result = await saveGrantNotice(data, {
      hasSupabaseEnv: () => true,
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from,
        storage: {
          from: vi.fn(() => ({ upload })),
        },
      }),
    });

    expect(result.status).toBe("success");
    expect(result.documents).toHaveLength(1);
    expect(result.documents[0]?.summary).toContain("초기창업패키지");
    expect(upload).toHaveBeenCalledWith(
      expect.stringMatching(/^user-123\/notice-123\//),
      expect.any(File),
      expect.objectContaining({
        contentType: "text/plain",
        upsert: false,
      }),
    );
    expect(documentInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        owner_id: "user-123",
        grant_notice_id: "notice-123",
        original_filename: "notice.txt",
        mime_type: "text/plain",
        analysis_summary: expect.stringContaining("초기창업패키지"),
        analysis_json: expect.objectContaining({
          documentType: "grant_notice",
        }),
      }),
    ]);
  });

  it("rejects unsupported attachments before inserting a notice", async () => {
    const data = validNoticeFormData();
    data.append(
      "attachments",
      new File(["malicious"], "malware.exe", {
        type: "application/x-msdownload",
      }),
    );
    const from = vi.fn();

    const result = await saveGrantNotice(data, {
      hasSupabaseEnv: () => true,
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from,
        storage: {
          from: vi.fn(),
        },
      }),
    });

    expect(result.status).toBe("error");
    expect(result.message).toContain("지원하지 않는 파일 형식");
    expect(from).not.toHaveBeenCalled();
  });
});
