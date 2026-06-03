import type { SessionUser } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

/** Return the signed-in user, or redirect to the login page when absent. */
export function requireUser(locals: App.Locals): SessionUser {
  if (!locals.user) {
    redirect(303, "/login");
  }
  return locals.user;
}
