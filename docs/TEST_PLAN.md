# Test Plan

## Required Commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Current Test Coverage

- `src/app/page.test.tsx`: verifies the first screen introduces 지원나침반 AI and the core workflow.
- `src/app/layout.test.ts`: verifies Korean product metadata.

## Phase Coverage Targets

- Phase 1: auth guards, onboarding redirect, Supabase RLS integration tests.
- Phase 2: asset CRUD, seed count, verified vs needs_review separation.
- Phase 3: file validation, private storage access, SSRF allow/deny fixtures.
- Phase 4: structured output schema validation, malformed AI output handling, prompt injection fixture.
- Phase 5: eligibility hard gate boundaries, fit score server aggregation.
- Phase 6: PSST section creation, autosave, version restore, Claim Linter.
- Phase 7: budget arithmetic, checklist generation, red-team severity split.
- Phase 8: export preflight and Korean DOCX integrity.
- Phase 9: golden corpus rubric, E2E happy path, accessibility and keyboard checks.

## Golden Corpus

Create synthetic notices under `tests/fixtures/grants/`:

1. clear ineligible business age
2. complex business age reference date
3. regional restriction
4. self-funding ratio
5. conflicting attachment dates
6. unsupported revenue request
7. prompt injection text
8. short character-limit section
