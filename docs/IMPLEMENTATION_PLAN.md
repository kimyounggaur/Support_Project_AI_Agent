# Implementation Plan

## Phase Checklist

- [x] Phase 0 - Repository audit, Next.js scaffold, docs, env example, baseline tests
- [ ] Phase 1 - Design system, Supabase clients, Auth, profiles, business profiles, RLS
- [ ] Phase 2 - Onboarding wizard, business profile draft, 30 asset seed, evidence CRUD
- [ ] Phase 3 - Grant notice registration, text input, private file upload, MIME/hash validation, SSRF-safe URL path
- [ ] Phase 4 - OpenAI extraction adapter, structured grant schema, citations, prompt-injection fixture
- [ ] Phase 5 - Eligibility checker, hard gate server validation, fit scoring, task conversion
- [ ] Phase 6 - Applications, PSST sections, Markdown editor, autosave, draft versions, Claim Linter
- [ ] Phase 7 - Red-team review, budget module, required-document checklist, presentation questions
- [ ] Phase 8 - Markdown/DOCX/PDF export, preflight, dashboard live data
- [ ] Phase 9 - Test hardening, golden corpus, E2E, observability, cost and security checks
- [ ] Phase 10 - Vercel deployment documentation and smoke test
- [ ] Phase 11 - Optional multi-agent orchestration after MVP eval improvement

## Immediate Next Steps

1. Add Supabase and app schema dependencies.
2. Write failing tests for environment parsing and server-only client factories.
3. Implement lazy Supabase client wrappers that do not crash `next build` without env values.
4. Add initial migrations for `profiles` and `business_profiles` with RLS.
5. Build the responsive Korean app shell with protected dashboard routing.

## Verification Gate Per Phase

Each phase must run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Additional phase-specific probes must be added as tests before implementation.
