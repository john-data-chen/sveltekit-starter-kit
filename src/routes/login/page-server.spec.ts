import { findLoginUserByEmail, logLoginInfrastructureError } from "$lib/server/login";
import type { Cookies } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { actions, load } from "./+page.server";

vi.mock("$app/environment", () => ({ dev: true }));
vi.mock("$env/dynamic/private", () => ({ env: { SESSION_SECRET: "test-secret-value" } }));
vi.mock("$lib/server/login", () => ({
  findLoginUserByEmail: vi.fn(),
  logLoginInfrastructureError: vi.fn()
}));

type LoginAction = NonNullable<typeof actions.default>;

function createCookies({ throwOnSet = false }: { throwOnSet?: boolean } = {}) {
  let stored = "";
  const cookies = {
    set: vi.fn((_name: string, value: string) => {
      if (throwOnSet) {
        throw new Error("cookie write failed");
      }
      stored = value;
    }),
    get: vi.fn(() => stored),
    delete: vi.fn(() => {
      stored = "";
    })
  } as unknown as Cookies;

  return { cookies, read: () => stored };
}

async function submitLogin(email: string | undefined, cookies: Cookies = createCookies().cookies) {
  const form = new FormData();
  if (email !== undefined) {
    form.set("email", email);
  }

  const request = new Request("http://localhost/login", {
    method: "POST",
    body: form
  });

  return (actions.default as LoginAction)({ request, cookies } as Parameters<LoginAction>[0]);
}

beforeEach(() => {
  vi.mocked(findLoginUserByEmail).mockReset();
  vi.mocked(logLoginInfrastructureError).mockReset();
});

describe("login action", () => {
  it("returns a form failure when email is missing", async () => {
    const result = await submitLogin("   ");

    expect(result).toMatchObject({
      status: 400,
      data: { email: "", message: expect.any(String) }
    });

    const resultUndefined = await submitLogin(undefined);

    expect(resultUndefined).toMatchObject({
      status: 400,
      data: { email: "", message: expect.any(String) }
    });

    expect(findLoginUserByEmail).not.toHaveBeenCalled();
  });

  it("returns a form failure when no account exists", async () => {
    vi.mocked(findLoginUserByEmail).mockResolvedValue({ type: "not_found" });

    const result = await submitLogin("missing@example.com");

    expect(result).toMatchObject({
      status: 400,
      data: { email: "missing@example.com", message: expect.any(String) }
    });
  });

  it("returns a service failure when login lookup is unavailable", async () => {
    vi.mocked(findLoginUserByEmail).mockResolvedValue({ type: "service_unavailable" });

    const result = await submitLogin("john@example.com");

    expect(result).toMatchObject({
      status: 503,
      data: { email: "john@example.com", message: expect.any(String) }
    });
  });

  it("sets a signed session cookie and redirects when login succeeds", async () => {
    const { cookies, read } = createCookies();
    vi.mocked(findLoginUserByEmail).mockResolvedValue({ type: "found", userId: 42 });

    await expect(submitLogin("JOHN@example.com", cookies)).rejects.toMatchObject({
      status: 303,
      location: "/"
    });
    expect(read()).toMatch(/^42\./);
  });

  it("returns a service failure when session cookie setup fails", async () => {
    const { cookies } = createCookies({ throwOnSet: true });
    vi.mocked(findLoginUserByEmail).mockResolvedValue({ type: "found", userId: 42 });

    const result = await submitLogin("john@example.com", cookies);

    expect(result).toMatchObject({
      status: 503,
      data: { email: "john@example.com", message: expect.any(String) }
    });
    expect(logLoginInfrastructureError).toHaveBeenCalledWith(
      "session cookie setup failed",
      expect.any(Error)
    );
  });
});

describe("login load", () => {
  it("returns the default email", () => {
    const result = load({} as any);
    expect(result).toEqual({ defaultEmail: "john@example.com" });
  });
});
