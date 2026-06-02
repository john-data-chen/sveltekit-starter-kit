import { isTransactionType, isValidCategory } from "$lib/categories";
import { parseAmount } from "$lib/money";
import type { TransactionInput } from "$lib/server/db/queries";

export interface TransactionFormValues {
  type: string;
  category: string;
  amount: string;
  occurredOn: string;
  note: string;
}

export type TransactionFormResult =
  | { ok: true; data: TransactionInput }
  | { ok: false; values: TransactionFormValues; error: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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
    return { ok: false, values, error: "Please choose a type." };
  }
  if (!isValidCategory(values.type, values.category)) {
    return { ok: false, values, error: "Please choose a valid category for this type." };
  }

  const amount = parseAmount(values.amount);
  if (amount === null || amount <= 0) {
    return { ok: false, values, error: "Amount must be a positive whole number." };
  }
  if (!DATE_RE.test(values.occurredOn)) {
    return { ok: false, values, error: "Please choose a valid date." };
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
