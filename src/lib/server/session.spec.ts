import type { Cookies } from "@sveltejs/kit";
import { afterEach, describe, expect, it, vi } from "vitest";

import { setSessionCookie } from "./auth";

vi.mock("$app/environment", () => ({ dev: true }));
vi.mock("$env/dynamic/private", () => ({ env: { SESSION_SECRET: "test-secret-value" } }));

function createDb(rows: Array<{ id: number; name: string; avatar: string }>) {
  return {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => rows)
        }))
      }))
    }))
  };
}

function createSessionCookie(userId: number): string {
  let value = "";
  const cookies = {
    set: (_name: string, cookieValue: string) => {
      value = cookieValue;
    }
  } as unknown as Cookies;

  setSessionCookie(cookies, userId);
  return value;
}

async function loadSubjectWithDb(dbFactory: () => Record<string, unknown>) {
  vi.resetModules();
  vi.doMock("$lib/server/db", dbFactory);
  return import("./session");
}

afterEach(() => {
  vi.doUnmock("$lib/server/db");
  vi.restoreAllMocks();
});

describe("resolveSessionUser", () => {
  it("returns null when the session cookie is missing", async () => {
    const { resolveSessionUser } = await loadSubjectWithDb(() => ({
      db: createDb([{ id: 1, name: "John", avatar: "J" }])
    }));

    await expect(resolveSessionUser(undefined)).resolves.toBeNull();
  });

  it("returns the session user when the cookie and lookup are valid", async () => {
    const cookie = createSessionCookie(1);
    const { resolveSessionUser } = await loadSubjectWithDb(() => ({
      db: createDb([{ id: 1, name: "John", avatar: "J" }])
    }));

    await expect(resolveSessionUser(cookie)).resolves.toEqual({
      id: 1,
      name: "John",
      avatar: "J"
    });
  });

  it("returns null when the session user lookup fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const cookie = createSessionCookie(1);
    const db = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(async () => {
              throw new Error("database offline");
            })
          }))
        }))
      }))
    };
    const { resolveSessionUser } = await loadSubjectWithDb(() => ({ db }));

    await expect(resolveSessionUser(cookie)).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("[session] user lookup failed", expect.any(Error));
  });
});
