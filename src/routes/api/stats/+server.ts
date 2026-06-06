import { apiError, apiJson, requireApiUser } from "$lib/server/api";
import { getMonthlyStats } from "$lib/server/db/queries";
import type { RequestEvent } from "@sveltejs/kit";
import { z } from "zod";

const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, "Format must be YYYY-MM");

export async function GET(event: RequestEvent) {
  const user = requireApiUser(event.locals);

  const month = event.url.searchParams.get("month");
  if (!month) {
    return apiError(400, "Missing month parameter");
  }

  const result = monthSchema.safeParse(month);
  if (!result.success) {
    return apiError(400, result.error.issues[0].message);
  }

  const stats = await getMonthlyStats(user.id, result.data);
  return apiJson(stats);
}
