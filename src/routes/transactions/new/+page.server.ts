import { today } from "$lib/date";
import { createTransaction } from "$lib/server/db/queries";
import { requireUser } from "$lib/server/guards";
import { parseTransactionForm } from "$lib/server/validation";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
  requireUser(locals);
  return { today: today() };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const user = requireUser(locals);

    const result = parseTransactionForm(await request.formData());
    if (!result.ok) {
      return fail(400, { values: result.values, error: result.error });
    }

    await createTransaction(user.id, result.data);
    redirect(303, "/transactions");
  }
};
