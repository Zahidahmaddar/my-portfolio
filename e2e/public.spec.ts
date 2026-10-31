import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("public site", () => {
  test("project content is in the HTML, for search engines and link previews", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("Trail Finder");
    expect(html).toContain("Software Engineer (Frontend)");
    expect(html).toContain("application/ld+json");
  });

  test("loads with no console errors or broken requests", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(m.text());
    });
    page.on("pageerror", (e) => problems.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
    });

    await page.goto("/");
    await page.getByRole("heading", { name: "Skills" }).scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });

  test("the header leads to each section", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });

    for (const [name, id] of [["About", "about"], ["Contact", "contact"], ["Skills", "skills"]]) {
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    }
  });

  test("hero shows the settings from the admin panel, with a working resume link", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Zahid Farooq");
    await expect(page.getByText("Software Engineer (Frontend)", { exact: true })).toBeVisible();

    const resume = page.getByRole("link", { name: "Download resume" });
    const response = await request.get((await resume.getAttribute("href"))!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("project details: duplicates removed and unsafe links dropped", async ({ page }) => {
    await page.goto("/");
    const work = page.locator("#work");
    await expect(work.locator("li", { hasText: "Trail Finder" }).first().locator(".tag")).toHaveText(["React Native", "TypeScript"]);
    await expect(work.getByRole("link", { name: "Visit example.test" })).toBeVisible();
    await expect(work.locator('a[href^="javascript"]')).toHaveCount(0);
  });

  test("small project images aren't stretched", async ({ page }) => {
    await page.goto("/");
    const icon = page.getByAltText("Tiny Icon Project preview");
    await icon.scrollIntoViewIfNeeded();
    await expect(icon).toHaveJSProperty("complete", true);
    const box = await icon.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(56);
    expect(box!.width).toBe(box!.height);
  });

  test("skills are listed strongest first", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#skills li")).toHaveText(["React", "Redux"]);
  });

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    test(`no sideways scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("the mobile menu works", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(page).toHaveURL(/#contact$/);
  });

  test("the theme toggle applies and persists without a flash", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  });

  test("follows the system theme by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const duration = await page
      .locator(".hero-photo")
      .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
    expect(duration).toBeLessThan(0.001);
  });

  test("unknown pages get a helpful 404", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This trail doesn't lead anywhere." })).toBeVisible();
    await page.getByRole("link", { name: "Go to the home page" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("robots and sitemap keep the admin out of search", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /admin");
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`no accessibility violations in ${scheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto("/");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
    });
  }
});

test.describe("contact form", () => {
  test("sends a message and clears the form", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": "10.0.0.60" });
    await page.goto("/#contact");
    await page.getByLabel("Name").fill("A Visitor");
    await page.getByLabel("Email").fill("visitor2@example.test");
    await page.getByLabel("Message").fill("Hello there");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText(/Message sent/);
    await expect(page.getByLabel("Message")).toHaveValue("");
  });

  test("explains a server error and keeps what was typed", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 500, json: { success: false, error: "Failed to submit form." } }),
    );
    await page.goto("/#contact");
    await page.getByLabel("Name").fill("A Visitor");
    await page.getByLabel("Email").fill("visitor3@example.test");
    await page.getByLabel("Message").fill("Keep this text");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText("Failed to submit form.");
    await expect(page.getByLabel("Message")).toHaveValue("Keep this text");
  });

  test("the API validates input, and types can't crash it", async ({ request }) => {
    const headers = { "x-forwarded-for": "10.0.0.61" };
    const post = (data: object) => request.post("/api/contact", { headers, data });

    expect((await post({ name: "A", email: "bad", message: "x" })).status()).toBe(400);
    expect((await post({ name: { $gt: "" }, email: ["x"], message: 1 })).status()).toBe(400);
    expect((await post({ name: "A", email: "a@b.test", message: "x".repeat(5001) })).status()).toBe(400);
  });

  test("a bot filling the hidden field gets a success reply but stores nothing", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "10.0.0.62" },
      data: { name: "Bot Honeypot", email: "bot@example.test", message: "spam", company: "Spam Inc" },
    });
    expect(response.status()).toBe(201);
    // Confirmed from the admin side in security.spec.ts
  });

  test("repeat senders are slowed down", async ({ request }) => {
    const headers = { "x-forwarded-for": "10.0.0.63" };
    const data = { name: "Flood", email: "flood@example.test", message: "again" };
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await request.post("/api/contact", { headers, data })).status());
    }
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
