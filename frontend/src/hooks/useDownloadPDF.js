import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { registerFonts } from "@/utils/pdfFonts";
import { TEMPLATE_REGISTRY, loadTemplate } from "@/templates/registry";

// These document types are rendered via Puppeteer (live preview = PDF)
const PUPPETEER_DOC_TYPES = new Set([
  "salary", "experience", "resignation", "job-offer",
  "proforma", "purchase", "packing", "voucher", "rent",
  "invoice", "quotation", "receipt",
  "certificate", "internship",
]);

async function downloadViaLink(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useDownloadPDF() {
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const plan = user?.plan?.toUpperCase() || "FREE";
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";

  const download = async (docType, variant, form, filename) => {
    // 1. Check template permissions
    const templates = TEMPLATE_REGISTRY[docType] || {};
    const meta = templates[variant] || { pro: false };

    if (meta.pro && !isUserPro) {
      toast.error("This is a PRO template. Please upgrade to download!");
      router.push("/pricing");
      return;
    }

    setDownloading(true);

    try {
      if (PUPPETEER_DOC_TYPES.has(docType)) {
        // --- Puppeteer path: server renders the live preview to PDF ---
        const response = await fetch("/api/generate-hr-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ docType, template: variant, form, filename }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(err.error || `Server error ${response.status}`);
        }

        const blob = await response.blob();
        await downloadViaLink(blob, filename);
        toast.success("PDF downloaded!");
      } else {
        // --- React-PDF path: for invoices, certificates, etc. ---
        registerFonts();

        const React = (await import("react")).default;
        const { pdf } = await import("@react-pdf/renderer");

        const Template = await loadTemplate(docType, variant);
        if (!Template) throw new Error(`Could not load template: ${docType}_${variant}`);

        const element = React.createElement(Template, { form });
        const blob = await pdf(element).toBlob();
        await downloadViaLink(blob, filename);
        toast.success("PDF downloaded!");
      }
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const generateBlob = async (docType, variant, form, filename) => {
    const templates = TEMPLATE_REGISTRY[docType] || {};
    const meta = templates[variant] || { pro: false };
    if (meta.pro && !isUserPro) throw new Error("PRO template");

    if (PUPPETEER_DOC_TYPES.has(docType)) {
      const response = await fetch("/api/generate-hr-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, template: variant, form, filename }),
      });
      if (!response.ok) throw new Error("PDF generation failed");
      const blob = await response.blob();
      return new File([blob], filename, { type: "application/pdf" });
    }

    registerFonts();
    const React = (await import("react")).default;
    const { pdf } = await import("@react-pdf/renderer");
    const Template = await loadTemplate(docType, variant);
    if (!Template) throw new Error(`Could not load template: ${docType}_${variant}`);
    const element = React.createElement(Template, { form });
    const blob = await pdf(element).toBlob();
    return new File([blob], filename, { type: "application/pdf" });
  };

  return { download, generateBlob, downloading };
}
