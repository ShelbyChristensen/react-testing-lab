import { render, screen, waitFor } from "@testing-library/react";
import AccountContainer from "@/components/AccountContainer";
import { vi } from "vitest";

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            date: "2023-05-01",
            description: "Groceries",
            category: "Food",
            amount: "50.00",
          },
        ]),
    })
  );
});

test("displays transactions after fetch", async () => {
  render(<AccountContainer />);

  await waitFor(() => {
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("50.00")).toBeInTheDocument();
  });
});
