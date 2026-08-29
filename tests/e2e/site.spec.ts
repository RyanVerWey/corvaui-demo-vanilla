import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const routes = [
  ["home", "/#/", "Northstar gives distributed", 2],
  ["dashboard", "/#/dashboard", "Live metrics for crew capacity", 1],
  ["work-orders", "/#/work-orders", "Create a work order", 0],
  ["customers", "/#/customers", "Pipeline, records", 0],
  ["settings", "/#/settings", "Preferences for identity", 0],
  ["about", "/#/about", "Installed packages", 0],
] as const;

for (const [name, path, content, imageCount] of routes) {
  test(`${name} is responsive and WCAG AA clean`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(content, { exact: false }).first()).toBeVisible();
    await expect(page.locator("#route-view img")).toHaveCount(imageCount);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => (await (window as typeof window & { axe: { run: Function } }).axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
  });
}

test("Indigo dark mode stays selected", async ({ page }) => {
  await page.goto("/#/", { waitUntil: "networkidle" });
  await page.locator("#theme-dark").click();
  await expect(page.locator("#app-shell")).toHaveAttribute("data-corva-theme", "indigo-dark");
});
