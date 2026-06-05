import { count, sql } from "drizzle-orm";

import { type UserRole, transactions, users } from "./schema";

import { db } from "./index";

export interface UserOverview {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  transactionCount: number;
  totalIncome: number;
  totalExpense: number;
}

/** Fetch all users with aggregated transaction stats (for admin overview). */
export async function listUsersWithStats(): Promise<UserOverview[]> {
  const totalIncome = sql<number>`coalesce(sum(case when ${transactions.type} = 'income' then ${transactions.amount} else 0 end), 0)::int`;
  const totalExpense = sql<number>`coalesce(sum(case when ${transactions.type} = 'expense' then ${transactions.amount} else 0 end), 0)::int`;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
      role: users.role,
      transactionCount: count(transactions.id),
      totalIncome: totalIncome,
      totalExpense: totalExpense
    })
    .from(users)
    .leftJoin(transactions, sql`${transactions.userId} = ${users.id}`)
    .groupBy(users.id)
    .orderBy(users.id);

  return rows.map((row) => ({
    ...row,
    transactionCount: Number(row.transactionCount),
    totalIncome: Number(row.totalIncome),
    totalExpense: Number(row.totalExpense)
  }));
}
