"use client";
import Link from "next/link";
import DashHeader from "@/components/dashboard/DashHeader";

const T = "#0D9488";

const DOC_CATEGORIES = [
    {
        category: "Finance & GST",
        docs: [
            { label: "GST Invoice", href: "/invoice", icon: "📄", desc: "Tax invoice with CGST/SGST/IGST", badge: "Most Used" },
            { label: "Quotation", href: "/quotation", icon: "💬", desc: "Professional price quotation", badge: "" },
            { label: "Receipt", href: "/receipt", icon: "🧾", desc: "Payment receipt for any transaction", badge: "" },
            { label: "Proforma Invoice", href: "/proforma-invoice", icon: "📋", desc: "Pre-billing document with advance", badge: "" },
            { label: "Purchase Order", href: "/purchase-order", icon: "🛒", desc: "PO for vendors and suppliers", badge: "" },
            { label: "Payment Voucher", href: "/payment-voucher", icon: "💳", desc: "Internal payment records", badge: "" },
        ],
    },
    {
        category: "HR & Employee",
        docs: [
            { label: "Salary Slip", href: "/salary-slip", icon: "💰", desc: "Payslip with PF, ESI, TDS auto-calc", badge: "Popular" },
            { label: "Experience Letter", href: "/experience-letter", icon: "📜", desc: "Employment experience certificate", badge: "" },
            { label: "Job Offer Letter", href: "/job-offer-letter", icon: "🤝", desc: "Offer letter with CTC breakdown", badge: "" },
            { label: "Resignation Letter", href: "/resignation-letter", icon: "👋", desc: "Professional resignation format", badge: "" },
        ],
    },
    {
        category: "Certificates",
        docs: [
            { label: "Certificate", href: "/certificate", icon: "🏆", desc: "Achievement, completion certificates", badge: "QR Verified" },
            { label: "Internship Certificate", href: "/internship-certificate", icon: "🎓", desc: "Internship completion certificate", badge: "QR Verified" },
        ],
    },
    {
        category: "Shipping & Property",
        docs: [
            { label: "Packing Slip", href: "/packing-slip", icon: "📦", desc: "Shipment packing list with tracking", badge: "" },
            { label: "Rent Receipt", href: "/rent-receipt", icon: "🏠", desc: "HRA valid monthly rent receipt", badge: "HRA Valid" },
        ],
    },
];

const BADGE_COLORS = {
    "Most Used": { bg: "#F0FDFA", color: T },
    "Popular": { bg: "#F5F3FF", color: "#7C3AED" },
    "QR Verified": { bg: "#ECFDF5", color: "#10B981" },
    "HRA Valid": { bg: "#EFF6FF", color: "#3B82F6" },
};

export default function DashCreatePage() {
    return (
        <>
            <DashHeader
                title="Create New Document"
                subtitle="Choose a document type to get started"
            />
            <div style={{ padding: "24px" }}>
                {DOC_CATEGORIES.map((cat, ci) => (
                    <div key={ci} style={{ marginBottom: "28px" }}>
                        <h2 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "13px", fontWeight: 700,
                            color: "#9CA3AF", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 12px",
                        }}>{cat.category}</h2>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "12px",
                        }}>
                            {cat.docs.map((doc, di) => {
                                const badge = BADGE_COLORS[doc.badge];
                                return (
                                    <Link key={di} href={doc.href} style={{
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
                                            <span style={{
                                                position: "absolute", top: "10px", right: "10px",
                                                background: badge.bg, color: badge.color,
                                                fontSize: "9px", fontWeight: 700,
                                                padding: "2px 7px", borderRadius: "10px",
                                                fontFamily: "Inter, sans-serif",
                                                letterSpacing: "0.04em",
                                            }}>{doc.badge}</span>
                                        )}
                                        <span style={{ fontSize: "28px" }}>{doc.icon}</span>
                                        <div>
                                            <p style={{
                                                fontFamily: "Space Grotesk, sans-serif",
                                                fontWeight: 700, fontSize: "13px",
                                                color: "#111827", margin: "0 0 4px",
                                            }}>{doc.label}</p>
                                            <p style={{
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