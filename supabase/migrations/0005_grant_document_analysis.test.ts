import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("grant document analysis migration", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0005_grant_document_analysis.sql"),
    "utf8",
  );

  it("adds extracted text and structured analysis fields to grant documents", () => {
    expect(sql).toMatch(/alter table public\.grant_documents/i);
    expect(sql).toMatch(/add column(?: if not exists)? extracted_text text/i);
    expect(sql).toMatch(/add column(?: if not exists)? analysis_summary text/i);
    expect(sql).toMatch(/add column(?: if not exists)? analysis_json jsonb/i);
    expect(sql).toMatch(/add column(?: if not exists)? analysis_error text/i);
  });

  it("creates a private grant document storage bucket", () => {
    expect(sql).toMatch(/insert into storage\.buckets/i);
    expect(sql).toMatch(/grant-documents/i);
    expect(sql).toMatch(/public,\s*file_size_limit,\s*allowed_mime_types/i);
  });

  it("limits storage object access to the authenticated owner folder", () => {
    expect(sql).toMatch(/on storage\.objects/i);
    expect(sql).toMatch(/bucket_id = 'grant-documents'/i);
    expect(sql).toMatch(
      /storage\.foldername\(name\)\)\[1\] = \(select auth\.uid\(\)::text\)/i,
    );
  });
});
