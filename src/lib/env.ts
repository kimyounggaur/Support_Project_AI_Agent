import { z } from "zod";

type EnvInput = Record<string, string | undefined>;

const blankToUndefined = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().optional());

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: blankToUndefined,
  APP_TIMEZONE: blankToUndefined.default("Asia/Seoul"),
  NEXT_PUBLIC_SUPABASE_URL: blankToUndefined,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: blankToUndefined,
});

export function getPublicEnv(input: EnvInput = process.env) {
  return publicEnvSchema.parse(input);
}

export function requireSupabasePublicEnv(input: EnvInput = process.env) {
  const env = getPublicEnv(input);

  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment.");
  }

  if (!env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment.",
    );
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function hasSupabasePublicEnv(input: EnvInput = process.env) {
  const env = getPublicEnv(input);

  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
