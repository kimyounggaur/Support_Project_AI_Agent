"use server";

import type { GrantNoticeFormState } from "./notice-form-state";
import { saveGrantNotice } from "./notice-actions";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveGrantNoticeAction(
  _previousState: GrantNoticeFormState,
  formData: FormData,
) {
  return saveGrantNotice(formData, {
    hasSupabaseEnv: hasSupabasePublicEnv,
    createClient: createSupabaseServerClient,
  });
}
