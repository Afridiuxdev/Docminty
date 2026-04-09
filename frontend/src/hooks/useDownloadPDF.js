import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { registerFonts } from "@/utils/pdfFonts";
import { TEMPLATE_REGISTRY, loadTemplate } from "@/templates/registry";

export function useDownloadPDF() {
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const plan = user?.plan?.toUpperCase() || "FREE";
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";

  const download = async (docType, variant, form, filename) => {
    // 1. Load Registry Meta
    const templates = TEMPLATE_REGISTRY[docType] || {};
    const meta = templates[variant] || { pro: false };

    // 2. Check Permissions
    if (meta.pro && !isUserPro) {
      toast.error("This is a PRO template. Please upgrade to download!");
      router.push("/pricing");
      return;
    }

    // 3. Register Fonts & Start Download
    registerFonts();
    setDownloading(true);

    try {
      const React = (await import("react")).default;
      const { pdf } = await import("@react-pdf/renderer");
      
      // Use the newly synchronized loadTemplate from registry.js
      const Template = await loadTemplate(docType, variant);
      
      if (!Template) {
        throw new Error(`Could not load template: ${docType}_${variant}`);
      }

      const element = React.createElement(Template, { form });
      const blob = await pdf(element).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const generateBlob = async (docType, variant, form, filename) => {
    const templates = TEMPLATE_REGISTRY[docType] || {};
    const meta = templates[variant] || { pro: false };
    if (meta.pro && !isUserPro) {
      throw new Error("PRO template");
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
