export type TransactionType = "income" | "expense";

export const INCOME_CATEGORIES = ["Salary", "Bonus", "Investment", "Other Income"] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Shopping",
  "Medical",
  "Other Expense"
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type Category = IncomeCategory | ExpenseCategory;

/** Fixed category list for a given transaction type. */
export function categoriesFor(type: TransactionType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

/** True when `category` belongs to the fixed list for `type`. */
export function isValidCategory(type: TransactionType, category: string): boolean {
  return categoriesFor(type).includes(category);
}

/** True when the string is one of the two supported transaction types. */
export function isTransactionType(value: string): value is TransactionType {
  return value === "income" || value === "expense";
}
