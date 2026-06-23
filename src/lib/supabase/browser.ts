import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = requireSupabasePublicEnv();

  return createBrowserClient(url, publishableKey);
}
