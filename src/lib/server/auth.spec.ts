import type { Cookies } from "@sveltejs/kit";
import { describe, expect, it, vi } from "vitest";

import { parseSessionCookie, setSessionCookie } from "./auth";

vi.mock("$app/environment", () => ({ dev: true }));
vi.mock("$env/dynamic/private", () => ({ env: { SESSION_SECRET: "test-secret-value" } }));

function fakeCookies() {
  let stored: string | undefined;
  const cookies = {
    set: (_name: string, value: string) => {
      stored = value;
    },
    delete: () => {
      stored = undefined;
    },
    get: () => stored
  } as unknown as Cookies;
  return { cookies, read: () => stored };
}

describe("session cookie sign + verify", () => {
  it("round-trips a userId", () => {
    const { cookies, read } = fakeCookies();
    setSessionCookie(cookies, 42);
    expect(parseSessionCookie(read())).toBe(42);
  });

  it("rejects a tampered signature", () => {
    const { cookies, read } = fakeCookies();
    setSessionCookie(cookies, 7);
    expect(parseSessionCookie(`${read()}x`)).toBeNull();
  });

  it("rejects malformed or missing values", () => {
    expect(parseSessionCookie(undefined)).toBeNull();
    expect(parseSessionCookie("999.deadbeef")).toBeNull();
    expect(parseSessionCookie("notanumber")).toBeNull();
  });
});
