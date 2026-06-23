import { z } from "zod";

const statusSchema = z.enum(["known", "unknown", "needs_confirmation"]);

const citedStringSchema = z
  .object({
    status: statusSchema,
    value: z.string().nullable(),
    citation_ids: z.array(z.string().min(1)),
  })
  .superRefine((field, context) => {
    if (field.status === "known" && field.citation_ids.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Known conclusions require at least one citation.",
        path: ["citation_ids"],
      });
    }
  });

const eligibilityRuleSchema = z
  .object({
    rule_type: z.enum([
      "business_age",
      "applicant_type",
      "region",
      "industry",
      "duplicate_support",
      "disqualification",
      "required_document",
      "other",
    ]),
    status: statusSchema,
    value: z.string().nullable(),
    citation_ids: z.array(z.string().min(1)),
  })
  .superRefine((field, context) => {
    if (field.status === "known" && field.citation_ids.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Known eligibility rules require at least one citation.",
        path: ["citation_ids"],
      });
    }
  });

export const grantNoticeExtractionSchema = z.object({
  title: citedStringSchema,
  eligibility: z.array(eligibilityRuleSchema),
  required_documents: z.array(citedStringSchema),
  evaluation_criteria: z.array(citedStringSchema),
  warnings: z.array(z.string()),
});

export type GrantNoticeExtraction = z.infer<typeof grantNoticeExtractionSchema>;
