import { desc, eq } from "drizzle-orm";

import { auditLogs, users } from "./schema";

import { db } from "./index";

export async function recordAudit(
  actorId: number,
  action: "create" | "update" | "delete",
  entity: string,
  entityId: number | null,
  summary: string | null
) {
  try {
    await db.insert(auditLogs).values({
      actorId,
      action,
      entity,
      entityId,
      summary
    });
  } catch (error) {
    console.error("Failed to record audit log", error);
  }
}

export async function listRecentAudits(limit = 50) {
  return await db
    .select({
      id: auditLogs.id,
      actor: {
        id: users.id,
        name: users.name,
        avatar: users.avatar,
        email: users.email
      },
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      summary: auditLogs.summary,
      createdAt: auditLogs.createdAt
    })
    .from(auditLogs)
    .innerJoin(users, eq(auditLogs.actorId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}
