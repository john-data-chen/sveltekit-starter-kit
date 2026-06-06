import type { SessionUser } from "$lib/server/auth";
import { describe, expect, it } from "vitest";

import { apiError, apiJson, requireApiUser } from "./api";

describe("requireApiUser", () => {
  it("returns the user if present in locals", () => {
    const user: SessionUser = { id: 1, name: "Test User", avatar: "", role: "member" };
    const locals = { user } as App.Locals;
    expect(requireApiUser(locals)).toEqual(user);
  });

  it("throws a 401 error if user is missing", () => {
    const locals = { user: null } as unknown as App.Locals;
    expect(() => requireApiUser(locals)).toThrowError();
  });
});

describe("apiJson", () => {
  it("wraps data in a JSON response", async () => {
    const response = apiJson({ success: true });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ success: true });
  });
});

describe("apiError", () => {
  it("creates a JSON response with status and error message", async () => {
    const response = apiError(400, "Bad Request");
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ message: "Bad Request" });
  });
});
