import { parseSessionCookie, SESSION_COOKIE_NAME } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { THEME_COOKIE } from "$lib/theme";
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

  // Render the `.dark` class on <html> for the explicit-dark and default (no cookie)
  // cases so the no-JS fallback and first-paint markup are correct. `light` and `system`
  // are resolved by the inline bootstrap script in app.html (the server cannot read the
  // OS preference); that script reconciles every case before first paint.
  const themeCookie = event.cookies.get(THEME_COOKIE);
  const htmlClass = themeCookie === undefined || themeCookie === "dark" ? ' class="dark"' : "";

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="en"', `<html lang="en"${htmlClass}`)
  });
};
