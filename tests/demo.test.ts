import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("Vanilla showcase integrity", () => {
  it("uses only published CorvaUI packages", () => {
    expect(pkg.dependencies["@corvaui/web-components"]).toBe("^0.1.7");
    expect(pkg.dependencies["@corvaui/tokens"]).toBe("^0.1.7");
    expect(source).not.toMatch(/apexui|@apexui/i);
  });

  it("keeps six framework-free routes and local media", () => {
    expect((source.match(/id: "(home|dashboard|work-orders|customers|settings|about)"/g) ?? []).length).toBeGreaterThanOrEqual(6);
    expect(source).toContain("images/northstar-workshop.jpg");
    expect(source).toContain("images/northstar-control-room.jpg");
  });
});
