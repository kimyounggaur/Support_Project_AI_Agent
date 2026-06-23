import { hasSupabasePublicEnv } from "@/lib/env";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const isConfigured = hasSupabasePublicEnv();

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-10 text-zinc-950">
      <section className="mx-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">
          GrantCompass AI
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">로그인</h1>
        <LoginForm isConfigured={isConfigured} />
      </section>
    </main>
  );
}
