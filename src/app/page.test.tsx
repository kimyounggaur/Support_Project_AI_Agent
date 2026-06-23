import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const pushMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Home", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("introduces GrantCompass AI as a Korean grant-preparation workspace", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /지원나침반 AI/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/공고 분석/)).toBeInTheDocument();
    expect(screen.getAllByText(/PSST 사업계획서/).length).toBeGreaterThan(0);
  });

  it("routes the primary action buttons to their workspaces", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "공고 등록" }));
    expect(pushMock).toHaveBeenCalledWith("/notices/new");

    await user.click(screen.getByRole("button", { name: "사업 프로필" }));
    expect(pushMock).toHaveBeenCalledWith("/assets");
  });
});
