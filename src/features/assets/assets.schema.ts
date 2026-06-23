import { z } from "zod";

export const verificationStatusSchema = z.enum([
  "needs_review",
  "verified",
  "rejected",
]);

const httpUrlSchema = z.string().url().refine(
  (value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  },
  { message: "Only http and https URLs are allowed." },
);

export const assetSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  url: httpUrlSchema,
  description: z.string().min(1),
  verification_status: verificationStatusSchema,
});

export const evidenceItemSchema = z.object({
  label: z.string().min(1),
  value: z.string(),
  source_type: z.enum(["user_input", "asset", "grant_notice", "document"]),
  verification_status: verificationStatusSchema,
});

export type AssetSeed = z.infer<typeof assetSchema>;
export type EvidenceItemInput = z.infer<typeof evidenceItemSchema>;
