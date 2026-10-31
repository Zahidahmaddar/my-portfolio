import { defineConfig, devices } from "@playwright/test";

export const E2E_PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  // The tests share one database, so they run in file order, one at a time
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${E2E_PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Builds the app and runs it against a throwaway in-memory database.
    // It never connects to the database in .env, and no real email is sent.
    command: "node e2e/server.mjs",
    url: `http://localhost:${E2E_PORT}/robots.txt`,
    timeout: 300_000,
    reuseExistingServer: false,
    stdout: "pipe",
    stderr: "pipe",
  },
});
