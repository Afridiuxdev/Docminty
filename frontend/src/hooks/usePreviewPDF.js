"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import toast from "react-hot-toast";

/**
 * Captures the live preview element as a JPEG image and packages it
 * into a PDF using pdf-lib, giving 100% visual fidelity between
 * the on-screen preview and the downloaded PDF.
 *
 * Migration Note: Switched from html2canvas to html-to-image (SVG based)
 * for significantly sharper text and more accurate layouts.
 *
 * File size is kept ≤ 50 KB by dynamically reducing JPEG quality.
 */
export function usePreviewPDF() {
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const plan = user?.plan?.toUpperCase() || "FREE";
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";

  /**
   * @param {React.RefObject<HTMLElement>} previewRef  – ref on the preview wrapper div
   * @param {string}  docType   – e.g. "invoice"
   * @param {string}  template  – e.g. "Classic"
   * @param {string}  filename  – e.g. "Invoice-001.pdf"
   */
  const download = useCallback(async (previewRef, docType, template, filename) => {
    // 1. Pro template gate (same logic as useDownloadPDF)
    const templates = TEMPLATE_REGISTRY[docType] || {};
    const meta = templates[template] || { pro: false };
    if (meta.pro && !isUserPro) {
      toast.error("This is a PRO template. Upgrade to download!");
      router.push("/pricing");
      return;
    }

    if (!previewRef?.current) {
      toast.error("Preview not ready. Please try again.");
      return;
    }

    setGenerating(true);
    const toastId = toast.loading("Generating PDF…");

    try {
      // 2. Dynamically import heavy deps (keeps initial bundle small)
      const [ { toCanvas }, { PDFDocument }] = await Promise.all([
        import("html-to-image"),
        import("pdf-lib"),
      ]);

      const el = previewRef.current;

      // 3. Render the preview element to a canvas
      // Wait a tiny bit for any layout/font shifts to settle
      await new Promise(r => setTimeout(r, 200));

      const canvas = await toCanvas(el, {
        pixelRatio: 3,           // 3× Ultra High Def
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: false,
        width: 800,              // Forced width for professional A4 consistency
        style: {
          userSelect: 'none',
          webkitUserSelect: 'none',
          boxShadow: 'none',     // Remove preview-only artifacts
          borderRadius: '0',
          border: 'none',
          margin: '0',
          padding: '0',
          background: '#ffffff'
        }
      });

      // 4. Convert to High-Quality JPEG (Increasing limit to 200KB for Professional Clarity)
      const jpegBytes = await _compressToTarget(canvas, 200 * 1024);

      // 5. Build PDF with pdf-lib (A4 page)
      const pdfDoc = await PDFDocument.create();
      const jpegImage = await pdfDoc.embedJpg(jpegBytes);

      const A4_W = 595.28;
      const A4_H = 841.89;

      // Calculate proportional scaling to fit A4 while maintaining Xerox look
      const { width: imgW, height: imgH } = jpegImage.scale(1);
      const scale = Math.min(A4_W / imgW, A4_H / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      // Center exactly like a professional print
      const x = (A4_W - drawW) / 2;
      const y = (A4_H - drawH) / 2;

      const page = pdfDoc.addPage([A4_W, A4_H]);
      page.drawImage(jpegImage, {
        x,
        y,
        width: drawW,
        height: drawH
      });

      const pdfBytes = await pdfDoc.save();

      // 6. Trigger download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("Preview PDF error:", err);
      toast.dismiss(toastId);
      toast.error(`Error: ${err.message || "PDF generation failed"}`);
    } finally {
      setGenerating(false);
    }
  }, [isUserPro, router]);

  /**
   * Same as download() but returns a File instead of triggering a download.
   * Used for cloud save (uploading to backend).
   */
  const generateBlob = useCallback(async (previewRef, docType, template, filename) => {
    const templates = TEMPLATE_REGISTRY[docType] || {};
    const meta = templates[template] || { pro: false };
    if (meta.pro && !isUserPro) throw new Error("PRO template");
    if (!previewRef?.current) throw new Error("Preview not ready");

    const [ { toCanvas }, { PDFDocument }] = await Promise.all([
      import("html-to-image"),
      import("pdf-lib"),
    ]);
    const jsPDF = null; // jspdf removed

    await new Promise(r => setTimeout(r, 200));

    const canvas = await toCanvas(previewRef.current, {
      pixelRatio: 3,
      backgroundColor: "#ffffff",
      cacheBust: true,
      skipFonts: false,
      width: 800,
      style: {
        userSelect: 'none',
        webkitUserSelect: 'none',
        boxShadow: 'none',
        borderRadius: '0',
        border: 'none',
        margin: '0',
        padding: '0',
        background: '#ffffff'
      }
    });

    const jpegBytes = await _compressToTarget(canvas, 200 * 1024);

    const pdfDoc = await PDFDocument.create();
    const jpegImage = await pdfDoc.embedJpg(jpegBytes);

    const A4_W = 595.28;
    const A4_H = 841.89;
    
    const { width: imgW, height: imgH } = jpegImage.scale(1);
    const scale = Math.min(A4_W / imgW, A4_H / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;

    const x = (A4_W - drawW) / 2;
    const y = (A4_H - drawH) / 2;

    const page = pdfDoc.addPage([A4_W, A4_H]);
    page.drawImage(jpegImage, {
      x,
      y,
      width: drawW,
      height: drawH
    });

    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes], filename, { type: "application/pdf" });
  }, [isUserPro]);

  return { download, generateBlob, generating };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Converts a canvas to a JPEG Uint8Array that fits within maxBytes.
 * Using JPEG for Path B because it allows for high-res downsampling
 * while maintaining selectable visual fidelity under the 50KB limit.
 */
async function _compressToTarget(canvas, maxBytes) {
  let quality = 0.85;
  let bytes;

  while (quality >= 0.29) {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) break; // Safety check

    if (blob.size <= maxBytes || quality < 0.31) {
      const buffer = await blob.arrayBuffer();
      bytes = new Uint8Array(buffer);
      break;
    }
    quality -= 0.05;
  }

  // Fallback: If for some reason bytes are still undefined, return a mid-quality version
  if (!bytes) {
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}


