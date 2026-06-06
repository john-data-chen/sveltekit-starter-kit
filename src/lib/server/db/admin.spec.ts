import { describe, expect, it, vi } from "vitest";

import { listUsersWithStats } from "./admin";

vi.mock("./index", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        leftJoin: vi.fn(() => ({
          groupBy: vi.fn(() => ({
            orderBy: vi.fn().mockResolvedValue([
              {
                id: 1,
                name: "John",
                email: "john@example.com",
                avatar: "🦊",
                role: "admin",
                transactionCount: "10",
                totalIncome: "5000",
                totalExpense: "2000"
              }
            ])
          }))
        }))
      }))
    }))
  }
}));

describe("admin queries", () => {
  it("coerces count and sum aggregates to numbers in listUsersWithStats", async () => {
    const result = await listUsersWithStats();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      name: "John",
      email: "john@example.com",
      avatar: "🦊",
      role: "admin",
      transactionCount: 10,
      totalIncome: 5000,
      totalExpense: 2000
    });

    // Explicitly verify the type coercion
    expect(typeof result[0].transactionCount).toBe("number");
    expect(typeof result[0].totalIncome).toBe("number");
    expect(typeof result[0].totalExpense).toBe("number");
  });
});
