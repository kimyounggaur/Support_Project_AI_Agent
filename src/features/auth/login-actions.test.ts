import { describe, expect, it, vi } from "vitest";
import {
  requestLoginLink,
  type LoginActionDependencies,
} from "./login-actions";

function formData(values: Record<string, string>) {
  const data = new FormData();

  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }

  return data;
}

describe("requestLoginLink", () => {
  it("asks for Supabase setup before requesting a magic link", async () => {
    const createClient = vi.fn();

    const result = await requestLoginLink(formData({ email: "user@test.com" }), {
      hasSupabaseEnv: () => false,
      createClient,
      getRedirectOrigin: async () => "https://support-project-ai-agent.vercel.app",
    });

    expect(result.status).toBe("error");
    expect(result.message).toContain("Supabase");
    expect(createClient).not.toHaveBeenCalled();
  });

  it("sends an email OTP when Supabase is configured", async () => {
    const signInWithOtp = vi.fn().mockResolvedValue({ error: null });
    const dependencies: LoginActionDependencies = {
      hasSupabaseEnv: () => true,
      getRedirectOrigin: async () => "https://support-project-ai-agent.vercel.app",
      createClient: async () => ({
        auth: {
          signInWithOtp,
        },
      }),
    };

    const result = await requestLoginLink(
      formData({ email: "user@test.com" }),
      dependencies,
    );

    expect(result.status).toBe("success");
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "user@test.com",
      options: {
        emailRedirectTo:
          "https://support-project-ai-agent.vercel.app/dashboard",
      },
    });
  });
});
