import { getTextDirection } from "$lib/paraglide/runtime";
import { paraglideMiddleware } from "$lib/paraglide/server";
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

  // Resolve the locale (cookie strategy → `zh-tw` default when no cookie) and render the
  // `<html lang>/<dir>` placeholders plus the theme class in a single pass. paraglideMiddleware
  // also establishes the request-scoped locale context so server `load`/actions can resolve
  // localized messages. The `.dark` class is injected on `<html` (a stable anchor) because the
  // `lang` attribute is now a Paraglide placeholder rather than the literal `lang="en"`.
  return paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html
          .replace("%paraglide.lang%", locale)
          .replace("%paraglide.dir%", getTextDirection(locale))
          .replace("<html", `<html${htmlClass}`)
    });
  });
};
