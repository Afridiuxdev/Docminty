"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SalaryPreview } from "@/app/salary-slip/page";
import { ExperiencePreview } from "@/app/experience-letter/page";
import { ResignationPreview } from "@/app/resignation-letter/page";
import { JobOfferPreview } from "@/app/job-offer-letter/page";
import { ProformaPreview } from "@/app/proforma-invoice/page";
import { POPreview } from "@/app/purchase-order/page";
import { PackingPreview } from "@/app/packing-slip/page";
import { VoucherPreview } from "@/app/payment-voucher/page";
import { RentPreview } from "@/app/rent-receipt/page";
import { InvoicePreview } from "@/app/invoice/page";
import { QuotationPreview } from "@/app/quotation/page";
import { ReceiptPreview } from "@/app/receipt/page";
import { CertificatePreview } from "@/app/certificate/page";
import { InternshipPreview } from "@/app/internship-certificate/page";

const LANDSCAPE_TYPES = new Set(["certificate", "internship"]);

function buildPrintCSS(isLandscape) {
  const pageW = isLandscape ? "297mm" : "210mm";
  const pageH = isLandscape ? "210mm" : "297mm";
  const pageSize = isLandscape ? "A4 landscape" : "A4";
  return `
  *, *::before, *::after { box-sizing: border-box; }

  @page { size: ${pageSize}; margin: 0; }

  html, body {
    margin: 0;
    padding: 0;
    width: ${pageW};
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Override preview-panel border/radius for print */
  #pdf-ready .pdf-preview {
    width: ${pageW} !important;
    min-height: ${pageH} !important;
    border: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    box-shadow: none !important;
    zoom: 1 !important;
  }

  /* Certificate/internship: full-width landscape, remove preview chrome */
  #pdf-ready > div {
    width: ${pageW} !important;
    ${isLandscape ? "border: none !important; border-radius: 0 !important; box-shadow: none !important;" : ""}
  }

  /* Ensure tables don't break */
  .pdf-table { page-break-inside: avoid; }

  /* Force background colors in print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
`}

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
  const isLandscape = LANDSCAPE_TYPES.has(docType);

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
      case "proforma":
        return <ProformaPreview form={form} template={template} accent={accent} />;
      case "purchase":
        return <POPreview form={form} template={template} accent={accent} />;
      case "packing":
        return <PackingPreview form={form} template={template} accent={accent} />;
      case "voucher":
        return <VoucherPreview form={form} template={template} accent={accent} />;
      case "rent":
        return <RentPreview form={form} template={template} accent={accent} />;
      case "invoice":
        return <InvoicePreview form={form} template={template} accent={accent} />;
      case "quotation":
        return <QuotationPreview form={form} template={template} accent={accent} />;
      case "receipt":
        return <ReceiptPreview form={form} template={template} accent={accent} />;
      case "certificate":
        return <CertificatePreview form={form} template={template} accent={accent} />;
      case "internship":
        return <InternshipPreview form={form} template={template} accent={accent} />;
      default:
        return <div>Unsupported document type: {docType}</div>;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: buildPrintCSS(isLandscape) }} />
      <div id="pdf-ready">{renderPreview()}</div>
    </>
  );
}
