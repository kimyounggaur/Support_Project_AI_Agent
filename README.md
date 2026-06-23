# 지원나침반 AI

지원사업 공고 분석, 자격 판정, 적합도 평가, PSST 사업계획서 초안 작성, 심사 대응, 제출 준비를 한 곳에서 처리하는 한국어 AI 워크스페이스입니다.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Project Docs

- Product: `docs/PRD.md`
- Architecture: `docs/ARCHITECTURE.md`
- Assumptions: `docs/ASSUMPTIONS.md`
- Decisions: `docs/DECISIONS.md`
- Test plan: `docs/TEST_PLAN.md`
- Implementation checklist: `docs/IMPLEMENTATION_PLAN.md`
- Evaluation rubric: `docs/EVAL_RUBRIC.md`

## Current Package Manager Note

The approved design targets pnpm. In this Windows workspace, pnpm failed during package importing with no actionable error, while npm installed successfully. Phase 0 is therefore locked with `package-lock.json`; see `docs/DECISIONS.md`.
