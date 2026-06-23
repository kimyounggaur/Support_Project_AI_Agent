// @vitest-environment node

import { describe, expect, it } from "vitest";
import { getOpenAIClient } from "./openai-client";

describe("getOpenAIClient", () => {
  it("throws a setup-oriented error when OPENAI_API_KEY is missing", () => {
    expect(() => getOpenAIClient({ OPENAI_API_KEY: "" })).toThrow(
      /OPENAI_API_KEY/,
    );
  });

  it("creates a client lazily when an API key exists", () => {
    const client = getOpenAIClient({ OPENAI_API_KEY: "sk-test" });

    expect(client).toBeDefined();
  });
});
