import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NewNoticePage from "./page";

describe("NewNoticePage", () => {
  it("renders a Korean grant notice intake form with attachments", () => {
    render(<NewNoticePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "공고 등록" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("공고명")).toBeInTheDocument();
    expect(screen.getByLabelText("공고 원문")).toBeInTheDocument();
    expect(screen.getByLabelText("첨부 파일")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "공고 저장" })).toBeInTheDocument();
  });
});
