import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("ai runs and citations migration", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0004_ai_runs_citations.sql"),
    "utf8",
  );

  it("enables RLS on AI audit tables", () => {
    expect(sql).toMatch(/alter table public\.ai_runs enable row level security/i);
    expect(sql).toMatch(
      /alter table public\.ai_citations enable row level security/i,
    );
  });

  it("stores prompt version and source hash for reproducibility", () => {
    expect(sql).toMatch(/prompt_version text not null/i);
    expect(sql).toMatch(/source_hash text/i);
  });

  it("scopes AI audit rows to their owner", () => {
    expect(sql).toMatch(/auth\.uid\(\) = owner_id/i);
  });
});
