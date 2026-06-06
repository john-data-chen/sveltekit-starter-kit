import { desc, eq } from "drizzle-orm";

import { type AuditAction, auditLogs, users } from "./schema";

import { db } from "./index";

/**
 * Records an audit log entry.
 *
 * Data-Permission Boundary: The summary field often contains line-item details
 * (e.g., amount, category). This is visible to admins in the activity trail
 * by design, treating admins as trusted compliance/governance auditors. Members
 * remain isolated. (Production hardening: redact amounts or restrict to aggregates
 * if line-item visibility is undesired).
 */
export async function recordAudit(
  actorId: number,
  action: AuditAction,
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
