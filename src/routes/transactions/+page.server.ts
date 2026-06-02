import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "$lib/categories";
import { deleteTransaction, listTransactions } from "$lib/server/db/queries";
import { redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

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

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) {
      redirect(303, "/login");
    }

    const form = await request.formData();
    const id = Number(form.get("id"));
    if (Number.isInteger(id) && id > 0) {
      // Ownership is enforced inside deleteTransaction (scoped by userId).
      await deleteTransaction(locals.user.id, id);
    }

    return { deleted: true };
  }
};
