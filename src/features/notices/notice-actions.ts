import { createHash } from "node:crypto";
import { grantNoticeTextInputSchema } from "./notices.schema";

type ActionStatus = "idle" | "success" | "error";

export type GrantNoticeFormState = {
  status: ActionStatus;
  message: string;
};

type SupabaseActionError = {
  message?: string;
};

type SupabaseNoticeClient = {
  auth: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: SupabaseActionError | null;
    }>;
  };
  from: (table: "grant_notices") => {
    insert: (values: Record<string, unknown>) => PromiseLike<{
      error: SupabaseActionError | null;
    }>;
  };
};

export type GrantNoticeActionDependencies = {
  hasSupabaseEnv: () => boolean;
  createClient: () => Promise<SupabaseNoticeClient>;
};

export const initialGrantNoticeFormState: GrantNoticeFormState = {
  status: "idle",
  message: "",
};

export async function saveGrantNotice(
  formData: FormData,
  dependencies: GrantNoticeActionDependencies,
): Promise<GrantNoticeFormState> {
  const parsed = grantNoticeTextInputSchema.safeParse({
    title: formData.get("title"),
    source_text: formData.get("source_text"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "공고명과 공고 원문을 기준에 맞게 입력해 주세요.",
    };
  }

  if (!dependencies.hasSupabaseEnv()) {
    return {
      status: "error",
      message:
        "Supabase 환경변수가 설정되지 않아 공고를 저장할 수 없습니다.",
    };
  }

  const supabase = await dependencies.createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "로그인 후 공고를 저장할 수 있습니다.",
    };
  }

  const { title, source_text } = parsed.data;
  const sourceHash = createHash("sha256").update(source_text).digest("hex");
  const { error } = await supabase.from("grant_notices").insert({
    owner_id: user.id,
    title,
    source_text,
    source_hash: sourceHash,
    status: "ready_for_analysis",
  });

  if (error) {
    return {
      status: "error",
      message: `공고 저장에 실패했습니다: ${
        error.message ?? "알 수 없는 오류"
      }`,
    };
  }

  return {
    status: "success",
    message:
      "공고가 저장되었습니다. 다음 단계에서 자격 판정과 적합도 평가를 진행할 수 있습니다.",
  };
}
