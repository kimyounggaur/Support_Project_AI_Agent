import { HomeActions } from "./home-actions";

export default function Home() {
  const workflow = [
    { label: "공고 분석", value: "대기", tone: "bg-emerald-50 text-emerald-700" },
    { label: "자격 판정", value: "대기", tone: "bg-sky-50 text-sky-700" },
    { label: "적합도 평가", value: "대기", tone: "bg-violet-50 text-violet-700" },
    { label: "PSST 사업계획서", value: "대기", tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              GrantCompass AI
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-zinc-950">
              지원나침반 AI
            </h1>
          </div>
          <HomeActions />
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {workflow.map((item) => (
            <article
              key={item.label}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div
                className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${item.tone}`}
              >
                {item.value}
              </div>
              <h2 className="mt-4 text-base font-semibold text-zinc-950">
                {item.label}
              </h2>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-950">
                준비 현황
              </h2>
              <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                Phase 0
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-zinc-200 p-4">
                <p className="text-2xl font-semibold text-zinc-950">30</p>
                <p className="mt-1 text-sm text-zinc-600">초기 사업 자산</p>
              </div>
              <div className="rounded-md border border-zinc-200 p-4">
                <p className="text-2xl font-semibold text-zinc-950">0</p>
                <p className="mt-1 text-sm text-zinc-600">등록 공고</p>
              </div>
              <div className="rounded-md border border-zinc-200 p-4">
                <p className="text-2xl font-semibold text-zinc-950">0</p>
                <p className="mt-1 text-sm text-zinc-600">지원 프로젝트</p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">
              Evidence-First
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              검증된 사업 자료와 공고 원문 근거만 사용하고, 확인되지 않은
              수치와 성과는 PSST 사업계획서 초안에서 표시합니다.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
