import { createTransaction } from "$lib/server/db/queries";
import { parseTransactionForm } from "$lib/server/validation";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }
  return { today: new Date().toISOString().slice(0, 10) };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      redirect(303, "/login");
    }

    const result = parseTransactionForm(await request.formData());
    if (!result.ok) {
      return fail(400, { values: result.values, error: result.error });
    }

    await createTransaction(locals.user.id, result.data);
    redirect(303, "/transactions");
  }
};
