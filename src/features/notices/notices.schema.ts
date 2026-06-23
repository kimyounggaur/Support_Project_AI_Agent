import { z } from "zod";

export const grantNoticeTextInputSchema = z.object({
  title: z.string().trim().min(2).max(200),
  source_text: z.string().trim().min(20).max(500_000),
});

export type GrantNoticeTextInput = z.infer<typeof grantNoticeTextInputSchema>;
