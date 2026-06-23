"use client";

import { useActionState } from "react";
import { initialLoginFormState } from "@/features/auth/login-actions";
import { requestLoginLinkAction } from "@/features/auth/login-server-actions";

type LoginFormProps = {
  isConfigured: boolean;
};

export function LoginForm({ isConfigured }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    requestLoginLinkAction,
    initialLoginFormState,
  );

  return (
    <>
      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-800">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
            placeholder="name@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={!isConfigured || pending}
          className="h-11 w-full rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600"
        >
          {pending ? "발송 중" : "로그인 링크 받기"}
        </button>
      </form>
      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "success"
              ? "mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              : "mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800"
          }
        >
          {state.message}
        </p>
      ) : null}
      {!isConfigured ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Supabase 환경값을 설정하면 이메일 로그인을 사용할 수 있습니다.
        </p>
      ) : null}
    </>
  );
}
