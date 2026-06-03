import { parseSessionCookie } from "$lib/server/auth";
import type { SessionUser } from "$lib/server/auth";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export function logSessionInfrastructureError(context: string, error: unknown): void {
  console.error(`[session] ${context}`, error);
}

export async function resolveSessionUser(
  cookieValue: string | undefined
): Promise<SessionUser | null> {
  let userId: number | null;

  try {
    userId = parseSessionCookie(cookieValue);
  } catch (error) {
    logSessionInfrastructureError("cookie parsing failed", error);
    return null;
  }

  if (userId === null) {
    return null;
  }

  try {
    const { db } = await import("$lib/server/db");
    const [user] = await db
      .select({ id: users.id, name: users.name, avatar: users.avatar })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user ?? null;
  } catch (error) {
    logSessionInfrastructureError("user lookup failed", error);
    return null;
  }
}
