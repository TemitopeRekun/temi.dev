// Regenerates Temitope_Ogunrekun_CV.pdf from public/cv.html.
// Run after editing cv.html so the "Download CV" button serves the current version.
//   node apps/web/scripts/generate-cv-pdf.mjs
import puppeteer from "puppeteer";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "public");
const htmlPath = join(publicDir, "cv.html");
const pdfPath = join(publicDir, "Temitope_Ogunrekun_CV.pdf");

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  // Load from disk; wait for the Google Fonts @import to settle.
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await page.pdf({
    path: pdfPath,
    printBackground: true,     // keep the accent colours / borders
    preferCSSPageSize: true,   // honour @page { margin: 13mm 17mm }
    format: "A4",
  });
  console.log(`Wrote ${pdfPath}`);
} finally {
  await browser.close();
}
