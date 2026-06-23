"use client";

import { useActionState } from "react";
import { initialGrantNoticeFormState } from "@/features/notices/notice-form-state";
import { saveGrantNoticeAction } from "@/features/notices/notice-server-actions";

const ACCEPTED_NOTICE_FILES =
  ".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown";

export function NoticeForm() {
  const [state, formAction, pending] = useActionState(
    saveGrantNoticeAction,
    initialGrantNoticeFormState,
  );

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="mt-6 space-y-5"
    >
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

      <div className="space-y-2">
        <label
          htmlFor="attachments"
          className="text-sm font-medium text-zinc-800"
        >
          첨부 파일
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          accept={ACCEPTED_NOTICE_FILES}
          className="block w-full rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:bg-zinc-100"
        />
        <p className="text-xs leading-5 text-zinc-500">
          PDF, DOCX, TXT, MD 파일을 최대 5개까지 첨부할 수 있습니다.
        </p>
      </div>

      {state.documents.length > 0 ? (
        <section
          aria-label="첨부 파일 분석 결과"
          className="space-y-3 border-l-2 border-emerald-500 pl-4"
        >
          <h2 className="text-base font-semibold text-zinc-900">분석 결과</h2>
          <ul className="space-y-3">
            {state.documents.map((document) => (
              <li key={document.fileName} className="space-y-1">
                <p className="text-sm font-medium text-zinc-900">
                  {document.fileName}
                </p>
                <p className="text-sm leading-6 text-zinc-700">
                  {document.summary}
                </p>
                {document.warnings.length > 0 ? (
                  <p className="text-xs leading-5 text-amber-700">
                    {document.warnings.join(" ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
