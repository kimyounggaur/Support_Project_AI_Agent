export default function NewNoticePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-6 text-zinc-950">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">Grant Notice</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          공고 등록
        </h1>

        <form className="mt-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-zinc-800"
            >
              공고명
            </label>
            <input
              id="title"
              name="title"
              className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-emerald-500 focus:ring-2"
              placeholder="예: 2026 예비창업 지원사업"
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
            />
          </div>

          <button
            type="submit"
            className="h-11 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white"
          >
            공고 저장
          </button>
        </form>
      </section>
    </main>
  );
}
