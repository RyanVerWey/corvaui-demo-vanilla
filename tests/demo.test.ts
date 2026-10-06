import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const shell = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const definitionName = (tag: string) => `define${tag.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;

describe("Vanilla showcase integrity", () => {
  it("uses only published CorvaUI packages", () => {
    expect(pkg.dependencies["@corvaui/vanilla"]).toBe("^0.2.1");
    expect(pkg.dependencies["@corvaui/web-components"]).toBeUndefined();
    expect(pkg.dependencies["@corvaui/tokens"]).toBe("^0.2.1");
    expect(source).toContain('from "@corvaui/vanilla/components"');
    expect(source).not.toContain("defineCorvaUI");
    expect(source).toContain("Typed selected-component registration");
    expect(source).not.toContain("Typed full registration");
    const componentTags = [...new Set([...`${shell}\n${source}`.matchAll(/<(corva-[a-z-]+)/g)].map((match) => match[1]))];
    for (const tag of componentTags) {
      expect(source).toContain(`${definitionName(tag)}();`);
    }
    expect(source).toContain("available: 88");
    expect(source).not.toMatch(/apexui|@apexui/i);
  });

  it("keeps seven framework-free routes and local media", () => {
    expect((source.match(/id: "(home|dashboard|work-orders|customers|data-table|settings|about)"/g) ?? []).length).toBeGreaterThanOrEqual(7);
    expect(source).toContain('id="service-grid"');
    expect(source).toContain('pageable page-size="6"');
    expect(source).toContain("images/northstar-workshop.jpg");
    expect(source).toContain("images/northstar-control-room.jpg");
    expect(source).toContain("Synthetic demo data");
    expect(source).not.toContain('from "@corvaui/web-components');
  });
});
