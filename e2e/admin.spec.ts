import { expect, Page, test } from "@playwright/test";
import { ADMIN, SEED_MESSAGE } from "./fixtures.mjs";

const signIn = async (page: Page) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN.email);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
};

const openTab = (page: Page, name: string) =>
  page.getByRole("navigation", { name: "Admin" }).getByRole("button", { name }).click();

const expectToast = (page: Page, text: string | RegExp) =>
  expect(page.locator('[aria-live="polite"]').getByText(text).first()).toBeVisible();

test.describe("sign in", () => {
  test("a wrong password shows a clear error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(ADMIN.email);
    await page.getByLabel("Password", { exact: true }).fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "match" })).toHaveText("That email and password don't match.");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("signed-out visitors can't reach the dashboard", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin/dashboard#messages");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("signing out ends the session", async ({ page }) => {
    await signIn(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("the current tab survives a reload", async ({ page }) => {
    await openTab(page, "Skills");
    await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
  });

  test("overview counts match the data, and the add buttons open their forms", async ({ page }) => {
    const stat = page.getByRole("button", { name: /Awaiting a reply/ }).first();
    await expect(stat).toContainText("1");

    await page.getByRole("button", { name: "Add a skill" }).click();
    await expect(page.getByLabel("Name")).toBeFocused();

    await openTab(page, "Overview");
    await page.getByRole("button", { name: "Add a project" }).click();
    await expect(page.getByLabel("Title")).toBeFocused();
  });

  test("projects: add, show on the site, edit and delete", async ({ page, context }) => {
    await openTab(page, "Projects");
    await page.getByRole("button", { name: "Add a project" }).click();

    await page.getByLabel("Title").fill("E2E Project");
    await page.getByLabel("Description").fill("Created by a test.");
    await page.getByLabel("Technologies").fill("Svelte, Go");
    await page.getByLabel("Source code (optional)").fill("https://github.com/example/e2e");

    // The image is required, and the browser should say so before any request
    await page.getByRole("button", { name: "Add project" }).click();
    await expect(page.getByLabel("Title")).toHaveValue("E2E Project");
    await expect(page.getByLabel("Image", { exact: true })).toBeFocused();

    await page.getByLabel("Image", { exact: true }).fill("/uploads/1776582409531-2hsiq0.webp");
    await page.getByRole("button", { name: "Add project" }).click();
    await expectToast(page, "Project added.");

    // The form starts empty next time, instead of holding the last project
    await page.getByRole("button", { name: "Add a project" }).click();
    await expect(page.getByLabel("Title")).toHaveValue("");
    await page.getByRole("button", { name: "Cancel" }).click();

    // Visible to visitors right away, with no redeploy
    const visitor = await context.newPage();
    await visitor.goto("/");
    await expect(visitor.getByRole("heading", { name: "E2E Project" })).toBeVisible();
    await expect(visitor.getByRole("link", { name: "View the code" }).first()).toBeVisible();
    await visitor.close();

    await page.getByRole("button", { name: "Edit E2E Project" }).click();
    await expect(page.getByLabel("Technologies")).toHaveValue("Svelte, Go");
    await page.getByLabel("Title").fill("E2E Project Renamed");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expectToast(page, "Project updated.");
    await expect(page.getByRole("heading", { name: "E2E Project Renamed" })).toBeVisible();

    // Cancelling the confirmation keeps the project
    await page.getByRole("button", { name: "Delete E2E Project Renamed" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "E2E Project Renamed" })).toBeVisible();

    await page.getByRole("button", { name: "Delete E2E Project Renamed" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete project" }).click();
    await expectToast(page, "Project deleted.");
    await expect(page.getByRole("heading", { name: "E2E Project Renamed" })).toHaveCount(0);
  });

  test("project actions work without hovering", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/admin/dashboard#projects");
    await expect(page.getByRole("button", { name: "Edit Trail Finder" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete Trail Finder" })).toBeVisible();
  });

  test("typing a half-finished image link doesn't crash the page", async ({ page }) => {
    await openTab(page, "Projects");
    await page.getByRole("button", { name: "Add a project" }).click();
    await page.getByLabel("Image", { exact: true }).fill("not-a-url");
    await expect(page.getByText("This image can't be loaded.")).toBeVisible();
    await expect(page.getByLabel("Title")).toBeVisible();
  });

  test("uploads fill in the image, and failures are explained", async ({ page }) => {
    await openTab(page, "Projects");
    await page.getByRole("button", { name: "Add a project" }).click();

    await page.route("**/api/upload", (route) =>
      route.fulfill({ json: { success: true, data: { url: "/uploads/1776582409531-2hsiq0.webp" } } }),
    );
    await page.getByLabel("Upload image").setInputFiles({
      name: "shot.png",
      mimeType: "image/png",
      buffer: Buffer.from([1, 2, 3]),
    });
    await expect(page.getByLabel("Image", { exact: true })).toHaveValue("/uploads/1776582409531-2hsiq0.webp");

    await page.unroute("**/api/upload");
    await page.route("**/api/upload", (route) =>
      route.fulfill({ status: 400, json: { success: false, error: "Upload an image or a PDF" } }),
    );
    await page.getByLabel("Upload image").setInputFiles({
      name: "shot.png",
      mimeType: "image/png",
      buffer: Buffer.from([1, 2, 3]),
    });
    await expectToast(page, "Upload failed. Upload an image or a PDF");
  });

  test("skills: add, edit, delete", async ({ page }) => {
    await openTab(page, "Skills");
    await page.getByRole("button", { name: "Add a skill" }).click();
    await page.getByLabel("Name").fill("E2E Skill");
    await page.getByRole("button", { name: "Add skill" }).click();
    await expectToast(page, "Skill added.");

    await page.getByRole("button", { name: "Edit E2E Skill" }).click();
    await page.getByLabel("Name").fill("E2E Skill Renamed");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expectToast(page, "Skill updated.");

    await page.getByRole("button", { name: "Delete E2E Skill Renamed" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete skill" }).click();
    await expectToast(page, "Skill deleted.");
    await expect(page.getByRole("heading", { name: "E2E Skill Renamed" })).toHaveCount(0);
  });

  test("messages: a failed email keeps the draft and isn't marked replied", async ({ page }) => {
    await openTab(page, "Messages");
    await expect(page.getByText(SEED_MESSAGE.subject)).toBeVisible();

    await page.route("**/api/contact", (route) => {
      if (route.request().method() !== "PUT") return route.continue();
      return route.fulfill({
        status: 502,
        json: { success: false, error: "The email could not be sent. Your reply was not delivered." },
      });
    });
    await page.getByRole("button", { name: "Reply by email" }).click();
    await page.getByLabel(/Your reply to/).fill("Draft reply");
    await page.getByRole("button", { name: "Send reply" }).click();
    await expectToast(page, /could not be sent/);
    await expect(page.getByLabel(/Your reply to/)).toHaveValue("Draft reply");
    await expect(page.getByText("Replied", { exact: true })).toHaveCount(0);
  });

  test("messages: replying and deleting", async ({ page, context }) => {
    // Comes in through the real public form, including the subject
    const visitor = await context.newPage();
    await visitor.setExtraHTTPHeaders({ "x-forwarded-for": "10.0.0.50" });
    await visitor.goto("/#contact");
    await visitor.getByLabel("Name").fill("Form Visitor");
    await visitor.getByLabel("Email").fill("form@example.test");
    await visitor.getByLabel("Subject (optional)").fill("Subject from the form");
    await visitor.getByLabel("Message").fill("Hello from the form");
    await visitor.getByRole("button", { name: "Send message" }).click();
    await expect(visitor.getByRole("status")).toHaveText(/Message sent/);
    await visitor.close();

    await page.reload();
    await openTab(page, "Messages");
    const card = page.getByRole("listitem").filter({ hasText: "Form Visitor" });
    await expect(card.getByText("Subject from the form")).toBeVisible();

    await card.getByRole("button", { name: "Reply by email" }).click();
    await card.getByLabel(/Your reply to/).fill("Thanks for writing!");
    await card.getByRole("button", { name: "Send reply" }).click();
    await expectToast(page, "Reply sent to form@example.test.");
    await expect(card.getByText("Replied", { exact: true })).toBeVisible();
    await expect(card.getByText("Thanks for writing!")).toBeVisible();

    const filters = page.getByRole("group", { name: "Filter messages" });
    await filters.getByRole("button", { name: "Awaiting a reply" }).click();
    await expect(page.getByRole("listitem").filter({ hasText: "Form Visitor" })).toHaveCount(0);
    await filters.getByRole("button", { name: "All", exact: true }).click();

    await page.getByRole("button", { name: "Delete the message from Form Visitor" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete message" }).click();
    await expectToast(page, "Message deleted.");
    await expect(page.getByRole("listitem").filter({ hasText: "Form Visitor" })).toHaveCount(0);
  });

  test("chatbot: notes can be added, edited and deleted", async ({ page }) => {
    await openTab(page, "Chatbot");
    await page.getByRole("button", { name: "Add a note" }).click();
    await page.getByLabel("Topic").fill("E2E note");
    await page.getByLabel("What the chatbot should know").fill("Note body");
    await page.getByRole("button", { name: "Add note" }).click();
    await expectToast(page, "Note added.");

    await page.getByRole("button", { name: "Edit note E2E note" }).click();
    await page.getByLabel("What the chatbot should know").fill("Edited body");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Edited body")).toBeVisible();

    await page.getByRole("button", { name: "Delete note E2E note" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete note" }).click();
    await expectToast(page, "Note deleted.");
  });

  test("chatbot: the check reports a missing key, and a retired model shows a way out", async ({ page }) => {
    await openTab(page, "Chatbot");
    await page.getByRole("button", { name: "Check chatbot" }).click();
    await expect(page.getByRole("status").filter({ hasText: "NVIDIA_API_KEY" })).toBeVisible();

    await page.route("**/api/chatbot/status", (route) =>
      route.fulfill({
        json: {
          success: true,
          data: { ok: true, configured: "meta/llama-3.1-8b-instruct", served: "openai/gpt-oss-20b" },
        },
      }),
    );
    await page.getByRole("button", { name: "Check chatbot" }).click();
    await page.getByRole("button", { name: "Use openai/gpt-oss-20b" }).click();
    await expectToast(page, "Model saved.");
    await expect(page.getByLabel("NVIDIA model name")).toHaveValue("openai/gpt-oss-20b");
  });

  test("settings: edits reach the site, and saving a model doesn't publish unsaved edits", async ({ page, context }) => {
    await openTab(page, "Settings");
    const jobTitle = page.getByLabel("Job title");
    const original = await jobTitle.inputValue();

    await jobTitle.fill("Unsaved title");
    await expect(page.getByText("You have unsaved changes")).toBeVisible();
    await page.evaluate(() =>
      fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiModel: "openai/gpt-oss-20b" }),
      }),
    );
    let visitor = await context.newPage();
    await visitor.goto("/");
    await expect(visitor.getByText(original, { exact: true })).toBeVisible();
    await visitor.close();

    await jobTitle.fill("Principal Trail Engineer");
    await page.getByRole("button", { name: "Add a paragraph" }).click();
    await page.getByLabel("Paragraph 1", { exact: true }).fill("A paragraph from the admin panel.");
    await page.getByRole("button", { name: "Add a number" }).click();
    await page.getByLabel("Number 1 value").fill("42");
    await page.getByLabel("Number 1 label").fill("Summits");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expectToast(page, /Settings saved/);
    await expect(page.getByRole("button", { name: "Save settings" })).toBeDisabled();

    visitor = await context.newPage();
    await visitor.goto("/");
    await expect(visitor.getByText("Principal Trail Engineer", { exact: true })).toBeVisible();
    await expect(visitor.getByText("A paragraph from the admin panel.")).toBeVisible();
    await expect(visitor.getByText("Summits")).toBeVisible();
    await visitor.close();

    // Put things back for the tests that follow
    await jobTitle.fill(original);
    await page.getByRole("button", { name: "Remove paragraph 1" }).click();
    await page.getByRole("button", { name: "Remove number 1" }).click();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expectToast(page, /Settings saved/);
  });

  test("an expired session goes back to sign in", async ({ page, context }) => {
    await context.clearCookies();
    await openTab(page, "Messages");
    await page.getByRole("button", { name: "Refresh" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.getByRole("button", { name: "Open menu" }).click();
    await openTab(page, "Settings");
    await expect(page.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
