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

describe("saveGrantNotice", () => {
  it("asks for Supabase setup before attempting a save", async () => {
    const createClient = vi.fn();

    const result = await saveGrantNotice(
      formData({
        title: "2026 초기창업패키지",
        source_text: "지원 대상과 제출 서류가 포함된 충분히 긴 공고 원문입니다.",
      }),
      {
        hasSupabaseEnv: () => false,
        createClient,
      },
    );

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
      }),
    };

    const result = await saveGrantNotice(
      formData({
        title: "2026 초기창업패키지",
        source_text: "지원 대상과 제출 서류가 포함된 충분히 긴 공고 원문입니다.",
      }),
      dependencies,
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("로그인");
  });

  it("inserts a validated notice for the signed-in user", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ insert }));

    const result = await saveGrantNotice(
      formData({
        title: "2026 초기창업패키지",
        source_text: "지원 대상과 제출 서류가 포함된 충분히 긴 공고 원문입니다.",
      }),
      {
        hasSupabaseEnv: () => true,
        createClient: async () => ({
          auth: {
            getUser: async () => ({
              data: { user: { id: "user-123" } },
              error: null,
            }),
          },
          from,
        }),
      },
    );

    expect(result.status).toBe("success");
    expect(from).toHaveBeenCalledWith("grant_notices");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        owner_id: "user-123",
        title: "2026 초기창업패키지",
        status: "ready_for_analysis",
      }),
    );
  });
});
