# Decisions

## ADR-0001 - Treat Claude Opus v2 master prompt as approved specification

- Date: 2026-06-23
- Status: Accepted

The user asked to develop from the attached Markdown design without asking for step-by-step approval. The file `지원사업_AI_에이전트_바이브코딩_마스터_프롬프트(Claude_Opus_v2).md` is therefore the source specification for implementation order, acceptance probes, and product rules.

## ADR-0002 - Use npm lockfile for Phase 0 despite pnpm target

- Date: 2026-06-23
- Status: Accepted with review

The design target is pnpm. In this local Windows workspace, both pnpm 11.8.0 and pnpm 10.34.4 failed at the dependency importing stage without a concrete error after repeated attempts. npm 11.6.2 installed the same project successfully. To avoid blocking the user, Phase 0 uses npm scripts and `package-lock.json`. Revisit pnpm after moving the repo to a shorter ASCII path or a stable Node runtime.

## ADR-0003 - Start with a working workspace shell

- Date: 2026-06-23
- Status: Accepted

The first screen should be the product workspace rather than a marketing landing page. Phase 0 replaces the generated Next.js starter page with a Korean dashboard shell that exposes the core workflow labels and product metadata while deeper data-backed screens are developed in later phases.
