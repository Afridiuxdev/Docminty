import puppeteer from "puppeteer";
import { setCacheItem } from "@/lib/pdfCache";

export const runtime = "nodejs";
export const maxDuration = 60;

const HR_DOC_TYPES = new Set(["salary", "experience", "resignation", "job-offer"]);

export async function POST(request) {
  try {
    const body = await request.json();
    const { docType, template, form, filename } = body;

    if (!HR_DOC_TYPES.has(docType)) {
      return Response.json({ error: "Unsupported document type" }, { status: 400 });
    }

    const token = crypto.randomUUID();
    setCacheItem(token, { docType, template, form });

    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    try {
      const page = await browser.newPage();

      // A4 at 96 dpi = 794 x 1123 px
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

      await page.goto(`${baseUrl}/pdf-render/${token}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Wait for preview to fully render (fonts + data)
      await page.waitForSelector("#pdf-ready", { timeout: 20000 });

      // Small buffer for any final paint
      await new Promise((r) => setTimeout(r, 200));

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });

      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${(filename || "document.pdf").replace(/"/g, "")}"`,
          "Cache-Control": "no-store",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("[generate-hr-pdf] error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
