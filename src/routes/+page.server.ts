import { getMonthlyStats } from "$lib/server/db/queries";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

const MONTH_RE = /^\d{4}-\d{2}$/;

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }

  const monthParam = url.searchParams.get("month");
  const month =
    monthParam && MONTH_RE.test(monthParam) ? monthParam : new Date().toISOString().slice(0, 7);

  const stats = await getMonthlyStats(locals.user.id, month);

  return { month, stats };
};
