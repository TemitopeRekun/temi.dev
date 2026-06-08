import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, "../apps/web/public/cv.html");
const pdfPath = resolve(__dirname, "../apps/web/public/Temitope_Ogunrekun_CV.pdf");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});

await browser.close();
console.log("PDF generated:", pdfPath);
