import { hasSupabasePublicEnv } from "@/lib/env";

const workflowItems = [
  "사업 프로필",
  "공고 분석",
  "자격 판정",
  "적합도 평가",
  "PSST 초안",
  "제출 준비",
];

export default function DashboardPage() {
  const isConfigured = hasSupabasePublicEnv();

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-6 text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-3 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              지원사업 워크스페이스
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal">
              대시보드
            </h1>
          </div>
          <span className="w-fit rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            {isConfigured ? "Supabase 연결됨" : "Supabase 연결 대기"}
          </span>
        </header>

        <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {workflowItems.map((item) => (
            <article
              key={item}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-zinc-600">대기</p>
              <h2 className="mt-3 text-base font-semibold text-zinc-950">
                {item}
              </h2>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">최근 공고</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              등록된 공고가 없습니다.
            </p>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">검증 상태</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              사업 자산과 증빙은 다음 단계에서 needs_review 상태로
              초기화됩니다.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
