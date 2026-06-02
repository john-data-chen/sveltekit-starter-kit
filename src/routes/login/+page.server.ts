import { setSessionCookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const accounts = await db
    .select({ id: users.id, name: users.name, avatar: users.avatar })
    .from(users)
    .orderBy(users.id);

  return { accounts };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const userId = Number(form.get("userId"));

    if (!Number.isInteger(userId) || userId <= 0) {
      return fail(400, { message: "Invalid user" });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return fail(400, { message: "User not found" });
    }

    setSessionCookie(cookies, user.id);
    redirect(303, "/");
  }
};
