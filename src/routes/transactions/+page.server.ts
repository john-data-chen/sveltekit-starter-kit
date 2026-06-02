import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "$lib/categories";
import { listTransactions } from "$lib/server/db/queries";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

const MONTH_RE = /^\d{4}-\d{2}$/;

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }

  const categoryParam = url.searchParams.get("category") ?? "";
  const monthParam = url.searchParams.get("month") ?? "";

  const category = categoryParam || undefined;
  const month = MONTH_RE.test(monthParam) ? monthParam : undefined;

  const transactions = await listTransactions(locals.user.id, { category, month });

  return {
    transactions,
    filters: { category: category ?? "", month: month ?? "" },
    categoryOptions: [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  };
};
