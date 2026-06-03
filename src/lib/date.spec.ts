import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { currentMonth, isValidDate, isValidMonth, today } from "./date";

describe("date helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // System time: 2026-06-03 10:40:35
    vi.setSystemTime(new Date("2026-06-03T10:40:35Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("validates months correctly", () => {
    expect(isValidMonth("2026-06")).toBe(true);
    expect(isValidMonth("1999-12")).toBe(true);
    expect(isValidMonth("2026-6")).toBe(false);
    expect(isValidMonth("2026-06-03")).toBe(false);
    expect(isValidMonth("invalid")).toBe(false);
  });

  it("validates dates correctly", () => {
    expect(isValidDate("2026-06-03")).toBe(true);
    expect(isValidDate("1999-12-31")).toBe(true);
    expect(isValidDate("2026-06")).toBe(false);
    expect(isValidDate("2026-6-3")).toBe(false);
    expect(isValidDate("invalid")).toBe(false);
  });

  it("returns current month correctly", () => {
    expect(currentMonth()).toBe("2026-06");
  });

  it("returns today's date correctly", () => {
    expect(today()).toBe("2026-06-03");
  });
});
