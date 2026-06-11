import { and, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { auditLogs, users } from "../src/lib/server/db/schema";

// Removes the audit rows this run created: expense.spec.ts signs in as John and
// creates + deletes a Food 999 expense (summary "expense Food 999" per the
// `${type} ${category} ${amount}` format in the transaction actions). Runs once
// after all projects finish — a per-test afterAll would race across the four
// parallel browser projects. Scoped to ids above the global-setup baseline so
// audit history from before this run is never touched.
export default async function globalTeardown() {
  const baseline = Number(process.env.E2E_AUDIT_BASELINE_ID);
  if (!Number.isInteger(baseline)) {
    console.warn("E2E_AUDIT_BASELINE_ID is not set; skipping e2e audit cleanup.");
    return;
  }

  // DATABASE_URL was loaded into this process by global-setup.
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);
  try {
    const [john] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, "john@example.com"))
      .limit(1);
    if (!john) {
      return;
    }

    const deleted = await db
      .delete(auditLogs)
      .where(
        and(
          gt(auditLogs.id, baseline),
          eq(auditLogs.actorId, john.id),
          eq(auditLogs.summary, "expense Food 999")
        )
      )
      .returning({ id: auditLogs.id });
    if (deleted.length > 0) {
      console.log(`Cleaned up ${deleted.length} e2e audit log rows.`);
    }
  } finally {
    await client.end();
  }
}
