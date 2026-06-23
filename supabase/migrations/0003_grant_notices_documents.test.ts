import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("grant notices and documents migration", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0003_grant_notices_documents.sql"),
    "utf8",
  );

  it("enables RLS on grant notice tables", () => {
    expect(sql).toMatch(
      /alter table public\.grant_notices enable row level security/i,
    );
    expect(sql).toMatch(
      /alter table public\.grant_documents enable row level security/i,
    );
  });

  it("explicitly grants authenticated Data API access", () => {
    expect(sql).toMatch(
      /grant select, insert, update, delete on public\.grant_notices to authenticated/i,
    );
    expect(sql).toMatch(
      /grant select, insert, update, delete on public\.grant_documents to authenticated/i,
    );
  });

  it("scopes grants and documents to the owner", () => {
    expect(sql).toMatch(/auth\.uid\(\) = owner_id/i);
  });
});
