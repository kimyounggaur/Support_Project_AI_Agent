"use server";

import type { LoginFormState } from "./login-actions";
import { requestLoginLink } from "./login-actions";
import { headers } from "next/headers";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestLoginLinkAction(
  _previousState: LoginFormState,
  formData: FormData,
) {
  return requestLoginLink(formData, {
    hasSupabaseEnv: hasSupabasePublicEnv,
    createClient: createSupabaseServerClient,
    getRedirectOrigin,
  });
}

async function getRedirectOrigin() {
  const headerStore = await headers();

  return (
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://support-project-ai-agent.vercel.app"
  );
}
