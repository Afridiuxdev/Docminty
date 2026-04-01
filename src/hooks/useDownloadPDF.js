import { useState } from "react";
import toast from "react-hot-toast";

export function useDownloadPDF() {
  const [downloading, setDownloading] = useState(false);

  const download = async (templateName, form, filename) => {
    setDownloading(true);
    try {
      const React   = (await import("react")).default;
      const { pdf } = await import("@react-pdf/renderer");
      let TemplateModule;
      switch (templateName) {
        // Invoice variants
        case "Invoice":
        case "InvoiceClassic":   TemplateModule = await import("@/templates/invoice/Classic"); break;
        case "InvoiceModern":    TemplateModule = await import("@/templates/invoice/Modern"); break;
        case "InvoiceMinimal":   TemplateModule = await import("@/templates/invoice/Minimal"); break;
        case "InvoiceBold":      TemplateModule = await import("@/templates/invoice/Bold"); break;
        case "InvoiceCorporate": TemplateModule = await import("@/templates/invoice/Corporate"); break;
        case "InvoiceElegant":   TemplateModule = await import("@/templates/invoice/Elegant"); break;
        // Quotation variants
        case "Quotation":
        case "QuotationClassic":   TemplateModule = await import("@/templates/quotation/Classic"); break;
        case "QuotationModern":    TemplateModule = await import("@/templates/quotation/Modern"); break;
        case "QuotationMinimal":   TemplateModule = await import("@/templates/quotation/Minimal"); break;
        case "QuotationBold":      TemplateModule = await import("@/templates/quotation/Bold"); break;
        case "QuotationCorporate": TemplateModule = await import("@/templates/quotation/Corporate"); break;
        case "QuotationElegant":   TemplateModule = await import("@/templates/quotation/Elegant"); break;
        // Salary variants
        case "SalarySlip":
        case "SalarySlipClassic":   TemplateModule = await import("@/templates/salary/Classic"); break;
        case "SalarySlipModern":    TemplateModule = await import("@/templates/salary/Modern"); break;
        case "SalarySlipMinimal":   TemplateModule = await import("@/templates/salary/Minimal"); break;
        case "SalarySlipBold":      TemplateModule = await import("@/templates/salary/Bold"); break;
        case "SalarySlipCorporate": TemplateModule = await import("@/templates/salary/Corporate"); break;
        case "SalarySlipElegant":   TemplateModule = await import("@/templates/salary/Elegant"); break;
        // Certificate variants
        case "Certificate":
        case "CertificateClassic":   TemplateModule = await import("@/templates/certificate/Classic"); break;
        case "CertificateModern":    TemplateModule = await import("@/templates/certificate/Modern"); break;
        case "CertificateMinimal":   TemplateModule = await import("@/templates/certificate/Minimal"); break;
        case "CertificateRoyal":     TemplateModule = await import("@/templates/certificate/Royal"); break;
        case "CertificateCorporate": TemplateModule = await import("@/templates/certificate/Corporate"); break;
        case "CertificateElegant":   TemplateModule = await import("@/templates/certificate/Elegant"); break;
        // Experience Letter variants
        case "ExperienceLetter":
        case "ExperienceLetterClassic":   TemplateModule = await import("@/templates/experience/Classic"); break;
        case "ExperienceLetterModern":    TemplateModule = await import("@/templates/experience/Modern"); break;
        case "ExperienceLetterMinimal":   TemplateModule = await import("@/templates/experience/Minimal"); break;
        case "ExperienceLetterBold":      TemplateModule = await import("@/templates/experience/Bold"); break;
        case "ExperienceLetterCorporate": TemplateModule = await import("@/templates/experience/Corporate"); break;
        case "ExperienceLetterElegant":   TemplateModule = await import("@/templates/experience/Elegant"); break;
        // Other single templates
        case "Receipt":          TemplateModule = await import("@/templates/ReceiptTemplate"); break;
        // Resignation variants
        case "ResignationLetter":
        case "ResignationLetterClassic":   TemplateModule = await import("@/templates/resignation/Classic"); break;
        case "ResignationLetterModern":    TemplateModule = await import("@/templates/resignation/Modern"); break;
        case "ResignationLetterMinimal":   TemplateModule = await import("@/templates/resignation/Minimal"); break;
        case "ResignationLetterCorporate": TemplateModule = await import("@/templates/resignation/Corporate"); break;
        case "ResignationLetterElegant":   TemplateModule = await import("@/templates/resignation/Elegant"); break;
        // Job Offer variants
        case "JobOffer":
        case "JobOfferClassic":   TemplateModule = await import("@/templates/job-offer/Classic"); break;
        case "JobOfferModern":    TemplateModule = await import("@/templates/job-offer/Modern"); break;
        case "JobOfferMinimal":   TemplateModule = await import("@/templates/job-offer/Minimal"); break;
        case "JobOfferCorporate": TemplateModule = await import("@/templates/job-offer/Corporate"); break;
        case "JobOfferElegant":   TemplateModule = await import("@/templates/job-offer/Elegant"); break;
        // Internship variants
        case "Internship":
        case "InternshipClassic":   TemplateModule = await import("@/templates/internship/Classic"); break;
        case "InternshipModern":    TemplateModule = await import("@/templates/internship/Modern"); break;
        case "InternshipMinimal":   TemplateModule = await import("@/templates/internship/Minimal"); break;
        case "InternshipRoyal":     TemplateModule = await import("@/templates/internship/Royal"); break;
        case "InternshipElegant":   TemplateModule = await import("@/templates/internship/Elegant"); break;
        case "PurchaseOrder":    TemplateModule = await import("@/templates/PurchaseOrderTemplate"); break;
        case "PackingSlip":      TemplateModule = await import("@/templates/PackingSlipTemplate"); break;
        case "ProformaInvoice":  TemplateModule = await import("@/templates/ProformaInvoiceTemplate"); break;
        case "RentReceipt":      TemplateModule = await import("@/templates/RentReceiptTemplate"); break;
        case "PaymentVoucher":   TemplateModule = await import("@/templates/PaymentVoucherTemplate"); break;
        default: throw new Error("Unknown template: " + templateName);
      }
      const Template = TemplateModule.default;
      const element  = React.createElement(Template, { form });
      const blob     = await pdf(element).toBlob();
      const url      = URL.createObjectURL(blob);
      const link     = document.createElement("a");
      link.href      = url;
      link.download  = filename;
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

  return { download, downloading };
}
