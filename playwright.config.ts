import { defineConfig, devices, type ReporterDescription } from "@playwright/test";

// E2E_BASE_URL points the suite at a deployed copy (e.g. staging); otherwise it builds and serves the app locally.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:4173";

// Results go to Testomat.io only when its project key is set (CI secret or a local export).
const reporters: ReporterDescription[] = [[process.env.CI ? "github" : "list"], ["html", { open: "never" }]];
if (process.env.TESTOMATIO) reporters.push(["@testomatio/reporter/playwright", { apiKey: process.env.TESTOMATIO }]);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: reporters,
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "pnpm build && pnpm preview",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
