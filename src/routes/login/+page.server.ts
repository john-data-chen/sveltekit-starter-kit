import { setSessionCookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import type { Actions, PageServerLoad } from "./$types";

// Pre-filled so a visitor can sign in with one click. No password / no registration.
const DEFAULT_EMAIL = "john@example.com";

export const load: PageServerLoad = () => {
  return { defaultEmail: DEFAULT_EMAIL };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return fail(400, { email, message: "Please enter your email." });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return fail(400, { email, message: "No account found for that email." });
    }

    setSessionCookie(cookies, user.id);
    redirect(303, "/");
  }
};
