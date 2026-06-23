import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("introduces GrantCompass AI as a Korean grant-preparation workspace", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /지원나침반 AI/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/공고 분석/)).toBeInTheDocument();
    expect(screen.getAllByText(/PSST 사업계획서/).length).toBeGreaterThan(0);
  });
});
