import { seedAssets } from "@/features/assets/seed-assets";

export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-6 text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium text-emerald-700">
            Evidence Ledger
          </p>
          <h1 className="text-3xl font-semibold tracking-normal">사업 자산</h1>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {seedAssets.map((asset) => (
            <article
              key={asset.url}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-zinc-950">
                  {asset.title}
                </h2>
                <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                  {asset.verification_status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {asset.description}
              </p>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block truncate text-sm font-medium text-emerald-700"
              >
                {asset.url}
              </a>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
