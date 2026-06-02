import { describe, expect, it } from "vitest";

import {
  categoriesFor,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  isTransactionType,
  isValidCategory
} from "./categories";

describe("categoriesFor", () => {
  it("returns the income list for income", () => {
    expect(categoriesFor("income")).toEqual(INCOME_CATEGORIES);
  });
  it("returns the expense list for expense", () => {
    expect(categoriesFor("expense")).toEqual(EXPENSE_CATEGORIES);
  });
});

describe("isValidCategory", () => {
  it("accepts a category that belongs to the type", () => {
    expect(isValidCategory("income", "Salary")).toBe(true);
    expect(isValidCategory("expense", "Food")).toBe(true);
  });
  it("rejects a category from the other type", () => {
    expect(isValidCategory("income", "Food")).toBe(false);
  });
  it("rejects an unknown category", () => {
    expect(isValidCategory("expense", "Crypto")).toBe(false);
  });
});

describe("isTransactionType", () => {
  it("accepts income and expense", () => {
    expect(isTransactionType("income")).toBe(true);
    expect(isTransactionType("expense")).toBe(true);
  });
  it("rejects anything else", () => {
    expect(isTransactionType("transfer")).toBe(false);
  });
});
