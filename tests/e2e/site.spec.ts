import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const routes = [
  ["home", "/#/", "Northstar gives distributed", 2],
  ["dashboard", "/#/dashboard", "Sample metrics for crew capacity", 1],
  ["work-orders", "/#/work-orders", "Create a work order", 0],
  ["customers", "/#/customers", "Pipeline, records", 0],
  ["data", "/#/data-table", "Dispatch evidence and service performance", 0],
  ["settings", "/#/settings", "Preferences for identity", 0],
  ["about", "/#/about", "Installed packages", 0],
] as const;

for (const [name, path, content, imageCount] of routes) {
  test(`${name} is responsive and WCAG AA clean`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", (response) => {
      if (response.status() >= 400 && /\.entry\.js(?:\?|$)/.test(response.url())) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(path, { waitUntil: "networkidle" });
    expect(await page.evaluate(() => window.innerWidth)).toBe(testInfo.project.name === "mobile" ? 320 : 1440);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText("Synthetic demo data", { exact: true })).toBeVisible();
    await expect(page.getByText(content, { exact: false }).first()).toBeVisible();
    await expect(page.locator("#route-view img")).toHaveCount(imageCount);
    const componentState = await page.evaluate(() => {
      const elements = [...document.querySelectorAll("*")].filter((element) => element.localName.startsWith("corva-"));
      return {
        undefinedTags: [...new Set(elements.filter((element) => !customElements.get(element.localName)).map((element) => element.localName))],
        unhydratedTags: [...new Set(elements.filter((element) => !element.classList.contains("hydrated")).map((element) => element.localName))],
      };
    });
    expect(componentState.undefinedTags).toEqual([]);
    expect(componentState.unhydratedTags).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => (await (window as typeof window & { axe: { run: Function } }).axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
    await page.locator("#theme-light").click();
    await expect(page.locator("#app-shell")).toHaveAttribute("data-corva-theme", "indigo-light");
    await page.waitForTimeout(300);
    const lightViolations = await page.evaluate(async () => (await (window as typeof window & { axe: { run: Function } }).axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
    expect(lightViolations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${name}-light.png`), fullPage: true });
    if (name === "home" && testInfo.project.name === "mobile") {
      const menu = page.locator(".mobile-menu");
      await menu.locator("summary").focus();
      await page.keyboard.press("Enter");
      await menu.getByRole("link", { name: "Service data" }).focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#\/data-table$/);
      await expect(menu).not.toHaveAttribute("open", "");
      await expect(page.getByRole("heading", { level: 1, name: /Dispatch evidence/ })).toBeVisible();
    }
  });
}

test("Indigo dark mode stays selected", async ({ page }) => {
  await page.goto("/#/", { waitUntil: "networkidle" });
  await page.locator("#theme-dark").click();
  await expect(page.locator("#app-shell")).toHaveAttribute("data-corva-theme", "indigo-dark");
});

test("work-order validation and sample upload stay functional", async ({ page }) => {
  await page.goto("/#/work-orders", { waitUntil: "networkidle" });
  const upload = page.locator("#wo-files");
  await expect.poll(() => upload.evaluate((element) => (element as HTMLElement & { files?: Array<{ name: string }> }).files?.[0]?.name)).toBe("north-substation-panel.jpg");
  await page.getByRole("button", { name: "Save work order" }).click();
  await expect.poll(() => page.locator("#wo-site").evaluate((element) => (element as HTMLElement & { error?: string }).error)).toBe("Service site is required");
  const snackbar = page.locator("#snackbar");
  await expect.poll(() => snackbar.evaluate((element) => (element as HTMLElement & { open?: boolean }).open)).toBe(true);
  await expect(page.getByText("Complete required work order fields", { exact: true })).toBeVisible();
});

test("dashboard renders three distinct Indigo chart series", async ({ page }) => {
  await page.goto("/#/dashboard", { waitUntil: "networkidle" });
  const legend = page.getByRole("group", { name: "Crew capacity by region series" });
  await expect(legend).toBeVisible();
  await expect(page.locator(".corva-chart-legend-item")).toHaveCount(3);
  const colors = await page.locator(".corva-chart-swatch").evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).backgroundColor),
  );
  expect(new Set(colors).size).toBe(3);
});
