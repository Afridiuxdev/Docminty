import React from "react";
import SEOLandingTemplate from "@/components/SEOLandingTemplate";
import { FileText, FileQuestion, Receipt, ShoppingCart, Box, CreditCard, Home, ClipboardList } from "lucide-react";

export const metadata = {
    title: "Free GST Invoice Generator & Business Document Creator | DocMinty",
    description: "Create professional GST invoices, quotations, receipts, and purchase orders for free. No signup required. Instant PDF download for Indian businesses.",
};

const BusinessDocumentsPage = () => {
    const tools = [
        { 
            title: "GST Invoice", 
            description: "Compliance-ready GST invoices with CGST, SGST & IGST auto-calculation.", 
            icon: <FileText size={20} />, 
            href: "/invoice",
            badge: "Popular"
        },
        { 
            title: "Quotation", 
            description: "Convert leads into clients with professional price quotes and estimates.", 
            icon: <FileQuestion size={20} />, 
            href: "/quotation",
            badge: "Popular"
        },
        { 
            title: "Receipt", 
            description: "Generate payment receipts instantly for your customers and clients.", 
            icon: <Receipt size={20} />, 
            href: "/receipt",
            badge: "Popular"
        },
        { 
            title: "Proforma Invoice", 
            description: "Estimate billing for orders before they are finalized.", 
            icon: <ClipboardList size={20} />, 
            href: "/proforma-invoice" 
        },
        { 
            title: "Purchase Order", 
            description: "Formal document sent to vendors to track your business orders.", 
            icon: <ShoppingCart size={20} />, 
            href: "/purchase-order" 
        },
        { 
            title: "Packing Slip", 
            description: "Include a professional shipment list with every order you send.", 
            icon: <Box size={20} />, 
            href: "/packing-slip" 
        },
        { 
            title: "Payment Voucher", 
            description: "Record internal business payments for accounting and audits.", 
            icon: <CreditCard size={20} />, 
            href: "/payment-voucher" 
        },
        { 
            title: "Rent Receipt", 
            description: "Generate monthly rent receipts for employee HRA tax exemptions.", 
            icon: <Home size={20} />, 
            href: "/rent-receipt" 
        },
    ];

    const howItWorks = [
        {
            title: "1. Select document type",
            desc: "Choose from our suite of business documents like GST Invoices, Quotations, or Purchase Orders.",
            tip: { icon: "📊", label: "Tax Ready:", text: "All documents are pre-formatted for Indian GST compliance." },
            tipSide: "right",
        },
        {
            num: "2", title: "2. Enter business details",
            desc: "Fill in your client details, line items, and tax rates. Our engine calculates totals automatically.",
            tip: { icon: "⚡", label: "Auto-Save:", text: "Your progress is saved in your browser as you type." },
            tipSide: "left",
        },
        {
            num: "3", title: "3. Download professional PDF",
            desc: "Preview your document in real-time and download a high-quality PDF ready for sharing or printing.",
            tip: { icon: "📄", label: "No Watermark:", text: "Download clean documents with your own business logo." },
            tipSide: "right",
        },
    ];

    const stats = [
        { num: "10", suffix: "K+", label: "Invoices Generated", decimals: 0 },
        { num: "5", suffix: "K+", label: "Quotations Sent", decimals: 0 },
        { num: "99.9", suffix: "%", label: "Precision Rate", decimals: 1 },
        { num: "0.5", suffix: "s", label: "Download Speed", decimals: 1 },
    ];

    const faqs = [
        { 
            q: "Is DocMinty really free for business documents?", 
            a: "Yes! You can create and download all business documents like invoices, quotations, and receipts for free. We also offer a PRO plan for advanced templates." 
        },
        { 
            q: "Are the invoices GST compliant for Indian businesses?", 
            a: "Absolutely. Our templates include fields for GSTIN, HSN codes, and auto-calculate SGST, CGST, and IGST based on your location." 
        },
        { 
            q: "Do I need to sign up to create a quotation?", 
            a: "No. DocMinty is designed for speed. Just enter your details, preview the document, and download your PDF instantly." 
        },
        { 
            q: "Can I add my business logo to the documents?", 
            a: "Yes, all our templates allow you to upload your business logo to ensure a professional look." 
        },
        { 
            q: "Is my business data secure?", 
            a: "We prioritize privacy. Your data is used only to generate the PDF in your browser and is never stored on our servers." 
        },
        { 
            q: "Can I create documents on my mobile phone?", 
            a: "Yes, DocMinty is fully mobile-responsive. You can generate and download documents on the go from any device." 
        }
    ];

    return (
        <SEOLandingTemplate 
            title="Free GST Invoice Generator & Business Document Creator"
            subtitle="Professional invoices, quotations, and receipts for your business. Compliant, fast, and 100% free."
            tools={tools}
            howItWorks={howItWorks}
            stats={stats}
            faqs={faqs}
            heroCta="Start Creating Now"
            finalCtaTitle="Ready to save 10+ hours on business billing?"
            finalCtaSubtitle="Join 10,000+ Indian businesses automating their invoicing and professional document workflows."
        />
    );
};

export default BusinessDocumentsPage;
