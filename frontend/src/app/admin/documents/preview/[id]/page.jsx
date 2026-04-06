"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast, { Toaster } from "react-hot-toast";

// Import all preview components
import { InvoicePreview } from "@/app/invoice/page";
import { SalaryPreview } from "@/app/salary-slip/page";
import { CertificatePreview } from "@/app/certificate/page";
import { ReceiptPreview } from "@/app/receipt/page";
import { RentPreview } from "@/app/rent-receipt/page";
import { ExperiencePreview } from "@/app/experience-letter/page";
import { JobOfferPreview } from "@/app/job-offer-letter/page";
import { ResignationPreview } from "@/app/resignation-letter/page";
import { InternshipPreview } from "@/app/internship-certificate/page";
import { QuotationPreview } from "@/app/quotation/page";
import { ProformaPreview } from "@/app/proforma-invoice/page";
import { POPreview } from "@/app/purchase-order/page";
import { PackingPreview } from "@/app/packing-slip/page";
import { VoucherPreview } from "@/app/payment-voucher/page";

export default function AdminDocPreviewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!getAccessToken()) {
            router.push("/login");
            return;
        }

        adminApi.getDocument(id)
            .then(res => {
                setDoc(res.data?.data);
            })
            .catch(err => {
                console.error("Failed to fetch document:", err);
                toast.error("Failed to load document");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f9fafb" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #0D9488", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                    <p style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Loading secure preview...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!doc) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fff" }}>
                <p style={{ fontSize: "14px", color: "#EF4444", fontFamily: "Inter, sans-serif" }}>Document not found</p>
            </div>
        );
    }

    let formData = {};
    try {
        formData = JSON.parse(doc.formData || "{}");
    } catch (e) {
        console.error("Parse error", e);
    }

    // Map doc types to components
    const PreviewMap = {
        invoice: InvoicePreview,
        "salary-slip": SalaryPreview,
        certificate: CertificatePreview,
        receipt: ReceiptPreview,
        "rent-receipt": RentPreview,
        "experience-letter": ExperiencePreview,
        "job-offer-letter": JobOfferPreview,
        "resignation-letter": ResignationPreview,
        "internship-certificate": InternshipPreview,
        quotation: QuotationPreview,
        "proforma-invoice": ProformaPreview,
        "purchase-order": POPreview,
        "packing-slip": PackingPreview,
        "payment-voucher": VoucherPreview,
    };

    const PreviewComponent = PreviewMap[doc.docType];

    if (!PreviewComponent) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ color: "#EF4444" }}>Renderer not found for type: {doc.docType}</p>
            </div>
        );
    }

    return (
        <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: "20px" }}>
            <Toaster position="top-right" />
            <div style={{ maxWidth: "800px", margin: "0 auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                <PreviewComponent 
                    form={formData} 
                    template={doc.templateName || "Classic"} 
                    accent={formData.templateColor || "#0D9488"} 
                />
            </div>
        </div>
    );
}
