import { describe, expect, it } from "vitest";

import { GET } from "./+server";

describe("API: /api/openapi.json", () => {
  it("returns a valid OpenAPI document without auth", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const doc = await res.json();
    expect(doc.openapi).toBe("3.1.0");
    expect(doc.paths).toHaveProperty("/api/transactions");
    expect(doc.paths).toHaveProperty("/api/transactions/{id}");
    expect(doc.paths).toHaveProperty("/api/stats");
  });

  it("returns memoized document on subsequent calls", async () => {
    const res1 = await GET();
    const doc1 = await res1.json();

    const res2 = await GET();
    const doc2 = await res2.json();

    expect(doc1).toEqual(doc2);
  });
});
