/**
 * Generates docs/AstroVed-Project-Documentation.pdf from docs/PROJECT_DOCUMENTATION.md
 * Requires: marked, puppeteer-core, and Google Chrome at the default Windows path.
 * Run: node scripts/generate-doc-pdf.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";
import { marked } from "marked";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "docs", "PROJECT_DOCUMENTATION.md");
const pdfPath = path.join(root, "docs", "AstroVed-Project-Documentation.pdf");

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

function findChrome() {
  for (const p of chromePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const chromePath = findChrome();
if (!chromePath) {
  console.error("Chrome not found. Install Google Chrome or edit scripts/generate-doc-pdf.mjs.");
  process.exit(1);
}

if (!fs.existsSync(mdPath)) {
  console.error("Missing:", mdPath);
  process.exit(1);
}

const md = fs.readFileSync(mdPath, "utf8");
const body = await marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>AstroVed Platform — Project Documentation</title>
<style>
  body { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; max-width: 820px; margin: 0 auto; padding: 28px; line-height: 1.55; color: #1a1a2e; font-size: 11pt; }
  h1 { font-size: 1.65rem; margin-top: 0; color: #2e1b53; }
  h2 { font-size: 1.25rem; margin-top: 1.6rem; border-bottom: 2px solid #6869F9; padding-bottom: 6px; color: #2e1b53; }
  h3 { font-size: 1.05rem; margin-top: 1.15rem; color: #342151; }
  p { margin: 0.65em 0; }
  ul, ol { margin: 0.5em 0; padding-left: 1.35em; }
  li { margin: 0.25em 0; }
  table { border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 0.92rem; }
  th, td { border: 1px solid #c9c2e8; padding: 8px 10px; text-align: left; vertical-align: top; }
  th { background: #f3f0ff; font-weight: 600; }
  code { background: #f5f3ff; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; font-family: ui-monospace, monospace; }
  pre { background: #f8f7fc; padding: 12px 14px; overflow-x: auto; border-radius: 8px; border: 1px solid #e8e2ff; }
  pre code { background: none; padding: 0; }
  hr { border: none; border-top: 1px solid #ddd6fe; margin: 22px 0; }
  strong { color: #241a46; }
  @media print {
    body { padding: 0; max-width: none; font-size: 10pt; }
    h2 { break-after: avoid; page-break-after: avoid; }
    h3 { break-after: avoid; }
    tr { break-inside: avoid; }
    a { color: #1a1a2e; text-decoration: none; }
  }
</style>
</head>
<body>${body}</body>
</html>`;

const tmpHtml = path.join(root, "docs", "_doc_build.html");
fs.writeFileSync(tmpHtml, html, "utf8");

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmpHtml).href, { waitUntil: "networkidle0", timeout: 60_000 });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
  });
  console.log("PDF written:", pdfPath);
} finally {
  await browser.close();
  try {
    fs.unlinkSync(tmpHtml);
  } catch {
    /* ignore */
  }
}
