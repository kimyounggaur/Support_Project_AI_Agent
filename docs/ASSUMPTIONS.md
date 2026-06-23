# Assumptions

## Phase 0

- The workspace started as a non-Git folder containing only three Markdown reference files.
- The Claude Opus v2 master prompt is treated as user-approved product specification.
- The user explicitly requested autonomous progression without clarifying questions.
- Local Node is `v25.2.1`; `.nvmrc` recommends Node `22.13.1` for a stable LTS-like runtime.
- pnpm was installed but `pnpm install` failed during importing with no actionable error in this Windows path. npm install completed, so Phase 0 uses npm scripts and `package-lock.json`.
- Supabase and OpenAI credentials are not available yet. Implementation must continue with `.env.example`, mocks, and server-only lazy clients until keys are supplied.
- HWP/HWPX parsing remains out of MVP scope; only original retention and PDF conversion guidance are planned.

## Product Data

- The 30 music and instrument web app URLs are initial business assets with `verification_status='needs_review'`.
- Existing app descriptions are seed hints, not verified business facts.
- Unknown sales, users, contracts, patents, awards, investment, and market figures stay blank rather than becoming zero or invented values.
