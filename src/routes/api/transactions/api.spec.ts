import * as audit from "$lib/server/db/audit";
import * as queries from "$lib/server/db/queries";
import type { RequestEvent } from "@sveltejs/kit";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { GET, POST } from "./+server";
import { GET as GET_ID, PATCH, DELETE } from "./[id]/+server";

vi.mock("$lib/server/db/queries", () => ({
  listTransactions: vi.fn(),
  getTransaction: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn()
}));

vi.mock("$lib/server/db/audit", () => ({
  recordAudit: vi.fn()
}));

vi.mock("@sveltejs/kit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sveltejs/kit")>();
  return {
    ...actual,
    error: vi.fn((status, message) => {
      throw { status, message };
    })
  };
});

function createMockEvent(
  user: any = { id: 1, name: "Test", role: "member" },
  params = {},
  url = new URL("http://localhost"),
  body: any = null
): RequestEvent {
  return {
    locals: { user } as App.Locals,
    params,
    url,
    request: {
      json: vi.fn().mockResolvedValue(body)
    }
  } as unknown as RequestEvent;
}

describe("API: /api/transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/transactions", () => {
    it("throws 401 if unauthorized", async () => {
      const event = createMockEvent(null);
      await expect(GET(event)).rejects.toMatchObject({ status: 401 });
    });

    it("returns 200 with list of transactions", async () => {
      const event = createMockEvent();
      vi.mocked(queries.listTransactions).mockResolvedValue([]);

      const res = await GET(event);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
      expect(queries.listTransactions).toHaveBeenCalledWith(1, {});
    });

    it("parses query parameters and passes them", async () => {
      const url = new URL("http://localhost?category=Food&month=2023-01");
      const event = createMockEvent(undefined, {}, url);
      vi.mocked(queries.listTransactions).mockResolvedValue([]);

      const res = await GET(event);
      expect(res.status).toBe(200);
      expect(queries.listTransactions).toHaveBeenCalledWith(1, {
        category: "Food",
        month: "2023-01"
      });
    });

    it("returns 400 for invalid query parameters", async () => {
      const url = new URL("http://localhost?month=invalid");
      const event = createMockEvent(undefined, {}, url);
      const res = await GET(event);
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/transactions", () => {
    it("creates a transaction and records audit", async () => {
      const body = {
        type: "expense",
        category: "Food",
        amount: 10,
        occurredOn: "2023-01-01",
        note: "Lunch"
      };
      const event = createMockEvent(undefined, {}, undefined, body);

      const mockTx = { id: 100, createdAt: new Date(), ...body };
      vi.mocked(queries.createTransaction).mockResolvedValue(mockTx as any);

      const res = await POST(event);
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ ...mockTx, createdAt: mockTx.createdAt.toISOString() });
      expect(queries.createTransaction).toHaveBeenCalledWith(1, body);
      expect(audit.recordAudit).toHaveBeenCalled();
    });

    it("returns 400 for invalid body", async () => {
      const event = createMockEvent(undefined, {}, undefined, { type: "invalid" });
      const res = await POST(event);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/transactions/[id]", () => {
    it("returns 404 if not found", async () => {
      const event = createMockEvent(undefined, { id: "999" });
      vi.mocked(queries.getTransaction).mockResolvedValue(null);
      const res = await GET_ID(event);
      expect(res.status).toBe(404);
    });

    it("returns 200 with the transaction", async () => {
      const event = createMockEvent(undefined, { id: "1" });
      const mockTx = { id: 1, type: "expense", createdAt: new Date() };
      vi.mocked(queries.getTransaction).mockResolvedValue(mockTx as any);
      const res = await GET_ID(event);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ...mockTx, createdAt: mockTx.createdAt.toISOString() });
    });
  });

  describe("PATCH /api/transactions/[id]", () => {
    it("updates the transaction and records audit", async () => {
      const event = createMockEvent(undefined, { id: "1" }, undefined, { amount: 20 });
      const existing = {
        id: 1,
        amount: 10,
        type: "expense",
        category: "Food",
        occurredOn: "2023-01-01",
        note: "",
        createdAt: new Date()
      };
      const updated = { ...existing, amount: 20 };

      vi.mocked(queries.getTransaction).mockResolvedValue(existing as any);
      vi.mocked(queries.updateTransaction).mockResolvedValue(updated as any);

      const res = await PATCH(event);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ...updated, createdAt: updated.createdAt.toISOString() });
      expect(queries.updateTransaction).toHaveBeenCalledWith(
        1,
        1,
        expect.objectContaining({ amount: 20 })
      );
      expect(audit.recordAudit).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/transactions/[id]", () => {
    it("deletes the transaction and records audit", async () => {
      const event = createMockEvent(undefined, { id: "1" });
      vi.mocked(queries.deleteTransaction).mockResolvedValue(1);

      const res = await DELETE(event);
      expect(res.status).toBe(204);
      expect(queries.deleteTransaction).toHaveBeenCalledWith(1, 1);
      expect(audit.recordAudit).toHaveBeenCalled();
    });
  });
});
