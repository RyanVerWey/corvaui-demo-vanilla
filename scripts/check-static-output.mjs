import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const html = readFileSync("dist/index.html", "utf8");
if (!html.includes("CorvaUI Vanilla Demo") || !/src="\/assets\/[^\"]+\.js"/.test(html)) {
  throw new Error("dist/index.html is missing the built application entry.");
}

const collectJavaScript = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return collectJavaScript(path);
  return entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
});

const files = collectJavaScript("dist");
if (files.length === 0) {
  throw new Error("Production build emitted no JavaScript assets.");
}

const lazyEntryReferences = files.filter((file) => readFileSync(file, "utf8").includes(".entry.js"));
if (lazyEntryReferences.length > 0) {
  throw new Error(`Production build still references missing lazy component entries:\n${lazyEntryReferences.join("\n")}`);
}

console.log(`Verified ${files.length} production JavaScript assets with no lazy component entry references.`);
