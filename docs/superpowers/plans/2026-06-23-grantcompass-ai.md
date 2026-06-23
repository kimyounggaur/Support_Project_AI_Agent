# GrantCompass AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved GrantCompass AI MVP from repository scaffold through evidence-first proposal generation and export.

**Architecture:** Next.js App Router hosts the Korean workspace UI and route handlers. Supabase owns Auth, PostgreSQL, Storage, and RLS. OpenAI calls stay server-side behind schema-validated services and Claim Linter gates.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase, OpenAI Responses API, Vitest, Testing Library, Vercel.

---

### Task 0: Repository Baseline

**Files:**
- Create: `AGENTS.md`
- Create: `.env.example`
- Create: `.nvmrc`
- Create: `docs/PRD.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/ASSUMPTIONS.md`
- Create: `docs/DECISIONS.md`
- Create: `docs/TEST_PLAN.md`
- Create: `docs/IMPLEMENTATION_PLAN.md`
- Create: `docs/EVAL_RUBRIC.md`
- Test: `src/app/page.test.tsx`
- Test: `src/app/layout.test.ts`

- [x] **Step 1: Scaffold Next.js App Router**

Run:

```bash
npm install
```

Expected: dependencies install and `package-lock.json` exists.

- [x] **Step 2: Write failing smoke tests**

Create tests that expect the Korean product title, workflow labels, and metadata.

- [x] **Step 3: Implement minimal workspace shell**

Replace the generated starter page with the Korean dashboard shell and metadata module.

- [ ] **Step 4: Verify baseline**

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Expected: all commands exit 0, except known audit residuals documented in `docs/DECISIONS.md`.

### Task 1: Supabase Foundation

**Files:**
- Create: `src/lib/env.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `supabase/migrations/0001_profiles_business_profiles.sql`
- Test: `src/lib/env.test.ts`

- [ ] **Step 1: Write env parsing tests**

Test missing optional values, required server values for runtime actions, and public Supabase URL/key parsing.

- [ ] **Step 2: Implement lazy env and client factories**

Use getter functions so `next build` does not initialize Supabase at module scope.

- [ ] **Step 3: Write migration RLS tests**

Add SQL or integration fixtures proving user A cannot read user B business rows.

### Task 2: Business Assets

**Files:**
- Create: `src/features/assets/seed-assets.ts`
- Create: `src/features/assets/assets.schema.ts`
- Create: `supabase/migrations/0002_assets_evidence.sql`
- Test: `src/features/assets/assets.schema.test.ts`

- [ ] **Step 1: Add 30 seed assets**

All assets start with `verification_status='needs_review'`.

- [ ] **Step 2: Add verified/unverified query separation**

Services used by AI context must only return verified facts unless placeholders are explicitly requested.

### Task 3: Grant Notice Intake

**Files:**
- Create: `src/features/notices/notices.schema.ts`
- Create: `src/features/notices/file-validation.ts`
- Create: `src/features/notices/url-safety.ts`
- Test: `src/features/notices/file-validation.test.ts`
- Test: `src/features/notices/url-safety.test.ts`

- [ ] **Step 1: Add file and URL safety tests**

Reject wrong MIME, oversized files, private IP URLs, link-local URLs, and metadata URLs.

- [ ] **Step 2: Implement validation**

Use server-side checks before storage or fetch.

### Task 4: Evidence-First AI

**Files:**
- Create: `src/features/ai/openai-client.ts`
- Create: `src/features/grants/extraction.schema.ts`
- Create: `src/features/claims/claim-linter.ts`
- Test: `src/features/grants/extraction.schema.test.ts`
- Test: `src/features/claims/claim-linter.test.ts`

- [ ] **Step 1: Write schema and linter tests**

Malformed AI output must fail safely. Unsupported numbers and superlatives must be flagged.

- [ ] **Step 2: Implement schemas and linter**

Persist only validated structured outputs with citation metadata.

### Task 5: Proposal Workspace

**Files:**
- Create: `src/features/applications/psst.ts`
- Create: `src/features/applications/draft-versioning.ts`
- Test: `src/features/applications/psst.test.ts`
- Test: `src/features/applications/draft-versioning.test.ts`

- [ ] **Step 1: Write PSST generation tests**

Default sections must match the approved PSST set and preserve `psst_pillar`.

- [ ] **Step 2: Implement section and draft version logic**

Autosave and generated drafts must never overwrite user originals without a version record.
