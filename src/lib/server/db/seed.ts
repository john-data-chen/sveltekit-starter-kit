import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { type NewTransaction, transactions, users } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client);

async function seed() {
  // Idempotent: wipe and reset identities so re-runs produce stable ids 1, 2, 3.
  await db.execute(sql`TRUNCATE TABLE "transactions", "users" RESTART IDENTITY CASCADE`);

  const [john, sophia, mark] = await db
    .insert(users)
    .values([
      { name: "John", email: "john@example.com", avatar: "🦊" },
      { name: "Sophia", email: "sophia@example.com", avatar: "🐼" },
      { name: "Mark", email: "mark@example.com", avatar: "🐨" }
    ])
    .returning();

  const rows: NewTransaction[] = [
    // John — current month (2026-06)
    {
      userId: john.id,
      type: "income",
      category: "Salary",
      amount: 60000,
      occurredOn: "2026-06-01",
      note: "June salary"
    },
    {
      userId: john.id,
      type: "income",
      category: "Bonus",
      amount: 8000,
      occurredOn: "2026-06-15",
      note: "Project bonus"
    },
    {
      userId: john.id,
      type: "expense",
      category: "Housing",
      amount: 15000,
      occurredOn: "2026-06-05",
      note: "Rent"
    },
    {
      userId: john.id,
      type: "expense",
      category: "Transport",
      amount: 1280,
      occurredOn: "2026-06-01",
      note: "Metro pass"
    },
    {
      userId: john.id,
      type: "expense",
      category: "Food",
      amount: 320,
      occurredOn: "2026-06-02",
      note: null
    },
    {
      userId: john.id,
      type: "expense",
      category: "Food",
      amount: 150,
      occurredOn: "2026-06-03",
      note: null
    },
    {
      userId: john.id,
      type: "expense",
      category: "Shopping",
      amount: 2400,
      occurredOn: "2026-06-10",
      note: "Clothes"
    },
    {
      userId: john.id,
      type: "expense",
      category: "Entertainment",
      amount: 600,
      occurredOn: "2026-06-08",
      note: "Movie"
    },
    {
      userId: john.id,
      type: "expense",
      category: "Medical",
      amount: 800,
      occurredOn: "2026-06-12",
      note: "Doctor visit"
    },
    // John — previous month (2026-05), so the month filter shows a difference
    {
      userId: john.id,
      type: "income",
      category: "Salary",
      amount: 60000,
      occurredOn: "2026-05-01",
      note: "May salary"
    },
    {
      userId: john.id,
      type: "expense",
      category: "Food",
      amount: 500,
      occurredOn: "2026-05-20",
      note: null
    },

    // Sophia — current month (2026-06)
    {
      userId: sophia.id,
      type: "income",
      category: "Salary",
      amount: 45000,
      occurredOn: "2026-06-01",
      note: null
    },
    {
      userId: sophia.id,
      type: "expense",
      category: "Food",
      amount: 250,
      occurredOn: "2026-06-02",
      note: null
    },
    {
      userId: sophia.id,
      type: "expense",
      category: "Transport",
      amount: 60,
      occurredOn: "2026-06-02",
      note: "Bus"
    },
    {
      userId: sophia.id,
      type: "expense",
      category: "Entertainment",
      amount: 1200,
      occurredOn: "2026-06-09",
      note: "Concert"
    },

    // Mark — current month (2026-06)
    {
      userId: mark.id,
      type: "income",
      category: "Salary",
      amount: 52000,
      occurredOn: "2026-06-01",
      note: null
    },
    {
      userId: mark.id,
      type: "income",
      category: "Investment",
      amount: 3000,
      occurredOn: "2026-06-20",
      note: "Dividend"
    },
    {
      userId: mark.id,
      type: "expense",
      category: "Food",
      amount: 480,
      occurredOn: "2026-06-04",
      note: null
    }
  ];

  await db.insert(transactions).values(rows);

  console.log(`Seeded 3 users and ${rows.length} transactions.`);
}

seed()
  .then(() => client.end())
  .catch(async (error) => {
    console.error(error);
    await client.end();
    process.exit(1);
  });
