import { describe, expect, it } from "vitest";

import { TransactionCreate } from "./schemas";

describe("schemas", () => {
  describe("TransactionCreate", () => {
    it("validates successfully for valid category", () => {
      const data = {
        type: "expense",
        category: "Food",
        amount: 100,
        occurredOn: "2024-01-01",
        note: null
      };
      const result = TransactionCreate.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("fails validation for invalid category", () => {
      const result = TransactionCreate.safeParse({
        type: "expense",
        category: "invalid_category",
        amount: 100,
        occurredOn: "2024-01-01",
        note: null
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid category");
      }
    });
  });
});
