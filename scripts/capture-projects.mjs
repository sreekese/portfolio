import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const data = JSON.parse(
  await fs.readFile(
    new URL("../src/data/portfolio.json", import.meta.url),
    "utf8",
  ),
);
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
});
try {
  for (const project of data.projects.filter(
    (p) => !process.argv[2] || p.no === process.argv[2],
  )) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const dir = `/tmp/portfolio-capture-${project.no}`;
    await fs.mkdir(dir, { recursive: true });
    await page.goto(project.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(7000);
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(1240, 760);
    console.log(
      project.no,
      await page.title(),
      (await page.locator("body").innerText()).slice(0, 350),
    );
    const assetName = project.no === "01" ? "01-v2" : project.no;
    await page.screenshot({ path: `public/projects/${assetName}.png` });
    const max = await page.evaluate(() =>
      Math.min(
        1500,
        Math.max(0, document.documentElement.scrollHeight - innerHeight),
      ),
    );
    for (let i = 0; i < 36; i++) {
      if (project.no === "01") {
        // Keep the public landing page in view; do not record account forms.
        if (i === 8)
          await page.getByRole("link", { name: /Get started/ }).hover();
        if (i === 20) await page.getByRole("link", { name: "Sign in" }).hover();
        if (i === 28) await page.mouse.move(1240, 760);
      }

      const progress =
        i < 6 ? 0 : i > 29 ? 0 : Math.sin(((i - 6) / 24) * Math.PI);
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        max * progress,
      );
      await page.waitForTimeout(140);
      await page.screenshot({
        path: `${dir}/${String(i).padStart(3, "0")}.png`,
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
