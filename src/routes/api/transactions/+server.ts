import { apiError, apiJson, requireApiUser } from "$lib/server/api";
import { recordAudit } from "$lib/server/db/audit";
import { createTransaction, listTransactions } from "$lib/server/db/queries";
import { TransactionCreate, TransactionListQuery, serializeTransaction } from "$lib/server/schemas";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
  const user = requireApiUser(event.locals);

  const category = event.url.searchParams.get("category") || undefined;
  const month = event.url.searchParams.get("month") || undefined;

  const queryResult = TransactionListQuery.safeParse({ category, month });
  if (!queryResult.success) {
    return apiError(400, "Invalid query parameters");
  }

  const transactions = await listTransactions(user.id, queryResult.data);
  return apiJson(transactions.map(serializeTransaction));
}

export async function POST(event: RequestEvent) {
  const user = requireApiUser(event.locals);

  const body = await event.request.json().catch(() => null);
  if (!body) {
    return apiError(400, "Invalid JSON");
  }

  const result = TransactionCreate.safeParse(body);
  if (!result.success) {
    return apiError(400, result.error.issues[0].message);
  }

  const transaction = await createTransaction(user.id, result.data);
  await recordAudit(
    user.id,
    "create",
    "transaction",
    transaction.id,
    `${transaction.type} in ${transaction.category} for ${transaction.amount}`
  );

  return apiJson(serializeTransaction(transaction), { status: 201 });
}
