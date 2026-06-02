import { expect, test } from "@playwright/test";

// Happy path: sign in as the built-in John account, add an expense, then delete it.
// The row is tagged with a unique note so the test deletes exactly what it created
// and never touches the seeded demo data.
test("John signs in, adds an expense, then deletes it", async ({ page }) => {
  // The Delete button triggers a native confirm() — auto-accept it.
  page.on("dialog", (dialog) => dialog.accept());

  // 1. Sign in (email is pre-filled with john@example.com).
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue With Email" }).click();
  await expect(page).toHaveURL("/");

  // 2. Add a new expense tagged with a unique note.
  const note = `e2e-${Date.now()}`;
  await page.goto("/transactions/new");
  await page.locator('select[name="category"]').selectOption("Food");
  await page.locator('input[name="amount"]').fill("999");
  await page.locator('input[name="note"]').fill(note);
  await page.getByRole("button", { name: "Add transaction" }).click();
  await expect(page).toHaveURL("/transactions");

  // 3. The new row is listed.
  const row = page.locator("li", { hasText: note });
  await expect(row).toBeVisible();

  // 4. Delete it, then confirm it is gone.
  await row.getByRole("button", { name: "Delete" }).click();
  await expect(page.locator("li", { hasText: note })).toHaveCount(0);
});
