import { describe, expect, it, vi } from "vitest";

import { listRecentAudits, recordAudit } from "./audit";

import { db } from "./index";

vi.mock("./index", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn()
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        innerJoin: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue([
              {
                id: 1,
                actor: { id: 1, name: "John", avatar: "🦊", email: "john@example.com" },
                action: "create",
                entity: "transaction",
                entityId: 10,
                summary: "income Salary 1000",
                createdAt: new Date()
              }
            ])
          }))
        }))
      }))
    }))
  }
}));

describe("audit logs", () => {
  it("records an audit log successfully", async () => {
    const insertMock = vi.mocked(db.insert);
    const valuesMock = vi.fn();
    insertMock.mockReturnValueOnce({ values: valuesMock } as any);

    await recordAudit(1, "create", "transaction", 10, "income Salary 1000");

    expect(insertMock).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith({
      actorId: 1,
      action: "create",
      entity: "transaction",
      entityId: 10,
      summary: "income Salary 1000"
    });
  });

  it("lists recent audits", async () => {
    const result = await listRecentAudits(5);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      action: "create",
      entity: "transaction",
      actor: { name: "John" }
    });
  });
});
