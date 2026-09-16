// axe-core audit driven by Playwright's bundled Chromium.
//
// Substitutes for `@axe-core/cli`, whose bundled selenium-webdriver +
// chromedriver could not drive the local Chrome install on this machine
// (chromedriver.exe ENOENT). Same gate — serious/critical violations fail
// the run — different driver.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const paths = [
  "/",
  "/products/rice",
  "/products/rice/irri-6",
  "/contact",
  "/certifications",
];

const FAILING_IMPACTS = new Set(["serious", "critical"]);

const browser = await chromium.launch();
let hadFailures = false;

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const path of paths) {
    const url = new URL(path, BASE_URL).toString();
    await page.goto(url, { waitUntil: "load" });

    const results = await new AxeBuilder({ page }).analyze();
    const violations = results.violations;

    console.log(`\n${url}`);
    if (violations.length === 0) {
      console.log("  no violations");
      continue;
    }

    for (const violation of violations) {
      const selectors = violation.nodes.map((n) => n.target.join(" ")).join(", ");
      console.log(`  [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`);
      console.log(`    selectors: ${selectors}`);

      if (FAILING_IMPACTS.has(violation.impact)) {
        hadFailures = true;
      }
    }
  }
} finally {
  await browser.close();
}

if (hadFailures) {
  console.error("\naxe: serious/critical violations found");
  process.exit(1);
}

console.log("\naxe: no serious/critical violations");
