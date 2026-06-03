import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export type LoginLookupResult =
  | { type: "found"; userId: number }
  | { type: "not_found" }
  | { type: "service_unavailable" };

export function logLoginInfrastructureError(context: string, error: unknown): void {
  console.error(`[login] ${context}`, error);
}

export async function findLoginUserByEmail(email: string): Promise<LoginLookupResult> {
  try {
    const { db } = await import("$lib/server/db");
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ? { type: "found", userId: user.id } : { type: "not_found" };
  } catch (error) {
    logLoginInfrastructureError("user lookup failed", error);
    return { type: "service_unavailable" };
  }
}
