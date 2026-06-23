"use client";

import { useRouter } from "next/navigation";

export function HomeActions() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => router.push("/notices/new")}
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-sm"
      >
        공고 등록
      </button>
      <button
        type="button"
        onClick={() => router.push("/assets")}
        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
      >
        사업 프로필
      </button>
    </div>
  );
}
