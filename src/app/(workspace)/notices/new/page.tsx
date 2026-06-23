import { NoticeForm } from "./notice-form";

export default function NewNoticePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-6 text-zinc-950">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">Grant Notice</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          공고 등록
        </h1>

        <NoticeForm />
      </section>
    </main>
  );
}
