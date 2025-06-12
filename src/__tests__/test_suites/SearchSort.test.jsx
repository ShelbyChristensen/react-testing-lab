import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
          {
            id: 2,
            date: "2023-06-01",
            description: "Salary",
            category: "Income",
            amount: "2000.00",
          },
        ]),
    })
  );
});

test("filters transactions when search is used", async () => {
  render(<AccountContainer />);

  await waitFor(() => {
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  fireEvent.change(
    screen.getByPlaceholderText("Search your Recent Transactions"),
    {
      target: { value: "Sal" },
    }
  );

  expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
  expect(screen.getByText("Salary")).toBeInTheDocument();
});
