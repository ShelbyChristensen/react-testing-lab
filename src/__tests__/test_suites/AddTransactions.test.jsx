import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import AccountContainer from "../../../components/AccountContainer";
import { vi } from "vitest";

beforeEach(() => {
  global.fetch = vi.fn((url, options) => {
    if (options?.method === "POST") {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 2,
            date: "2023-06-01",
            description: "Salary",
            category: "Income",
            amount: "2000.00",
          }),
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve([]),
    });
  });
});

test("adds new transaction to the list and sends POST request", async () => {
  render(<AccountContainer />);

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Date"), {
      target: { value: "2023-06-01" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Salary" },
    });
    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "Income" },
    });
    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "2000.00" },
    });

    fireEvent.click(screen.getByText("Add Transaction"));
  });

  await waitFor(() => {
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:6001/transactions",
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
