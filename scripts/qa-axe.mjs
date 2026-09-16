// axe-core audit driven by Playwright's bundled Chromium.
//
// Substitutes for `@axe-core/cli`, whose bundled selenium-webdriver +
// chromedriver could not drive the local Chrome install on this machine
// (chromedriver.exe ENOENT). Same gate — serious/critical violations fail
// the run — different driver.
//
// One-time setup: `npx playwright install chromium` (downloads Playwright's
// bundled Chromium; not committed, not part of `npm install`).
// Requires a production server already running at the target origin
// (`npm start`, or `npx next start -p <port>` if 3000 is taken).
// Override the target origin with QA_BASE_URL, e.g.:
//   QA_BASE_URL=http://localhost:3006 node scripts/qa-axe.mjs
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const paths = [
  "/",
  "/products",
  "/products/rice",
  "/products/rice/irri-6",
  "/contact",
  "/certifications",
];

const FAILING_IMPACTS = new Set(["serious", "critical"]);

const browser = await chromium.launch();
let hadFailures = false;
let serverUnreachable = false;

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const path of paths) {
    if (serverUnreachable) break;
    const url = new URL(path, BASE_URL).toString();
    try {
      await page.goto(url, { waitUntil: "load" });
    } catch {
      console.error(`Is the production server running on ${BASE_URL}? (npm start)`);
      serverUnreachable = true;
      break;
    }

    const results = await new AxeBuilder({ page }).analyze();
    const violations = results.violations;

    console.log(`\n${url}`);
    if (violations.length === 0) {
      console.log("  no violations");
      continue;
    }

    for (const violation of violations) {
      const impact = violation.impact ?? "unknown";
      const selectors = violation.nodes.map((n) => n.target.join(" ")).join(", ");
      console.log(`  [${impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`);
      console.log(`    selectors: ${selectors}`);

      if (FAILING_IMPACTS.has(violation.impact)) {
        hadFailures = true;
      }
    }
  }
} finally {
  await browser.close();
}

if (serverUnreachable) {
  process.exit(1);
}

if (hadFailures) {
  console.error("\naxe: serious/critical violations found");
  process.exit(1);
}

console.log("\naxe: no serious/critical violations");
