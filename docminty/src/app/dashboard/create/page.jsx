"use client";
import Link from "next/link";
import DashHeader from "@/components/dashboard/DashHeader";
import {
    FileText, FileQuestion, Receipt, ShoppingCart, Box, CreditCard, Home,
    Banknote, Briefcase, LogOut, Mail, Award, GraduationCap, QrCode,
    Zap, PlusSquare, Scissors, Minimize, FileInput, FileOutput, Image,
    Calculator, Percent, BadgeIndianRupee, TrendingUp, Coins, BarChart3, Tag,
    Package, Scroll, Handshake, Book
} from "lucide-react";

const T = "#0D9488";

const DOC_CATEGORIES = [
    {
        category: "Finance & Business",
        docs: [
            { label: "Invoice", href: "/invoice", icon: FileText, desc: "Professional GST & non-GST invoices", badge: "Most Used" },
            { label: "Quotation", href: "/quotation", icon: FileQuestion, desc: "Professional price quotations", badge: "" },
            { label: "Receipt", href: "/receipt", icon: Receipt, desc: "Payment receipts for any transaction", badge: "" },
            { label: "Proforma Invoice", href: "/proforma-invoice", icon: FileText, desc: "Pre-billing document with advance", badge: "" },
            { label: "Purchase Order", href: "/purchase-order", icon: ShoppingCart, desc: "PO for vendors and suppliers", badge: "" },
            { label: "Packing Slip", href: "/packing-slip", icon: Box, desc: "Shipment packing lists with tracking", badge: "" },
            { label: "Rent Receipt", href: "/rent-receipt", icon: Home, desc: "HRA valid monthly rent receipts", badge: "HRA Valid" },
            { label: "Payment Voucher", href: "/payment-voucher", icon: CreditCard, desc: "Internal payment and cash records", badge: "" },
        ],
    },
    {
        category: "HR & Legal",
        docs: [
            { label: "Salary Slip", href: "/salary-slip", icon: Banknote, desc: "Payslip with PF, ESI, TDS auto-calc", badge: "Popular" },
            { label: "Experience Letter", href: "/experience-letter", icon: Briefcase, desc: "Employment experience certificates", badge: "" },
            { label: "Job Offer Letter", href: "/job-offer-letter", icon: Mail, desc: "Formal offer letters for new candidates", badge: "" },
            { label: "Resignation Letter", href: "/resignation-letter", icon: LogOut, desc: "Professional resignation formats", badge: "" },
            { label: "Internship Certificate", href: "/internship-certificate", icon: GraduationCap, desc: "Internship completion certificate", badge: "QR Verified" },
            { label: "Certificate", href: "/certificate", icon: Award, desc: "General achievement certificates", badge: "QR Verified" },
        ],
    },
    {
        category: "PDF & Productivity",
        docs: [
            { label: "Batch Processor", href: "/batch", icon: Zap, desc: "Process thousands of docs at once", badge: "Pro" },
            { label: "QR Generator", href: "/tools/qr-generator", icon: QrCode, desc: "Custom QR codes for any use", badge: "" },
            { label: "Merge PDF", href: "/tools/merge-pdf", icon: PlusSquare, desc: "Combine multiple PDFs into one", badge: "" },
            { label: "Split PDF", href: "/tools/split-pdf", icon: Scissors, desc: "Extract pages from your PDF", badge: "" },
            { label: "Compress PDF", href: "/tools/compress-pdf", icon: Minimize, desc: "Reduce PDF file size instantly", badge: "" },
            { label: "PDF to Word", href: "/tools/pdf-to-word", icon: FileOutput, desc: "Convert PDF to editable Word", badge: "" },
            { label: "Word to PDF", href: "/tools/word-to-pdf", icon: FileInput, desc: "Turn Word docs into clean PDFs", badge: "" },
            { label: "PDF to JPG", href: "/tools/pdf-to-jpg", icon: Image, desc: "Extract images from your PDF", badge: "" },
            { label: "JPG to PDF", href: "/tools/jpg-to-pdf", icon: FileText, desc: "Convert images to PDF format", badge: "" },
        ],
    },
    {
        category: "Smart Calculators",
        docs: [
            { label: "EMI Calculator", href: "/calculators/emi-calculator", icon: Calculator, desc: "Calculate monthly loan payments", badge: "" },
            { label: "GST Calculator", href: "/calculators/gst-calculator", icon: Percent, desc: "Inclusive/Exclusive GST auto-calc", badge: "" },
            { label: "Salary Calculator", href: "/calculators/salary-calculator", icon: BadgeIndianRupee, desc: "Gross to Net salary breakdown", badge: "" },
            { label: "Interest Calculator", href: "/calculators/interest-calculator", icon: TrendingUp, desc: "Simple & Compound interest", badge: "" },
            { label: "Loan Calculator", href: "/calculators/loan-calculator", icon: Coins, desc: "Advanced tool for home/car loans", badge: "" },
            { label: "Profit Margin", href: "/calculators/profit-margin-calculator", icon: BarChart3, desc: "Calculate markup & profit margins", badge: "" },
            { label: "Discount Calc", href: "/calculators/discount-calculator", icon: Tag, desc: "Quickly find final sale price", badge: "" },
        ],
    },
];

const BADGE_COLORS = {
    "Most Used": { bg: "#F0FDFA", color: T },
    "Popular": { bg: "#F5F3FF", color: "#7C3AED" },
    "QR Verified": { bg: "#ECFDF5", color: "#10B981" },
    "HRA Valid": { bg: "#EFF6FF", color: "#3B82F6" },
    "Pro": { bg: "#FFFBEB", color: "#D97706" },
};

export default function DashCreatePage() {
    return (
        <>
            <style>{`
                .create-container { padding: 24px; }
                .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
                
                @media (max-width: 640px) {
                    .create-container { padding: 16px; }
                    .cat-grid { grid-template-columns: 1fr; }
                    .doc-card { flex-direction: row !important; align-items: center !important; padding: 12px !important; gap: 12px !important; }
                    .doc-card-icon { width: 40px !important; height: 40px !important; margin-bottom: 0 !important; }
                    .doc-card-icon svg { width: 20px !important; height: 20px !important; }
                    .doc-card-badge { top: 8px !important; right: 8px !important; font-size: 8px !important; padding: 1px 5px !important; }
                    .doc-card-desc { display: none; }
                }
            `}</style>

            <DashHeader
                title="Create New Document"
                subtitle="Choose a document type to get started"
            />
            
            <div className="create-container">
                {DOC_CATEGORIES.map((cat, ci) => (
                    <div key={ci} style={{ marginBottom: "28px" }}>
                        <h2 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "13px", fontWeight: 700,
                            color: "#9CA3AF", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 12px",
                        }}>{cat.category}</h2>
                        <div className="cat-grid">
                            {cat.docs.map((doc, di) => {
                                const badge = BADGE_COLORS[doc.badge];
                                return (
                                    <Link key={di} href={doc.href} 
                                        className="doc-card"
                                        style={{
                                            display: "flex", flexDirection: "column",
                                            gap: "10px", padding: "16px",
                                            background: "#fff",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "12px",
                                            textDecoration: "none",
                                            transition: "all 150ms",
                                            position: "relative",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = T;
                                            e.currentTarget.style.background = "#F0FDFA";
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = `0 4px 14px ${T}18`;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "#E5E7EB";
                                            e.currentTarget.style.background = "#fff";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {badge && (
                                            <span className="doc-card-badge" style={{
                                                position: "absolute", top: "10px", right: "10px",
                                                background: badge.bg, color: badge.color,
                                                fontSize: "9px", fontWeight: 700,
                                                padding: "2px 7px", borderRadius: "10px",
                                                fontFamily: "Inter, sans-serif",
                                                letterSpacing: "0.04em",
                                            }}>{doc.badge}</span>
                                        )}
                                        <div className="doc-card-icon" style={{
                                            width: "48px", height: "48px",
                                            background: "#F0FDFA",
                                            borderRadius: "12px",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid #CCFBF1",
                                            marginBottom: "4px"
                                        }}>
                                            <doc.icon size={28} color={T} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p style={{
                                                fontFamily: "Space Grotesk, sans-serif",
                                                fontWeight: 700, fontSize: "13px",
                                                color: "#111827", margin: "0 0 4px",
                                            }}>{doc.label}</p>
                                            <p className="doc-card-desc" style={{
                                                fontSize: "11px", color: "#9CA3AF",
                                                fontFamily: "Inter, sans-serif",
                                                margin: 0, lineHeight: 1.4,
                                            }}>{doc.desc}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}