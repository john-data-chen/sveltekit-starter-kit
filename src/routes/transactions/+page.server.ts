import { ALL_CATEGORIES } from "$lib/categories";
import { isValidMonth } from "$lib/date";
import { deleteTransaction, listTransactions } from "$lib/server/db/queries";
import { requireUser } from "$lib/server/guards";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = requireUser(locals);

  const categoryParam = url.searchParams.get("category") ?? "";
  const monthParam = url.searchParams.get("month") ?? "";

  const category = categoryParam || undefined;
  const month = isValidMonth(monthParam) ? monthParam : undefined;

  const transactions = await listTransactions(user.id, { category, month });

  return {
    transactions,
    filters: { category: category ?? "", month: month ?? "" },
    categoryOptions: ALL_CATEGORIES
  };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    const user = requireUser(locals);

    const form = await request.formData();
    const id = Number(form.get("id"));
    if (Number.isInteger(id) && id > 0) {
      // Ownership is enforced inside deleteTransaction (scoped by userId).
      await deleteTransaction(user.id, id);
    }

    return { deleted: true };
  }
};
