import { describe, it, expect } from "vitest";

import { readSort, writeSort } from "./sort";

describe("sort helpers", () => {
  describe("readSort", () => {
    it("returns empty array when no sort is in URL", () => {
      const params = new URLSearchParams();
      expect(readSort(params)).toEqual([]);
    });

    it("reads ascending sort from URL", () => {
      const params = new URLSearchParams("sortBy=name");
      expect(readSort(params)).toEqual([{ id: "name", desc: false }]);
    });

    it("reads descending sort from URL", () => {
      const params = new URLSearchParams("sortBy=date&sortDesc=true");
      expect(readSort(params)).toEqual([{ id: "date", desc: true }]);
    });

    it("reads prefixed sort from URL", () => {
      const params = new URLSearchParams("u.sortBy=role&u.sortDesc=true&sortBy=other");
      expect(readSort(params, "u.")).toEqual([{ id: "role", desc: true }]);
    });
  });

  describe("writeSort", () => {
    it("removes sort params when sorting is empty", () => {
      const params = new URLSearchParams("sortBy=name&other=1");
      const newParams = writeSort(params, []);
      expect(newParams.toString()).toBe("other=1");
    });

    it("writes ascending sort to URL", () => {
      const params = new URLSearchParams("other=1");
      const newParams = writeSort(params, [{ id: "name", desc: false }]);
      expect(newParams.toString()).toBe("other=1&sortBy=name");
    });

    it("writes descending sort to URL", () => {
      const params = new URLSearchParams("other=1");
      const newParams = writeSort(params, [{ id: "date", desc: true }]);
      expect(newParams.toString()).toBe("other=1&sortBy=date&sortDesc=true");
    });

    it("writes prefixed sort to URL without affecting other params", () => {
      const params = new URLSearchParams("sortBy=other&other=1");
      const newParams = writeSort(params, [{ id: "role", desc: true }], "u.");
      expect(newParams.get("sortBy")).toBe("other");
      expect(newParams.get("u.sortBy")).toBe("role");
      expect(newParams.get("u.sortDesc")).toBe("true");
      expect(newParams.get("other")).toBe("1");
    });
  });
});
