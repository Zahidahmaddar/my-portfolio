import { expect, Page, test } from "@playwright/test";

const mockReply = (page: Page, body: string) =>
  page.route("**/api/chatbot", (route) =>
    route.fulfill({ contentType: "text/plain; charset=utf-8", body }),
  );

const openChat = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask about Zahid" }).click();
  await expect(page.getByLabel("Your question")).toBeFocused();
};

test.describe("chat widget", () => {
  test("asks, shows the reply and sends earlier messages as history", async ({ page }) => {
    await mockReply(page, "He built **Trail Finder**.");
    await openChat(page);

    const log = page.getByRole("log");
    await page.getByRole("button", { name: "What has Zahid built?" }).click();
    await expect(log.getByText("What has Zahid built?")).toBeVisible();
    // Markdown is rendered, not shown as raw asterisks
    await expect(log.locator("strong", { hasText: "Trail Finder" })).toBeVisible();

    const request = page.waitForRequest("**/api/chatbot");
    await page.getByLabel("Your question").fill("And what else?");
    await page.keyboard.press("Enter");
    const body = (await request).postDataJSON();
    expect(body.message).toBe("And what else?");
    expect(body.conversationHistory.map((m: { role: string }) => m.role)).toEqual(["user", "assistant"]);
    await expect(page.getByLabel("Your question")).toHaveValue("");
  });

  test("a reply can't inject markup or unsafe links", async ({ page }) => {
    await mockReply(page, '<img src=x onerror="window.__xss=1"> [click](javascript:alert(1)) [ok](https://example.test)');
    await openChat(page);
    await page.getByLabel("Your question").fill("hi");
    await page.keyboard.press("Enter");

    const log = page.getByRole("log");
    await expect(log.getByRole("link", { name: "ok" })).toHaveAttribute("href", "https://example.test");
    await expect(log.locator("img")).toHaveCount(0);
    await expect(log.locator('a[href^="javascript"]')).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
  });

  test("failures explain themselves and can be retried", async ({ page }) => {
    await page.route("**/api/chatbot", (route) =>
      route.fulfill({ status: 503, json: { success: false, error: "The assistant is unavailable right now." } }),
    );
    await openChat(page);
    await page.getByLabel("Your question").fill("hello");
    await page.keyboard.press("Enter");
    await expect(page.getByText("The assistant is unavailable right now.")).toBeVisible();

    await page.unroute("**/api/chatbot");
    await mockReply(page, "Back again.");
    const request = page.waitForRequest("**/api/chatbot");
    await page.getByRole("button", { name: "Ask again" }).click();
    const body = (await request).postDataJSON();
    expect(body.message).toBe("hello");
    // The error reply isn't sent back to the model as history
    expect(body.conversationHistory).toEqual([]);
    await expect(page.getByText("Back again.")).toBeVisible();
    await expect(page.getByText("The assistant is unavailable right now.")).toHaveCount(0);
  });

  test("keeps the conversation across a reload, and can start over", async ({ page }) => {
    await mockReply(page, "Remembered reply.");
    await openChat(page);
    await page.getByLabel("Your question").fill("remember me");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Remembered reply.")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Ask about Zahid" }).click();
    await expect(page.getByText("Remembered reply.")).toBeVisible();

    await page.getByRole("button", { name: "Start a new conversation" }).click();
    await expect(page.getByText("Remembered reply.")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "What has Zahid built?" })).toBeVisible();
  });

  test("Escape closes it and returns focus to the launcher", async ({ page }) => {
    await openChat(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Ask about Zahid" })).toBeFocused();
  });

  test("fits a small phone screen", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await openChat(page);
    const box = await page.getByRole("dialog").boundingBox();
    expect(box?.width).toBeCloseTo(320, 1);
    expect(box?.height).toBeCloseTo(568, 1);
    await expect(page.getByRole("button", { name: "Close chat" })).toBeInViewport();
    await expect(page.getByLabel("Your question")).toBeInViewport();
  });

  test("isn't shown in the admin area", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ask about Zahid" })).toHaveCount(0);
  });
});

test.describe("chat API", () => {
  test("rejects empty and oversized questions", async ({ request }) => {
    const empty = await request.post("/api/chatbot", { data: { message: "   " } });
    expect(empty.status()).toBe(400);

    const long = await request.post("/api/chatbot", { data: { message: "x".repeat(1001) } });
    expect(long.status()).toBe(400);
  });

  test("handles a missing history and hides internal errors", async ({ request }) => {
    // This run has no API key, so it fails the way a real outage would
    const response = await request.post("/api/chatbot", { data: { message: "hi" } });
    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.error).toMatch(/contact form/);
    expect(JSON.stringify(body)).not.toMatch(/NVIDIA|API key|status code/i);
  });

  test("handles a malformed body", async ({ request }) => {
    const response = await request.post("/api/chatbot", {
      headers: { "content-type": "application/json" },
      data: "{not json",
    });
    expect(response.status()).toBe(400);
  });

  test("slows down a flood of questions", async ({ request }) => {
    const headers = { "x-forwarded-for": "10.0.0.77" };
    const statuses: number[] = [];
    for (let i = 0; i < 22; i++) {
      const response = await request.post("/api/chatbot", { headers, data: { message: "hi" } });
      statuses.push(response.status());
    }
    expect(statuses.at(-1)).toBe(429);
  });
});
