import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("assets and evidence migration", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0002_assets_evidence.sql"),
    "utf8",
  );

  it("enables RLS on assets and evidence items", () => {
    expect(sql).toMatch(/alter table public\.assets enable row level security/i);
    expect(sql).toMatch(
      /alter table public\.evidence_items enable row level security/i,
    );
  });

  it("grants authenticated Data API access explicitly", () => {
    expect(sql).toMatch(
      /grant select, insert, update, delete on public\.assets to authenticated/i,
    );
    expect(sql).toMatch(
      /grant select, insert, update, delete on public\.evidence_items to authenticated/i,
    );
  });

  it("scopes rows to their owner", () => {
    expect(sql).toMatch(/auth\.uid\(\) = owner_id/i);
  });
});
