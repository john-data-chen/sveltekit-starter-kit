import type { SessionUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";

/** Return the signed-in user, or throw a 401 error. */
export function requireApiUser(locals: App.Locals): SessionUser {
  if (!locals.user) {
    error(401, { message: "Unauthorized" });
  }
  return locals.user;
}

/** Return the signed-in user if they have the admin role, or throw a 403 error. */
export function requireApiAdmin(locals: App.Locals): SessionUser {
  const user = requireApiUser(locals);
  if (user.role !== "admin") {
    error(403, { message: "Forbidden" });
  }
  return user;
}

/** Return a formatted JSON error response. */
export function apiError(status: number, message: string): Response {
  return json({ message }, { status });
}
