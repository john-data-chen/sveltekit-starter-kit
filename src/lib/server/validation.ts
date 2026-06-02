import { isTransactionType, isValidCategory } from "$lib/categories";
import { isValidDate } from "$lib/date";
import { parseAmount } from "$lib/money";
import * as m from "$lib/paraglide/messages";
import type { TransactionInput } from "$lib/server/db/queries";
import type { TransactionFormValues } from "$lib/transaction";

export type TransactionFormResult =
  | { ok: true; data: TransactionInput }
  | { ok: false; values: TransactionFormValues; error: string };

/** Validate a transaction form submission against the fixed category lists. */
export function parseTransactionForm(form: FormData): TransactionFormResult {
  const values: TransactionFormValues = {
    type: String(form.get("type") ?? ""),
    category: String(form.get("category") ?? ""),
    amount: String(form.get("amount") ?? ""),
    occurredOn: String(form.get("occurredOn") ?? ""),
    note: String(form.get("note") ?? "")
  };

  if (!isTransactionType(values.type)) {
    return { ok: false, values, error: m.validation_choose_type() };
  }
  if (!isValidCategory(values.type, values.category)) {
    return { ok: false, values, error: m.validation_choose_category() };
  }

  const amount = parseAmount(values.amount);
  if (amount === null || amount <= 0) {
    return { ok: false, values, error: m.validation_amount_positive() };
  }
  if (!isValidDate(values.occurredOn)) {
    return { ok: false, values, error: m.validation_choose_date() };
  }

  const note = values.note.trim();

  return {
    ok: true,
    data: {
      type: values.type,
      category: values.category,
      amount,
      occurredOn: values.occurredOn,
      note: note || null
    }
  };
}
