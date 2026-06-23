import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders the Korean email login form", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "로그인" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인 링크 받기" })).toBeInTheDocument();
  });
});
