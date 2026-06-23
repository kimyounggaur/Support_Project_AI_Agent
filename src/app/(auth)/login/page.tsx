import { hasSupabasePublicEnv } from "@/lib/env";

export default function LoginPage() {
  const isConfigured = hasSupabasePublicEnv();

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-10 text-zinc-950">
      <section className="mx-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">
          GrantCompass AI
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">로그인</h1>
        <form className="mt-6 space-y-4">
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
            disabled={!isConfigured}
            className="h-11 w-full rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600"
          >
            로그인 링크 받기
          </button>
        </form>
        {!isConfigured ? (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Supabase 환경값을 설정하면 이메일 로그인을 사용할 수 있습니다.
          </p>
        ) : null}
      </section>
    </main>
  );
}
