import { parseSessionCookie, SESSION_COOKIE_NAME } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import type { Handle } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const handle: Handle = async ({ event, resolve }) => {
  const userId = parseSessionCookie(event.cookies.get(SESSION_COOKIE_NAME));

  if (userId === null) {
    event.locals.user = null;
  } else {
    const [user] = await db
      .select({ id: users.id, name: users.name, avatar: users.avatar })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    event.locals.user = user ?? null;
  }

  return resolve(event);
};
