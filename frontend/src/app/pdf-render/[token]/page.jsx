"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SalaryPreview } from "@/app/salary-slip/page";
import { ExperiencePreview } from "@/app/experience-letter/page";
import { ResignationPreview } from "@/app/resignation-letter/page";
import { JobOfferPreview } from "@/app/job-offer-letter/page";

const PRINT_CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  @page { size: A4; margin: 0; }

  html, body {
    margin: 0;
    padding: 0;
    width: 210mm;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Override preview-panel border/radius for print */
  #pdf-ready .pdf-preview {
    width: 210mm !important;
    min-height: 297mm !important;
    border: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    box-shadow: none !important;
    zoom: 1 !important;
  }

  /* Ensure tables don't break */
  .pdf-table { page-break-inside: avoid; }

  /* Force background colors in print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
`;

export default function PDFRenderPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/pdf-data/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Session expired or not found");
        return r.json();
      })
      .then((d) => {
        setData(d);
        // Wait for all web fonts (Space Grotesk, Inter) to load
        document.fonts.ready.then(() => setReady(true));
      })
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) {
    return (
      <div id="pdf-error" style={{ padding: "20px", fontFamily: "sans-serif", color: "#ef4444" }}>
        Error: {error}
      </div>
    );
  }

  if (!ready || !data) {
    return <div id="pdf-loading" style={{ display: "none" }} />;
  }

  const { docType, template, form } = data;
  const accent = form?.templateColor || "#0D9488";

  const renderPreview = () => {
    switch (docType) {
      case "salary":
        return <SalaryPreview form={form} template={template} accent={accent} />;
      case "experience":
        return <ExperiencePreview form={form} template={template} accent={accent} />;
      case "resignation":
        return <ResignationPreview form={form} template={template} accent={accent} />;
      case "job-offer":
        return <JobOfferPreview form={form} template={template} accent={accent} />;
      default:
        return <div>Unsupported document type: {docType}</div>;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div id="pdf-ready">{renderPreview()}</div>
    </>
  );
}
