import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ADMIN } from "./fixtures.mjs";

// A token signed with the wrong secret, and one claiming no signature at all
const b64 = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
const claims = { userId: "1", email: ADMIN.email, role: "admin" };
const FORGED_TOKENS = {
  garbage: "fake",
  "unsigned (alg none)": `${b64({ alg: "none", typ: "JWT" })}.${b64(claims)}.`,
  "wrong signature": `${b64({ alg: "HS256", typ: "JWT" })}.${b64(claims)}.AAAA`,
};

const ADMIN_ROUTES: [string, string][] = [
  ["GET", "/api/contact"],
  ["PUT", "/api/contact"],
  ["DELETE", "/api/contact?id=000000000000000000000000"],
  ["GET", "/api/chatbot-knowledge"],
  ["POST", "/api/chatbot-knowledge"],
  ["PUT", "/api/chatbot-knowledge"],
  ["DELETE", "/api/chatbot-knowledge?id=x"],
  ["GET", "/api/chatbot/status"],
  ["POST", "/api/projects"],
  ["PUT", "/api/projects"],
  ["DELETE", "/api/projects?id=x"],
  ["POST", "/api/skills"],
  ["PUT", "/api/skills"],
  ["DELETE", "/api/skills?id=x"],
  ["PUT", "/api/site-settings"],
  ["POST", "/api/upload"],
];

for (const [method, url] of ADMIN_ROUTES) {
  test(`${method} ${url} needs a real session`, async ({ request }) => {
    const anonymous = await request.fetch(url, { method, data: {} });
    expect(anonymous.status()).toBe(401);

    for (const [kind, token] of Object.entries(FORGED_TOKENS)) {
      const viaCookie = await request.fetch(url, {
        method,
        data: {},
        headers: { cookie: `auth-token=${token}` },
      });
      expect(viaCookie.status(), `${kind} cookie`).toBe(401);

      const viaHeader = await request.fetch(url, {
        method,
        data: {},
        headers: { authorization: `Bearer ${token}` },
      });
      expect(viaHeader.status(), `${kind} bearer`).toBe(401);
    }
  });
}

test("the old open email test endpoint is gone", async ({ request }) => {
  expect((await request.get("/api/test-email")).status()).toBe(404);
});

test("public settings don't expose the chatbot model", async ({ request }) => {
  const body = await (await request.get("/api/site-settings")).json();
  expect(body.success).toBe(true);
  expect(body.data.aiModel).toBeUndefined();
});

test("login rejects non-string credentials", async ({ request }) => {
  const response = await request.post("/api/auth", {
    headers: { "x-forwarded-for": "10.0.0.70" },
    data: { email: { $gt: "" }, password: { $gt: "" } },
  });
  expect(response.status()).toBe(400);
});

test("login locks out after repeated failures, then a success resets it elsewhere", async ({ request }) => {
  const headers = { "x-forwarded-for": "10.0.0.71" };
  const statuses: number[] = [];
  for (let i = 0; i < 11; i++) {
    const response = await request.post("/api/auth", {
      headers,
      data: { email: ADMIN.email, password: "wrong" },
    });
    statuses.push(response.status());
  }
  expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
  expect(statuses[10]).toBe(429);

  const locked = await request.post("/api/auth", {
    headers,
    data: { email: ADMIN.email, password: ADMIN.password },
  });
  expect(locked.status()).toBe(429);

  const other = await request.post("/api/auth", {
    headers: { "x-forwarded-for": "10.0.0.72" },
    data: { email: ADMIN.email, password: ADMIN.password },
  });
  expect(other.status()).toBe(200);
  const cookie = other.headers()["set-cookie"];
  expect(cookie).toMatch(/HttpOnly/i);
  expect(cookie).toMatch(/SameSite=strict/i);
});

test("responses carry the security headers", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});

test.describe("as the admin", () => {
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": "10.0.0.80" });
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(ADMIN.email);
    await page.getByLabel("Password", { exact: true }).fill(ADMIN.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test("the honeypot message was never stored", async ({ page }) => {
    await page.goto("/admin/dashboard#messages");
    await expect(page.getByText("Seed Visitor")).toBeVisible();
    await expect(page.getByText("Bot Honeypot")).toHaveCount(0);
  });

  test("hostile message text displays as plain text", async ({ page }) => {
    await page.evaluate(() =>
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "XSS Tester",
          email: "xss@example.test",
          subject: "<b>bold</b>",
          message: '<img src=x onerror="window.__xss=1">',
        }),
      }),
    );
    // A reload, because a hash-only goto wouldn't fetch the new message
    await page.goto("/admin/dashboard#messages");
    await page.reload();
    await expect(page.getByText('<img src=x onerror="window.__xss=1">')).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
  });

  test("uploads refuse anything but images and PDFs", async ({ page }) => {
    const status = await page.evaluate(async () => {
      const form = new FormData();
      form.append("file", new File(["x"], "evil.html", { type: "text/html" }));
      return (await fetch("/api/upload", { method: "POST", body: form })).status;
    });
    expect(status).toBe(400);
  });

  for (const tab of ["overview", "projects", "skills", "messages", "chatbot", "settings"]) {
    test(`no accessibility violations on the ${tab} tab`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/admin/dashboard#${tab}`);
      await expect(page.getByRole("status").filter({ hasText: "Loading" })).toHaveCount(0);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
    });
  }
});
