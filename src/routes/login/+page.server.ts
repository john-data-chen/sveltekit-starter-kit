import { DEMO_EMAIL } from "$lib/constants";
import * as m from "$lib/paraglide/messages";
import { setSessionCookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  return { defaultEmail: DEMO_EMAIL };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return fail(400, { email, message: m.login_error_email_required() });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return fail(400, { email, message: m.login_error_no_account() });
    }

    setSessionCookie(cookies, user.id);
    redirect(303, "/");
  }
};
