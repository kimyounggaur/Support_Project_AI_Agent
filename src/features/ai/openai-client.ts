import OpenAI from "openai";

type EnvInput = Record<string, string | undefined>;

export function getOpenAIClient(input: EnvInput = process.env) {
  const apiKey = input.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in environment.");
  }

  return new OpenAI({ apiKey });
}
