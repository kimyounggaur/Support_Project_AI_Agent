import { z } from "zod";

type ActionStatus = "idle" | "success" | "error";

export type LoginFormState = {
  status: ActionStatus;
  message: string;
};

type SupabaseActionError = {
  message?: string;
};

type SupabaseLoginClient = {
  auth: {
    signInWithOtp: (input: {
      email: string;
      options: { emailRedirectTo: string };
    }) => Promise<{ error: SupabaseActionError | null }>;
  };
};

export type LoginActionDependencies = {
  hasSupabaseEnv: () => boolean;
  createClient: () => Promise<SupabaseLoginClient>;
  getRedirectOrigin: () => Promise<string>;
};

export const initialLoginFormState: LoginFormState = {
  status: "idle",
  message: "",
};

const emailSchema = z.object({
  email: z.string().trim().email(),
});

export async function requestLoginLink(
  formData: FormData,
  dependencies: LoginActionDependencies,
): Promise<LoginFormState> {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "올바른 이메일 주소를 입력해 주세요.",
    };
  }

  if (!dependencies.hasSupabaseEnv()) {
    return {
      status: "error",
      message:
        "Supabase 환경변수가 설정되지 않아 로그인 링크를 보낼 수 없습니다.",
    };
  }

  const origin = await dependencies.getRedirectOrigin();
  const supabase = await dependencies.createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin.replace(/\/$/, "")}/dashboard`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: `로그인 링크 발송에 실패했습니다: ${
        error.message ?? "알 수 없는 오류"
      }`,
    };
  }

  return {
    status: "success",
    message: "이메일로 로그인 링크를 보냈습니다.",
  };
}
