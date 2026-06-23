"use client";

import { useActionState } from "react";
import {
  initialGrantNoticeFormState,
  saveGrantNoticeAction,
} from "@/features/notices/notice-actions";

export function NoticeForm() {
  const [state, formAction, pending] = useActionState(
    saveGrantNoticeAction,
    initialGrantNoticeFormState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-zinc-800">
          공고명
        </label>
        <input
          id="title"
          name="title"
          className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
          placeholder="예: 2026 예비창업 지원사업"
          required
          minLength={2}
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="source_text"
          className="text-sm font-medium text-zinc-800"
        >
          공고 원문
        </label>
        <textarea
          id="source_text"
          name="source_text"
          rows={14}
          className="w-full rounded-md border border-zinc-300 px-3 py-3 text-sm leading-6 outline-none ring-emerald-500 focus:ring-2"
          placeholder="공고문 본문을 붙여넣으세요."
          required
          minLength={20}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600"
        >
          {pending ? "저장 중" : "공고 저장"}
        </button>
        {state.message ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={
              state.status === "success"
                ? "rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                : "rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
