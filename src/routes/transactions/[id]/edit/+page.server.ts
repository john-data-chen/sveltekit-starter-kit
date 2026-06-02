import { getTransaction, updateTransaction } from "$lib/server/db/queries";
import { parseTransactionForm } from "$lib/server/validation";
import { error, fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    error(404, "Transaction not found");
  }

  const transaction = await getTransaction(locals.user.id, id);
  if (!transaction) {
    error(404, "Transaction not found");
  }

  return { transaction };
};

export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    if (!locals.user) {
      redirect(303, "/login");
    }

    const id = Number(params.id);
    if (!Number.isInteger(id)) {
      error(404, "Transaction not found");
    }

    const result = parseTransactionForm(await request.formData());
    if (!result.ok) {
      return fail(400, { values: result.values, error: result.error });
    }

    const updated = await updateTransaction(locals.user.id, id, result.data);
    if (!updated) {
      // Not owned by this user (or already gone).
      error(404, "Transaction not found");
    }

    redirect(303, "/transactions");
  }
};
