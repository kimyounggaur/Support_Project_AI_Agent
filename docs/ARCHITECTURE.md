# Architecture

## Stack

- Next.js App Router, React, TypeScript strict
- Tailwind CSS
- Supabase Auth, PostgreSQL, Storage, RLS
- OpenAI Responses API, Structured Outputs, File Search
- Vitest and Testing Library
- Vercel deployment target

## Boundaries

- `src/app`: route UI, layouts, route handlers
- `src/components`: reusable UI primitives and feature components
- `src/features`: feature-specific UI, schemas, services, repositories
- `src/lib`: cross-cutting clients, env parsing, security utilities
- `supabase/migrations`: schema changes and RLS policies
- `tests/fixtures`: synthetic grants, prompt injection, SSRF fixtures

## Evidence-First Data Flow

1. User creates or verifies business facts and assets.
2. User registers a grant notice by text or private file.
3. Server hashes the source and stores provenance.
4. AI extraction returns structured output only.
5. Zod validates output before persistence.
6. Server downgrades unsupported fields to `unknown`.
7. Eligibility and fit analysis reuse only verified facts and cited notice fields.
8. Proposal generation can use verified facts, cited notice requirements, and placeholders.
9. Claim Linter audits generated prose before approval or export.

## AI Safety

- Model output never directly mutates trusted records without server validation.
- Untrusted source text is wrapped and treated as data.
- No model receives tools for deletion, submission, payment, signature, or credential access.
- Logs store hashes, token counts, latency, and safety errors, not full proposal text.

## Build Safety

Service SDK clients must be initialized lazily inside getter functions. Do not create Supabase, OpenAI, or observability clients at module scope when env vars may be absent during `next build`.
