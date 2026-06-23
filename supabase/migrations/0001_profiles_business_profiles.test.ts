import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("profiles and business_profiles migration", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0001_profiles_business_profiles.sql"),
    "utf8",
  );

  it("enables RLS on user-owned tables", () => {
    expect(sql).toMatch(/alter table public\.profiles enable row level security/i);
    expect(sql).toMatch(
      /alter table public\.business_profiles enable row level security/i,
    );
  });

  it("explicitly grants Data API access for new Supabase defaults", () => {
    expect(sql).toMatch(/grant select, insert, update on public\.profiles to authenticated/i);
    expect(sql).toMatch(
      /grant select, insert, update, delete on public\.business_profiles to authenticated/i,
    );
  });

  it("keeps users scoped to their own profile and business rows", () => {
    expect(sql).toMatch(/auth\.uid\(\) = id/i);
    expect(sql).toMatch(/auth\.uid\(\) = owner_id/i);
  });
});
