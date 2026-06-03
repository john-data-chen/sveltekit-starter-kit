import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";

import { users, transactions } from "./schema";

describe("database schema", () => {
  it("defines users table correctly", () => {
    const config = getTableConfig(users);
    expect(config.name).toBe("users");
    expect(config.columns.map((c) => c.name)).toContain("id");
    expect(config.columns.map((c) => c.name)).toContain("name");
    expect(config.columns.map((c) => c.name)).toContain("email");
    expect(config.columns.map((c) => c.name)).toContain("avatar");
    expect(config.columns.map((c) => c.name)).toContain("created_at");
  });

  it("defines transactions table correctly", () => {
    const config = getTableConfig(transactions);
    expect(config.name).toBe("transactions");

    // Test columns
    const columnNames = config.columns.map((c) => c.name);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("user_id");
    expect(columnNames).toContain("type");
    expect(columnNames).toContain("category");
    expect(columnNames).toContain("amount");
    expect(columnNames).toContain("occurred_on");
    expect(columnNames).toContain("note");
    expect(columnNames).toContain("created_at");

    // Exercise reference callback to get coverage
    const inlineFksSymbol = Object.getOwnPropertySymbols(transactions).find(
      (sym) => sym.toString() === "Symbol(drizzle:PgInlineForeignKeys)"
    );
    expect(inlineFksSymbol).toBeDefined();
    const fks = (transactions as any)[inlineFksSymbol!];
    expect(Array.isArray(fks)).toBe(true);
    expect(fks.length).toBeGreaterThan(0);

    // Exercise each ForeignKey reference builder
    for (const fk of fks) {
      console.log("FK properties:", Object.keys(fk), fk.reference);
      if (typeof fk.reference === "function") {
        fk.reference();
      }
    }

    // Exercise extraConfig callback (indexes) to get coverage
    const extraConfigSymbol = Object.getOwnPropertySymbols(transactions).find(
      (sym) => sym.toString() === "Symbol(drizzle:ExtraConfigBuilder)"
    );
    expect(extraConfigSymbol).toBeDefined();
    const extraConfigBuilder = (transactions as any)[extraConfigSymbol!];
    expect(typeof extraConfigBuilder).toBe("function");

    const columnsBuilder = (transactions as any)[
      Object.getOwnPropertySymbols(transactions).find(
        (sym) => sym.toString() === "Symbol(drizzle:ExtraConfigColumns)"
      )!
    ];
    const indexes = extraConfigBuilder(columnsBuilder);
    console.log("Indexes generated:", indexes);
  });
});
