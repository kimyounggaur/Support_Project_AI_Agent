import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardPage from "./page";

describe("DashboardPage", () => {
  it("renders a setup-safe dashboard shell before Supabase is configured", () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "대시보드" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Supabase 연결 대기/)).toBeInTheDocument();
    expect(screen.getByText(/공고 분석/)).toBeInTheDocument();
  });
});
