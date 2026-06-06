import { z } from "zod";

export const TransactionCreate = z
  .object({
    type: z.enum(["income", "expense"]),
    category: z.string(),
    amount: z.number().positive(),
    occurredOn: z.string(),
    note: z.string().nullable()
  })
  .meta({ id: "TransactionCreate" });

export const TransactionUpdate = TransactionCreate.partial().meta({ id: "TransactionUpdate" });

export const TransactionResponse = z
  .object({
    id: z.string(),
    userId: z.string(),
    type: z.string(),
    category: z.string(),
    amount: z.number(),
    occurredOn: z.string(),
    note: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
  .meta({ id: "TransactionResponse" });

export const ErrorResponse = z
  .object({
    error: z.string(),
    message: z.string().optional()
  })
  .meta({ id: "ErrorResponse" });

export const TransactionListQuery = z
  .object({
    category: z.string().optional(),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Format must be YYYY-MM")
      .optional()
  })
  .meta({ id: "TransactionListQuery" });
