import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("Vanilla showcase integrity", () => {
  it("uses only published CorvaUI packages", () => {
    expect(pkg.dependencies["@corvaui/web-components"]).toBe("^0.1.8");
    expect(pkg.dependencies["@corvaui/tokens"]).toBe("^0.1.8");
    expect(source).not.toMatch(/apexui|@apexui/i);
  });

  it("keeps seven framework-free routes and local media", () => {
    expect((source.match(/id: "(home|dashboard|work-orders|customers|data-table|settings|about)"/g) ?? []).length).toBeGreaterThanOrEqual(7);
    expect(source).toContain('id="service-grid"');
    expect(source).toContain('pageable page-size="6"');
    expect(source).toContain("images/northstar-workshop.jpg");
    expect(source).toContain("images/northstar-control-room.jpg");
  });
});
