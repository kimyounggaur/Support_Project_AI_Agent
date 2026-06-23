import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AssetsPage from "./page";

describe("AssetsPage", () => {
  it("renders the seeded assets for review", () => {
    render(<AssetsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "사업 자산" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Guitar Chord Viewer")).toBeInTheDocument();
    expect(screen.getAllByText("needs_review")).toHaveLength(30);
  });
});
