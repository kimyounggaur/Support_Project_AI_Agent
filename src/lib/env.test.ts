import { describe, expect, it } from "vitest";
import {
  getPublicEnv,
  hasSupabasePublicEnv,
  requireSupabasePublicEnv,
} from "./env";

describe("env", () => {
  it("normalizes blank optional public values and defaults timezone", () => {
    const env = getPublicEnv({
      NEXT_PUBLIC_APP_URL: "",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
    });

    expect(env.NEXT_PUBLIC_APP_URL).toBeUndefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
    expect(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBeUndefined();
    expect(env.APP_TIMEZONE).toBe("Asia/Seoul");
  });

  it("returns configured Supabase public credentials", () => {
    const env = requireSupabasePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
    });

    expect(env.url).toBe("https://example.supabase.co");
    expect(env.publishableKey).toBe("sb_publishable_example");
  });

  it("throws a setup-oriented error when Supabase public credentials are missing", () => {
    expect(() => requireSupabasePublicEnv({})).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("checks whether Supabase public credentials are configured", () => {
    expect(hasSupabasePublicEnv({})).toBe(false);
    expect(
      hasSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }),
    ).toBe(true);
  });
});
