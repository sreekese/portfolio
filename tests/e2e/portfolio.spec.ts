import { expect, test, type Page } from "@playwright/test";
test("portfolio navigation, filters, dialog focus and theme persistence", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Sreekese P S", exact: true }),
  ).toBeVisible();
  const filters = page.getByRole("group", {
    name: "Filter projects by category",
  });
  await filters.getByRole("button", { name: "React.js", exact: true }).click();
  await expect(
    page.getByRole("article").filter({ has: page.locator(".project-open") }),
  ).toHaveCount(3);
  const trigger = page.getByRole("button", { name: "Open Netflix Clone" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading")).toHaveText("Youtube Clone");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(
    page.getByRole("link", { name: "sreekeseps@gmail.com" }),
  ).toBeVisible();
  const overflow = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll("main *, header *")]
      .filter((el) => el.getBoundingClientRect().right > innerWidth)
      .map((el) => ({
        tag: el.tagName,
        className: el.className,
        right: el.getBoundingClientRect().right,
      }))
      .slice(0, 20),
  }));
  expect(overflow.width, JSON.stringify(overflow)).toBeLessThanOrEqual(
    overflow.viewport,
  );
  expect(errors).toEqual([]);
});
test("production responses carry unique nonces and safe headers", async ({
  request,
}) => {
  const first = await request.get("/"),
    second = await request.get("/");
  expect(first.status()).toBe(200);
  const csp = first.headers()["content-security-policy"];
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain("unsafe-eval");
  const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
  expect(nonce).toBeTruthy();
  expect(second.headers()["content-security-policy"]).not.toContain(
    `'nonce-${nonce}'`,
  );
  expect(await first.text()).toContain(`nonce="${nonce}"`);
  expect(first.headers()["x-content-type-options"]).toBe("nosniff");
  expect(first.headers()["cache-control"]).toContain("no-store");
});
test("content remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: test.info().project.use.baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Sreekese P S", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open Netflix Clone" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "sreekeseps@gmail.com" }),
  ).toHaveAttribute("href", "mailto:sreekeseps@gmail.com");
  await context.close();
});
test("reduced motion disables decorative animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".mq-track")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".ring")).toHaveCSS("animation-name", "none");
});

test("dragging leaves filters unchanged and native dialog contains focus", async ({
  page,
}) => {
  await page.goto("/");
  const chip = page
    .getByRole("complementary")
    .getByRole("button", { name: "React.js", exact: true });
  await chip.scrollIntoViewIfNeeded();
  const bounds = await chip.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) throw new Error("Toolbox chip has no bounds");
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + 35,
    bounds.y + bounds.height / 2 + 20,
    { steps: 6 },
  );
  await page.mouse.up();
  await expect(chip).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("group").getByRole("button", { name: "All", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Open Netflix Clone" }).click();
  const dialog = page.getByRole("dialog");
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
});

test("capture responsive reference preview", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const portrait = page.locator(".portrait-photo img");
  await portrait.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      portrait.evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.locator(".personal-portrait").screenshot({
    path: testInfo.outputPath("about-portrait.png"),
    animations: "disabled",
  });
  await page.locator(".hero-identity").scrollIntoViewIfNeeded();
  await page.locator(".hero-identity").screenshot({
    path: testInfo.outputPath("hero-portrait.png"),
    animations: "disabled",
  });
  await page.screenshot({
    path: testInfo.outputPath("portfolio.png"),
    fullPage: true,
    animations: "disabled",
  });
});

test("visitor can pause continuous animation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator(".mq-track")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".ring")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Resume animations" }).click();
  await expect(page.locator(".mq-track")).toHaveCSS(
    "animation-name",
    "marquee",
  );
});

test("resume qualifications and project destinations are present", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Sreekese P S — React.js Developer");
  await expect(
    page.getByRole("heading", { name: "Certifications", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Namaste React — Akshay Saini", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "+91 8281437586" }),
  ).toHaveAttribute("href", "tel:+918281437586");
  await page.getByRole("button", { name: "Open Netflix Clone" }).click();
  await expect(
    page.getByRole("link", { name: "View live project ↗" }),
  ).toHaveAttribute("href", "https://movie-app-b5d79.web.app/");
});

test("rotating portrait stays within the mobile document", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const ring = document.querySelector<SVGElement>(".ring");
    if (ring) {
      ring.style.animation = "none";
      ring.style.transform = "rotate(45deg)";
    }
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

async function mockSpeech(page: Page) {
  await page.addInitScript(() => {
    class Utterance {
      constructor(public text: string) {}
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: Utterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: (utterance: Utterance) => utterance.onstart?.(),
        cancel: () => {},
        getVoices: () => [],
      },
    });
  });
}

test("personal portraits load and avatar starts and stops its introduction", async ({
  page,
}) => {
  // Includes two lazy images, WebGL shader compilation, and speech controls.
  test.setTimeout(60000);
  await mockSpeech(page);
  await page.goto("/");
  const photo = page.getByRole("img", {
    name: "Sreekese P S outdoors, wearing glasses and a burgundy shirt",
  });
  await photo.scrollIntoViewIfNeeded();
  await expect
    .poll(() => photo.evaluate((img) => (img as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  const avatar = page.getByRole("button", {
    name: "Hear Sreekese’s introduction",
  });
  await avatar.scrollIntoViewIfNeeded();
  await expect(avatar.locator(".avatar-studio")).toHaveAttribute(
    "data-status",
    "ready",
  );
  await expect(avatar.locator("canvas")).toBeVisible();
  await avatar.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".hero-avatar")).toHaveAttribute(
    "data-speaking",
    "true",
  );
  await expect(page.locator(".intro-transcript")).toHaveCount(0);
  await expect(page.locator(".avatar-studio")).toHaveAttribute(
    "data-motion",
    "talking",
  );
  await page.getByRole("button", { name: "Stop audio", exact: true }).click();
  await expect(page.locator(".hero-avatar")).toHaveAttribute(
    "data-speaking",
    "false",
  );
});

test("speaking avatar respects motion preferences without blocking audio", async ({
  page,
}) => {
  await mockSpeech(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Hear Sreekese’s introduction" })
    .click();
  await expect(page.locator(".hero-avatar")).toHaveAttribute(
    "data-speaking",
    "true",
  );
  await expect(page.locator(".avatar-studio")).toHaveAttribute(
    "data-motion",
    "paused",
  );

  await expect(page.locator(".speech-bars i").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator(".hero-avatar")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.getByRole("button", { name: "Stop audio", exact: true }).click();
});

test("unsupported speech reports an error without showing a transcript", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: undefined,
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Hear Sreekese’s introduction" })
    .click();
  await expect(page.locator(".speech-status")).toContainText("isn’t supported");
  await expect(page.locator(".intro-transcript")).toHaveCount(0);
});

test("3D fallback retains click-to-speak without WebGL", async ({ page }) => {
  await mockSpeech(page);
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).startsWith("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".avatar-studio")).toHaveAttribute(
    "data-status",
    "fallback",
  );
  await page
    .getByRole("button", { name: "Hear Sreekese’s introduction" })
    .click();
  await expect(page.locator(".hero-avatar")).toHaveAttribute(
    "data-speaking",
    "true",
  );
  await expect(page.locator(".intro-transcript")).toHaveCount(0);
});

test("project screenshots switch to recorded GIFs on hover", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const cards = page.locator("#work .card");
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i);
    await card.scrollIntoViewIfNeeded();
    const poster = card.locator(".project-preview > img").first();
    await expect
      .poll(() =>
        poster.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await card.locator("h3").hover();
    const animation = card.locator(".project-preview-animation");
    await expect(animation).toBeVisible();
    await expect
      .poll(() =>
        animation.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBe(640);
    await page.mouse.move(0, 0);
    await expect(animation).toHaveCount(0);
  }
  const preview = cards.first().locator(".project-preview");
  await preview.focus();
  await expect(preview).toHaveAttribute("data-playing", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(preview).toHaveAttribute("data-playing", "false");
  await expect(page.locator(".project-preview-animation")).toHaveCount(0);
});
