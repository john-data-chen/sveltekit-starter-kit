import type { TransactionType } from "$lib/categories";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";

import { type Transaction, transactions } from "./schema";

import { db } from "./index";

export interface TransactionInput {
  type: TransactionType;
  category: string;
  amount: number;
  occurredOn: string;
  note: string | null;
}

export interface ListFilters {
  category?: string;
  month?: string; // "YYYY-MM"
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlyStats {
  income: number;
  expense: number;
  balance: number;
  expenseByCategory: CategoryTotal[];
}

/** Inclusive start / exclusive end ISO dates for a "YYYY-MM" month. */
function monthRange(month: string): { start: string; end: string } {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = `${month}-01`;
  const end =
    monthIndex === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  return { start, end };
}

/** List a user's transactions, optionally filtered by category and/or month. */
export function listTransactions(
  userId: number,
  filters: ListFilters = {}
): Promise<Transaction[]> {
  const conditions = [eq(transactions.userId, userId)];

  if (filters.category) {
    conditions.push(eq(transactions.category, filters.category));
  }
  if (filters.month) {
    const { start, end } = monthRange(filters.month);
    conditions.push(gte(transactions.occurredOn, start), lt(transactions.occurredOn, end));
  }

  return db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.occurredOn), desc(transactions.id));
}

/** Fetch a single transaction owned by the user, or null. */
export async function getTransaction(userId: number, id: number): Promise<Transaction | null> {
  const [row] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .limit(1);

  return row ?? null;
}

/** Insert a new transaction for the user. */
export async function createTransaction(
  userId: number,
  input: TransactionInput
): Promise<Transaction> {
  const [row] = await db
    .insert(transactions)
    .values({ ...input, userId })
    .returning();

  return row;
}

/** Update a transaction only if it belongs to the user. Returns null when not owned/found. */
export async function updateTransaction(
  userId: number,
  id: number,
  input: TransactionInput
): Promise<Transaction | null> {
  const [row] = await db
    .update(transactions)
    .set(input)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();

  return row ?? null;
}

export interface DeletedTransaction {
  id: number;
  type: TransactionType;
  category: string;
  amount: number;
}

/** Delete a transaction only if it belongs to the user. Returns the deleted transaction details or null. */
export async function deleteTransaction(
  userId: number,
  id: number
): Promise<DeletedTransaction | null> {
  const [row] = await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning({
      id: transactions.id,
      type: transactions.type,
      category: transactions.category,
      amount: transactions.amount
    });

  return row ?? null;
}

/** Aggregate a user's income / expense / balance and expense-by-category for one month. */
export async function getMonthlyStats(userId: number, month: string): Promise<MonthlyStats> {
  const { start, end } = monthRange(month);
  const monthScope = and(
    eq(transactions.userId, userId),
    gte(transactions.occurredOn, start),
    lt(transactions.occurredOn, end)
  );

  const totalAmount = sql<number>`coalesce(sum(${transactions.amount}), 0)::int`;

  const totals = await db
    .select({ type: transactions.type, total: totalAmount })
    .from(transactions)
    .where(monthScope)
    .groupBy(transactions.type);

  let income = 0;
  let expense = 0;
  for (const row of totals) {
    if (row.type === "income") {
      income = Number(row.total);
    } else {
      expense = Number(row.total);
    }
  }

  const byCategory = await db
    .select({ category: transactions.category, total: totalAmount })
    .from(transactions)
    .where(and(monthScope, eq(transactions.type, "expense")))
    .groupBy(transactions.category);

  const expenseByCategory = byCategory
    .map((row) => ({ category: row.category, total: Number(row.total) }))
    .sort((a, b) => b.total - a.total);

  return { income, expense, balance: income - expense, expenseByCategory };
}

export interface ListPagedFilters extends ListFilters {
  limit?: number;
  offset?: number;
}

/** List a user's transactions with pagination, returning rows and total count. */
export async function listTransactionsPaged(
  userId: number,
  filters: ListPagedFilters = {}
): Promise<{ rows: Transaction[]; total: number }> {
  const conditions = [eq(transactions.userId, userId)];

  if (filters.category) {
    conditions.push(eq(transactions.category, filters.category));
  }
  if (filters.month) {
    const { start, end } = monthRange(filters.month);
    conditions.push(gte(transactions.occurredOn, start), lt(transactions.occurredOn, end));
  }

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(and(...conditions));

  const total = Number(countResult?.count ?? 0);

  const query = db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.occurredOn), desc(transactions.id));

  const rows = await (filters.limit !== undefined
    ? filters.offset !== undefined
      ? query.limit(filters.limit).offset(filters.offset)
      : query.limit(filters.limit)
    : filters.offset !== undefined
      ? query.offset(filters.offset)
      : query);

  return { rows, total };
}
