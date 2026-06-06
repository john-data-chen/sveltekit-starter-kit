import type { SessionUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";

/** Return the signed-in user, or throw a 401 error. */
export function requireApiUser(locals: App.Locals): SessionUser {
  if (!locals.user) {
    error(401, { message: "Unauthorized" });
  }
  return locals.user;
}

/** Standard JSON response payload wrapper for API responses. */
export function apiJson<T>(data: T, init?: ResponseInit): Response {
  return json(data, init);
}

/** Return a formatted JSON error response. */
export function apiError(status: number, message: string): Response {
  return json({ error: message }, { status });
}
