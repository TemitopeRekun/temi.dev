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
  margin: { top: "18mm", right: "20mm", bottom: "18mm", left: "20mm" },
});

await browser.close();
console.log("PDF generated:", pdfPath);
