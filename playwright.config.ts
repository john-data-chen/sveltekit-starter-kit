import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:5173"
  },
  // Headroom for the first-hit Vite dev compilation of a route (cold `goto`/redirect can
  // exceed the 5s default before the URL settles).
  expect: { timeout: 15_000 },
  // Cross-browser happy-path coverage. `edge` uses the installed Microsoft Edge app
  // (channel "msedge") and therefore runs locally only — e2e is intentionally kept out of CI.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "edge", use: { ...devices["Desktop Edge"], channel: "msedge" } }
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
