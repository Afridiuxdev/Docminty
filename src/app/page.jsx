"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import PricingCard from "@/components/PricingCard";
import { DOC_TYPES } from "@/constants/docTypes";
import {
    ChevronDown, Download, FileText,
    Archive, Smile, AlignLeft, Timer, Search, Star
} from "lucide-react";

const T = "#0D9488";
const TL = "#F0FDFA";
const TB = "#99F6E4";
const BG = "#F0F4F3";

const STATS = [
    { value: "10K+", label: "Documents Created" },
    { value: "2K+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "0.5s", label: "Avg Load Time" },
];

const FEATURES = [
    { icon: <FileText size={20} />, title: "Versatile document types", desc: "Create GST Invoices, Quotations, Receipts, Salary Slips, Certificates and more. Export as PDF — ready for print or email." },
    { icon: <Archive size={20} />, title: "Bulk batch processing", desc: "Upload a CSV with 100+ rows. DocMinty maps columns and generates all documents as a single ZIP file in minutes." },
    { icon: <Smile size={20} />, title: "GST auto-calculation", desc: "CGST, SGST & IGST calculated automatically. Supports intrastate and interstate with HSN/SAC code fields." },
    { icon: <AlignLeft size={20} />, title: "No-code, no sign-up", desc: "Our service is frictionless. Fill in your details, click download — your PDF is ready in under 60 seconds." },
    { icon: <Timer size={20} />, title: "Time efficiency", desc: "Fastest document tool for Indian businesses. Salary slips, invoices and certificates generated in seconds." },
    { icon: <Search size={20} />, title: "Verified certificates", desc: "Every certificate gets a unique QR code. Employers can scan to confirm authenticity instantly." },
];

const DOC_TABS = [
    { id: "finance", label: "Finance & Billing" },
    { id: "hr", label: "HR & Payroll" },
    { id: "letters", label: "Letters" },
    { id: "ops", label: "Operations" },
];

const DOC_GROUPS = {
    finance: [
        { id: "invoice", label: "GST INVOICE", description: "Tax invoice with CGST, SGST & IGST", icon: "📄", href: "/invoice" },
        { id: "quotation", label: "QUOTATION", description: "Price quotes for clients", icon: "💬", href: "/quotation" },
        { id: "receipt", label: "RECEIPT", description: "Payment receipt generator", icon: "🧾", href: "/receipt" },
        { id: "proforma-invoice", label: "PROFORMA INVOICE", description: "Advance billing document", icon: "📋", href: "/proforma-invoice" },
        { id: "rent-receipt", label: "RENT RECEIPT", description: "Monthly rent receipt for HRA", icon: "🏠", href: "/rent-receipt" },
        { id: "payment-voucher", label: "PAYMENT VOUCHER", description: "Internal payment records", icon: "💳", href: "/payment-voucher" },
    ],
    hr: [
        { id: "salary-slip", label: "SALARY SLIP", description: "Payslip with PF, TDS & allowances", icon: "💰", href: "/salary-slip" },
        { id: "certificate", label: "CERTIFICATE", description: "Bulk verified certificates with QR", icon: "🏆", href: "/certificate" },
        { id: "internship-certificate", label: "INTERNSHIP CERT", description: "Internship completion certificate", icon: "🎓", href: "/internship-certificate" },
        { id: "experience-letter", label: "EXPERIENCE LETTER", description: "HR experience certificates", icon: "✉️", href: "/experience-letter" },
        { id: "job-offer-letter", label: "JOB OFFER LETTER", description: "Formal offer letter template", icon: "🤝", href: "/job-offer-letter" },
    ],
    letters: [
        { id: "resignation-letter", label: "RESIGNATION LETTER", description: "Professional resignation format", icon: "📝", href: "/resignation-letter" },
        { id: "experience-letter", label: "EXPERIENCE LETTER", description: "HR experience certificates", icon: "✉️", href: "/experience-letter" },
        { id: "job-offer-letter", label: "JOB OFFER LETTER", description: "Formal offer letter template", icon: "🤝", href: "/job-offer-letter" },
    ],
    ops: [
        { id: "purchase-order", label: "PURCHASE ORDER", description: "PO for vendors and suppliers", icon: "🛒", href: "/purchase-order" },
        { id: "packing-slip", label: "PACKING SLIP", description: "Shipment packing list", icon: "📦", href: "/packing-slip" },
        { id: "proforma-invoice", label: "PROFORMA INVOICE", description: "Advance billing document", icon: "📋", href: "/proforma-invoice" },
    ],
};

const TEMPLATES = [
    {
        id: "invoice", label: "GST Invoice", icon: "📄", color: T,
        from: "Sharma Enterprises", gstin: "GSTIN: 27AABCU9603R1ZM",
        to: "Mehta Technologies Pvt. Ltd.",
        items: [
            { name: "Web Design Services", amt: "₹29,500" },
            { name: "SEO Optimization", amt: "₹9,440" },
            { name: "Hosting Setup", amt: "₹4,130" },
        ],
        rows: [["CGST @9%", "₹3,915"], ["SGST @9%", "₹3,915"]],
        total: "₹51,330",
    },
    {
        id: "salary-slip", label: "Salary Slip", icon: "💰", color: "#7C3AED",
        from: "TechStart Pvt. Ltd.", gstin: "Employee: Amit Kumar",
        to: "Sr. Software Developer",
        items: [
            { name: "Basic Salary", amt: "₹45,000" },
            { name: "HRA", amt: "₹18,000" },
            { name: "Employee PF", amt: "-₹1,800" },
        ],
        rows: [["Gross", "₹67,500"], ["Deductions", "₹2,000"]],
        total: "₹58,230",
    },
    {
        id: "certificate", label: "Certificate", icon: "🏆", color: "#D97706",
        from: "Reddy Academy", gstin: "ID: DM-ABC123",
        to: "Rahul Gupta",
        items: [
            { name: "Course", amt: "Full Stack Dev" },
            { name: "Duration", amt: "6 Months" },
            { name: "Grade", amt: "A+" },
        ],
        rows: [["Issued", "15 Mar 2026"], ["QR Verified", "Yes"]],
        total: "✓ Authentic",
    },
    {
        id: "quotation", label: "Quotation", icon: "💬", color: "#2563EB",
        from: "Arjun Design Studio", gstin: "GSTIN: 29AABCU9603R1ZX",
        to: "Nair Industries Ltd.",
        items: [
            { name: "UI Design", amt: "₹20,000" },
            { name: "Development", amt: "₹40,000" },
            { name: "Deployment", amt: "₹8,000" },
        ],
        rows: [["Subtotal", "₹68,000"], ["GST @18%", "₹12,240"]],
        total: "₹80,240",
    },
    {
        id: "receipt", label: "Receipt", icon: "🧾", color: "#059669",
        from: "Patel Enterprises", gstin: "Receipt: RCP-2026-001",
        to: "Sharma Consulting",
        items: [
            { name: "Consulting Fee", amt: "₹15,000" },
            { name: "GST @18%", amt: "₹2,700" },
            { name: "Mode", amt: "UPI" },
        ],
        rows: [["Date", "19 Mar 2026"], ["Status", "Paid"]],
        total: "₹17,700",
    },
];

const TESTIMONIALS = [
    { name: "Ramesh Singh", role: "Owner", company: "RS Logistics", rating: 5, short: "DocMinty transformed our billing. GST is always accurate.", full: "DocMinty transformed how we handle our billing. GST calculations are always accurate and we save hours every week. The interface is incredibly simple — even our accountant uses it now." },
    { name: "Priya Sharma", role: "HR Manager", company: "TechStart Pune", rating: 5, short: "50+ salary slips in 10 minutes with batch feature.", full: "We generate 50+ salary slips every month using the batch feature. What used to take a full day now takes 10 minutes. The CSV upload is seamless and the PDFs look completely professional." },
    { name: "Arjun Mehta", role: "Freelancer", company: "UI/UX Designer", rating: 5, short: "My clients are impressed with how professional invoices look.", full: "The invoice generator is incredibly clean. My clients are impressed with how professional my invoices look now. I used to spend 20 minutes on each invoice — now it takes 2 minutes." },
    { name: "Sunita Reddy", role: "Principal", company: "Reddy Academy", rating: 5, short: "QR verified certificates are brilliant — employers love it.", full: "The verified certificate feature with QR codes is brilliant. Parents and employers can instantly verify our certificates. We issued 200+ certificates in one batch — zero errors." },
    { name: "Vikram Nair", role: "CA", company: "Nair & Associates", rating: 5, short: "I recommend DocMinty to all clients. GST compliance is spot on.", full: "I recommend DocMinty to all my clients for invoicing. GST compliance is spot on every time. The CGST/SGST split and IGST logic works perfectly for interstate transactions." },
    { name: "Deepa Krishnan", role: "Founder", company: "DK Consultants", rating: 5, short: "Batch salary slips saved our HR team an entire day monthly.", full: "The batch salary slip feature saved our HR team an entire day every month. We upload one CSV with all employee data and download 30 salary slips as a ZIP. Absolutely brilliant." },
];

const PRICING_PLANS = [
    {
        plan: "Free", price: "₹0", period: "forever",
        description: "For freelancers and occasional document needs.",
        subNote: "No expiration date, use anytime.",
        includedFeatures: ["All 14 document types", "Unlimited PDF downloads", "Logo upload", "GST auto-calculation", "Basic templates"],
        notIncludedFeatures: ["Batch CSV processing", "Cloud document storage"],
        ctaLabel: "Get Started Free", ctaHref: "/invoice",
        highlighted: false,
    },
    {
        plan: "Business Pro", price: "₹199", originalPrice: "₹399", period: "/month",
        description: "Built for growing businesses with recurring document needs.",
        subNote: "2+ months free when billed annually.",
        includedFeatures: ["Everything in Free", "Batch CSV processing", "Cloud document storage", "Premium templates", "Priority support", "Custom branding & logo"],
        notIncludedFeatures: [],
        ctaLabel: "Start Free Trial", ctaHref: "/signup",
        promoCode: "DOCMINTY20",
        extraLink: "/batch", extraLinkLabel: "See Batch Processing →",
        highlighted: true,
    },
    {
        plan: "Enterprise", price: "Custom", period: "",
        description: "Lifetime access for large teams with no recurring bills.",
        subNote: "One-time payment, unlimited usage.",
        includedFeatures: ["Everything in Pro", "Custom branding", "API access", "Dedicated account manager", "SLA guarantee", "Custom templates"],
        notIncludedFeatures: [],
        ctaLabel: "Contact Us", ctaHref: "mailto:hello@docminty.com",
        promoCode: "DOCMINTY20",
        highlighted: false,
    },
];

const FAQS = [
    { q: "What is a GST invoice?", a: "A GST invoice is a legal document issued by a GST-registered business. It includes GSTIN, HSN/SAC codes, CGST, SGST or IGST breakup, and is required for claiming input tax credit." },
    { q: "Is DocMinty really free?", a: "Yes! Single document PDF downloads are completely free with no watermark. Pro features like batch processing, cloud saving, and premium templates require a paid plan." },
    { q: "Can I add my company logo?", a: "Absolutely. Upload any PNG or JPG logo — it will be automatically resized and placed perfectly on your document." },
    { q: "Is it GST-compliant for FY 2025-26?", a: "Yes. All tax rates, PF rules, and GST slabs are updated for FY 2025-26. CGST, SGST, and IGST are auto-calculated based on your state selection." },
    { q: "Can I save my documents for later?", a: "Cloud saving is available on the Pro plan. Free users can download PDFs immediately but documents are not stored on our servers." },
    { q: "Which formats can I download?", a: "All documents are available as PDF. Pro users can also export as HTML for presentations and sharing." },
];

// ── Sub components ────────────────────────────────────────────

function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: "1px solid #E5E7EB" }}>
            <button onClick={() => setOpen(!open)} className="faq-btn">
                <span style={{
                    fontSize: "15px", fontWeight: 600,
                    color: open ? T : "#111827",
                    fontFamily: "Space Grotesk, sans-serif",
                    transition: "color 150ms", textAlign: "left",
                }}>{q}</span>
                <div style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: open ? T : "#F3F4F6", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 200ms",
                }}>
                    <ChevronDown size={14} color={open ? "#fff" : "#6B7280"}
                        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
                    />
                </div>
            </button>
            {open && (
                <p style={{
                    fontSize: "14px", color: "#6B7280", lineHeight: 1.7,
                    margin: "0 0 16px", fontFamily: "Inter, sans-serif",
                }}>{a}</p>
            )}
        </div>
    );
}

function FeatureCard({ f }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: "36px 32px",
                borderRight: "1px solid #D1D5DB",
                borderBottom: "1px solid #D1D5DB",
                background: hovered ? TL : "#fff",
                transition: "background 200ms",
                cursor: "default",
            }}
        >
            <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: hovered ? T : TL,
                border: `1px solid ${hovered ? T : TB}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", transition: "all 200ms",
                color: hovered ? "#fff" : T,
            }}>
                {f.icon}
            </div>
            <h3 style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "16px", fontWeight: 700,
                color: "#111827", margin: "0 0 8px",
            }}>{f.title}</h3>
            <p style={{
                fontSize: "14px", color: "#6B7280",
                lineHeight: 1.65, margin: 0,
                fontFamily: "Inter, sans-serif",
            }}>{f.desc}</p>
        </div>
    );
}

function DocCard({ doc }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link href={doc.href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                padding: "16px",
                border: `1px solid ${hovered ? T : "#D1D5DB"}`,
                borderRadius: "10px",
                background: hovered ? TL : "#fff",
                textDecoration: "none",
                transition: "all 150ms",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered ? `0 4px 16px ${T}18` : "none",
            }}
        >
            <div style={{
                width: "36px", height: "36px", flexShrink: 0,
                borderRadius: "8px",
                background: hovered ? T : TL,
                border: `1px solid ${hovered ? T : TB}`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "16px",
                transition: "all 150ms",
            }}>
                {doc.icon}
            </div>
            <div>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "12px", fontWeight: 700,
                    color: hovered ? T : "#111827",
                    margin: "0 0 3px",
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    transition: "color 150ms",
                }}>{doc.label}</p>
                <p style={{
                    fontSize: "12px", color: "#9CA3AF",
                    margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.4,
                }}>{doc.description}</p>
            </div>
        </Link>
    );
}

function TemplateCard({ tmpl, active, onClick }) {
    return (
        <div onClick={onClick} style={{
            border: `2px solid ${active ? tmpl.color : "#E5E7EB"}`,
            borderRadius: "12px", overflow: "hidden",
            cursor: "pointer", transition: "all 200ms",
            boxShadow: active ? `0 8px 32px ${tmpl.color}22` : "none",
            transform: active ? "translateY(-4px)" : "translateY(0)",
            background: "#fff",
        }}>
            <div style={{
                background: tmpl.color, padding: "10px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <span style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "11px", color: "#fff",
                    letterSpacing: "0.05em",
                }}>{tmpl.label.toUpperCase()}</span>
                <span style={{
                    background: "rgba(255,255,255,0.2)", color: "#fff",
                    fontSize: "10px", fontWeight: 700,
                    padding: "2px 6px", borderRadius: "10px",
                    fontFamily: "Inter, sans-serif",
                }}>{tmpl.icon}</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "11px",
                    color: "#111827", margin: "0 0 1px",
                }}>{tmpl.from}</p>
                <p style={{
                    fontSize: "10px", color: "#9CA3AF",
                    margin: "0 0 6px", fontFamily: "Inter, sans-serif",
                }}>{tmpl.gstin}</p>
                <p style={{
                    fontSize: "10px", color: "#6B7280",
                    margin: "0 0 6px", fontFamily: "Inter, sans-serif",
                }}>To: {tmpl.to}</p>
                {tmpl.items.map((item, i) => (
                    <div key={i} style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "3px 0", borderBottom: "1px solid #F3F4F6",
                    }}>
                        <span style={{ fontSize: "10px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{item.name}</span>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{item.amt}</span>
                    </div>
                ))}
                <div style={{
                    marginTop: "6px", padding: "6px 8px",
                    background: "#F8F9FA", borderRadius: "4px",
                }}>
                    {tmpl.rows.map(([l, v], i) => (
                        <div key={i} style={{
                            display: "flex", justifyContent: "space-between", marginBottom: "2px",
                        }}>
                            <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{l}</span>
                            <span style={{ fontSize: "10px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{v}</span>
                        </div>
                    ))}
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        borderTop: "1px solid #E5E7EB", paddingTop: "4px", marginTop: "2px",
                    }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "#111827" }}>Total</span>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: tmpl.color, fontFamily: "Space Grotesk, sans-serif" }}>{tmpl.total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TestiCard({ t, active, onClick }) {
    return (
        <div onClick={onClick} style={{
            border: `1px solid ${active ? T : "#E5E7EB"}`,
            borderRadius: "12px", padding: "20px",
            background: active ? TL : "#fff",
            cursor: "pointer", transition: "all 200ms",
            transform: active ? "translateY(-3px)" : "translateY(0)",
            boxShadow: active ? `0 8px 24px ${T}18` : "none",
        }}>
            <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                ))}
            </div>
            <p style={{
                fontSize: "14px", color: "#374151", lineHeight: 1.6,
                margin: "0 0 14px", fontFamily: "Inter, sans-serif",
            }}>
                "{active ? t.full : t.short}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: active ? T : "#E5E7EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700,
                    color: active ? "#fff" : "#6B7280",
                    fontFamily: "Space Grotesk, sans-serif",
                    transition: "all 200ms", flexShrink: 0,
                }}>
                    {t.name.charAt(0)}
                </div>
                <div>
                    <p style={{
                        fontSize: "13px", fontWeight: 700, color: "#111827",
                        margin: 0, fontFamily: "Space Grotesk, sans-serif",
                    }}>{t.name}</p>
                    <p style={{
                        fontSize: "11px", color: "#9CA3AF",
                        margin: 0, fontFamily: "Inter, sans-serif",
                    }}>{t.role}, {t.company}</p>
                </div>
                {active && (
                    <span style={{
                        marginLeft: "auto", fontSize: "11px",
                        color: T, fontFamily: "Inter, sans-serif", fontWeight: 600,
                    }}>
                        Read less ↑
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function LandingPage() {
    const [selectedDoc, setSelectedDoc] = useState("invoice");
    const [docTab, setDocTab] = useState("finance");
    const [activeTemplate, setActiveTemplate] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(null);

    return (
        <>
            <Navbar />

            {/* ── HERO ── */}
            <section style={{ background: "#fff", padding: "64px 24px 72px" }}>
                <div className="hero-grid" style={{
                    maxWidth: "1100px", margin: "0 auto",
                    display: "grid", gridTemplateColumns: "1fr 380px",
                    gap: "56px", alignItems: "center",
                }}>
                    <div>
                        <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: "0 0 14px" }}>
                            Updated: Mar 2026
                        </p>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "clamp(28px, 3.2vw, 44px)",
                            fontWeight: 700, color: "#111827",
                            lineHeight: 1.15, margin: "0 0 18px", letterSpacing: "-0.5px",
                        }}>
                            Turn business details into{" "}
                            <span style={{ color: T }}>GST-ready documents</span>{" "}
                            in seconds.
                        </h1>
                        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "28px" }}>
                            {[
                                "Generate invoices, quotations, receipts & salary slips.",
                                "GST-compliant with CGST, SGST, IGST auto-calculation.",
                                "Export to PDF instantly — no sign-up, no watermark.",
                            ].map((p, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <span style={{ color: T, fontWeight: 700, flexShrink: 0, fontSize: "15px", lineHeight: "1.5" }}>·</span>
                                    <span style={{ fontSize: "15px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{p}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                            <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}
                                className="hero-select">
                                {DOC_TYPES.map((d) => (
                                    <option key={d.id} value={d.id}>{d.label}</option>
                                ))}
                            </select>
                            <Link href={`/${selectedDoc}`} className="hero-cta">
                                Start for free
                            </Link>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                            {["✓ Invoice", "✓ Quotation", "✓ Receipt", "✓ Salary Slip", "✓ Certificate"].map((item) => (
                                <span key={item} style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{item}</span>
                            ))}
                            <span style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>&nbsp;Used by 10,000+</span>
                        </div>
                    </div>

                    {/* Hero mockup */}
                    <div className="hero-mockup">
                        <div style={{
                            border: "1px solid #E5E7EB", borderRadius: "12px",
                            overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                        }}>
                            <div style={{
                                background: T, padding: "12px 18px",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#fff" }}>GST INVOICE</span>
                                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif" }}>#INV-2026-001</span>
                            </div>
                            <div style={{ padding: "16px 18px", background: "#fff" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <div>
                                        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#111827", margin: 0 }}>Sharma Enterprises</p>
                                        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>GSTIN: 27AABCU9603R1ZM</p>
                                    </div>
                                    <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>19 Mar 2026</p>
                                </div>
                                {[["Web Design", "₹29,500"], ["SEO Services", "₹9,440"], ["Hosting", "₹4,130"]].map(([n, a], i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #F3F4F6" }}>
                                        <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{n}</span>
                                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{a}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: "10px", padding: "10px", background: "#F8F9FA", borderRadius: "6px" }}>
                                    {[["CGST @9%", "₹3,285"], ["SGST @9%", "₹3,285"]].map(([l, v], i) => (
                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                            <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{l}</span>
                                            <span style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{v}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E5E7EB", paddingTop: "6px", marginTop: "4px" }}>
                                        <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "#111827" }}>Total</span>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>₹43,070</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: "12px", background: T, borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}>↓ Download PDF — Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AD 1 */}
            <div style={{ borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", background: "#fff" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
                    <AdSense adSlot="SLOT_ID_1" />
                </div>
            </div>

            {/* ── EVERYTHING YOU NEED ── */}
            <section style={{ background: BG }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 0" }}>
                    <h2 className="section-title" style={{ padding: "0 24px" }}>
                        Everything you need to work with business documents
                    </h2>
                    <p className="section-sub" style={{ padding: "0 24px" }}>
                        Powerful tools designed for Indian freelancers, businesses and HR teams.
                    </p>
                    <div className="features-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                        borderTop: "1px solid #D1D5DB", borderLeft: "1px solid #D1D5DB",
                    }}>
                        {FEATURES.map((f, i) => <FeatureCard key={i} f={f} />)}
                    </div>
                </div>
            </section>

            {/* ── PICK YOUR DOCUMENT ── */}
            <section style={{ background: BG, borderTop: "1px solid #D1D5DB" }}>
                <div className="section-wrap">
                    <h2 className="section-title">Pick your document type</h2>
                    <p className="section-sub">Each tool is optimised for a specific business need.</p>

                    {/* Tabs */}
                    <div style={{
                        display: "flex", gap: "8px", flexWrap: "wrap",
                        justifyContent: "center", marginBottom: "24px",
                    }}>
                        {DOC_TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setDocTab(tab.id)}
                                className={docTab === tab.id ? "tab-active" : "tab-inactive"}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="docs-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px",
                    }}>
                        {DOC_GROUPS[docTab].map((doc) => (
                            <DocCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DOCUMENT PREVIEW ── */}
            <section style={{ background: BG, borderTop: "1px solid #D1D5DB" }}>
                <div className="section-wrap">
                    <h2 className="section-title">Document preview</h2>
                    <p className="section-sub">Clean, structured data ready for your document pipeline.</p>

                    <div style={{
                        display: "flex", border: "1px solid #D1D5DB",
                        borderRadius: "12px", overflow: "hidden", background: "#fff",
                    }} className="preview-container">

                        {/* Sidebar */}
                        <div style={{
                            width: "200px", flexShrink: 0,
                            borderRight: "1px solid #E5E7EB",
                            padding: "16px 0", display: "flex", flexDirection: "column",
                        }}>
                            <p style={{
                                fontSize: "11px", fontWeight: 700, color: "#9CA3AF",
                                textTransform: "uppercase", letterSpacing: "0.08em",
                                padding: "0 16px", margin: "0 0 12px",
                                fontFamily: "Inter, sans-serif",
                            }}>SELECT FORMAT</p>

                            {TEMPLATES.map((tmpl, i) => (
                                <button key={tmpl.id} onClick={() => setActiveTemplate(i)}
                                    className={activeTemplate === i ? "sidebar-item-active" : "sidebar-item"}>
                                    <span style={{ fontSize: "15px" }}>{tmpl.icon}</span>
                                    <span>{tmpl.label}</span>
                                </button>
                            ))}

                            <div style={{ marginTop: "auto", padding: "16px" }}>
                                <Link href={`/${TEMPLATES[activeTemplate].id}`} className="download-btn">
                                    <Download size={13} /> DOWNLOAD SAMPLE
                                </Link>
                                <p style={{
                                    fontSize: "11px", color: "#9CA3AF",
                                    textAlign: "center", margin: "6px 0 0",
                                    fontFamily: "Inter, sans-serif",
                                }}>Free — No sign-up required</p>
                            </div>
                        </div>

                        {/* Template grid */}
                        <div style={{ flex: 1, padding: "24px", background: BG, overflowX: "auto" }}>
                            <p style={{
                                fontSize: "12px", fontWeight: 600, color: "#6B7280",
                                fontFamily: "Inter, sans-serif", margin: "0 0 16px",
                            }}>
                                {TEMPLATES[activeTemplate].label} — Sample Preview
                            </p>
                            <div className="template-grid" style={{
                                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px",
                            }}>
                                {TEMPLATES.map((tmpl, i) => (
                                    <TemplateCard
                                        key={tmpl.id} tmpl={tmpl}
                                        active={activeTemplate === i}
                                        onClick={() => setActiveTemplate(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{
                background: BG, borderTop: "1px solid #D1D5DB",
                backgroundImage: "radial-gradient(circle, #C7D5D3 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}>
                <div className="section-wrap">
                    <h2 className="section-title">How it works</h2>

                    <div style={{ position: "relative" }}>
                        <div className="hide-mobile" style={{
                            position: "absolute", left: "50%", top: "24px", bottom: "24px",
                            width: "1px", background: "#D1D5DB", transform: "translateX(-50%)",
                        }} />

                        {[
                            {
                                num: "1", title: "1. Select your document type",
                                desc: "Choose from 14 document types — Invoice, Salary Slip, Certificate, Quotation and more.",
                                tip: { icon: "💡", label: "Pro tip:", text: "Works best with GST-registered Indian businesses." },
                                tipSide: "right",
                            },
                            {
                                num: "2", title: "2. Fill in your business details",
                                desc: "Enter your business info, client details, and line items. GST is calculated automatically.",
                                tip: { icon: "⚡", label: "Fast processing:", text: "Most documents complete in seconds — even large payrolls." },
                                tipSide: "left",
                            },
                            {
                                num: "3", title: "3. Download your PDF instantly",
                                desc: "Get a clean, professional PDF in one click. Share via WhatsApp, email, or print directly.",
                                tip: { icon: "📄", label: "Rich data:", text: "GST breakup and metadata preserved for accuracy." },
                                tipSide: "right",
                            },
                        ].map((step, i) => (
                            <div key={i} className="step-row-3col" style={{
                                display: "grid", gridTemplateColumns: "1fr 80px 1fr",
                                gap: "24px", alignItems: "center",
                                marginBottom: i < 2 ? "48px" : "0",
                            }}>
                                <div style={{ textAlign: step.tipSide === "right" ? "right" : "left" }}>
                                    {step.tipSide === "right" ? (
                                        <>
                                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 10px", textAlign: "right" }}>{step.title}</h3>
                                            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, margin: 0, fontFamily: "Inter, sans-serif", textAlign: "right" }}>{step.desc}</p>
                                        </>
                                    ) : (
                                        <div className="tip-box">
                                            <span style={{ fontSize: "16px", flexShrink: 0 }}>{step.tip.icon}</span>
                                            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0, fontFamily: "Inter, sans-serif" }}>
                                                <strong style={{ color: T }}>{step.tip.label}</strong> {step.tip.text}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
                                    <div className="step-circle">
                                        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>{step.num}</span>
                                    </div>
                                </div>

                                <div>
                                    {step.tipSide === "right" ? (
                                        <div className="tip-box">
                                            <span style={{ fontSize: "16px", flexShrink: 0 }}>{step.tip.icon}</span>
                                            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0, fontFamily: "Inter, sans-serif" }}>
                                                <strong style={{ color: T }}>{step.tip.label}</strong> {step.tip.text}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>{step.title}</h3>
                                            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, margin: 0, fontFamily: "Inter, sans-serif" }}>{step.desc}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AD 2 */}
            <div style={{ borderTop: "1px solid #D1D5DB", borderBottom: "1px solid #D1D5DB", background: "#fff" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
                    <AdSense adSlot="SLOT_ID_2" />
                </div>
            </div>

            {/* ── STATS ── */}
            <section style={{ background: "#134E4A" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "52px 24px" }}>
                    <div className="stats-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                        gap: "24px", textAlign: "center",
                    }}>
                        {STATS.map((s, i) => (
                            <div key={i} className="stat-item">
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontSize: "clamp(28px,3vw,40px)",
                                    fontWeight: 700, color: TB,
                                    margin: "0 0 4px", lineHeight: 1,
                                }}>{s.value}</p>
                                <p style={{ fontSize: "13px", color: "#99F6E4", margin: 0, fontFamily: "Inter, sans-serif" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ background: BG, borderTop: "1px solid #D1D5DB" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 24px" }}>
                    <h2 className="section-title">Hear what our customers say</h2>
                    <p className="section-sub">Discover the stories of delighted customers and their experiences.</p>
                    <p style={{
                        fontSize: "13px", color: T, textAlign: "center",
                        margin: "0 auto 32px", fontFamily: "Inter, sans-serif", fontWeight: 600,
                    }}>
                        Click any review to read the full story →
                    </p>
                    <div className="testimonial-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "16px",
                    }}>
                        {TESTIMONIALS.slice(0, 3).map((t, i) => (
                            <TestiCard key={i} t={t}
                                active={activeTestimonial === i}
                                onClick={() => setActiveTestimonial(activeTestimonial === i ? null : i)}
                            />
                        ))}
                    </div>
                    <div className="testimonial-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px",
                    }}>
                        {TESTIMONIALS.slice(3, 6).map((t, i) => (
                            <TestiCard key={i + 3} t={t}
                                active={activeTestimonial === i + 3}
                                onClick={() => setActiveTestimonial(activeTestimonial === i + 3 ? null : i + 3)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section style={{ background: "#fff", borderTop: "1px solid #D1D5DB" }}>
                <div className="section-wrap">
                    <h2 className="section-title">Simple, transparent pricing</h2>
                    <p className="section-sub">Free forever for individual use. Upgrade when you need more.</p>
                    <div className="pricing-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", alignItems: "start",
                    }}>
                        {PRICING_PLANS.map((plan, i) => <PricingCard key={i} {...plan} />)}
                    </div>

                    {/* Trust bar */}
                    <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ display: "flex", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>100%</span>
                            <span style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>positive reviews</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            {[["#00B67A", "★", "Trustpilot"], ["#4285F4", "G", "Google"]].map(([c, ic, label]) => (
                                <div key={label} className="trust-badge">
                                    <span style={{ color: c, fontSize: "14px", fontWeight: 700 }}>{ic}</span>
                                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>{label}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ display: "flex" }}>
                                {["RS", "PS", "AM", "SR", "VN", "DK", "RG", "AS"].map((init, i) => (
                                    <div key={i} className="avatar" style={{
                                        background: `hsl(${i * 45},60%,55%)`,
                                        marginLeft: i === 0 ? "0" : "-8px",
                                        zIndex: 8 - i,
                                    }}>
                                        {init}
                                    </div>
                                ))}
                            </div>
                            <span style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                                and <strong style={{ color: "#111827" }}>10,000+</strong> more happy users
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={{ background: BG, borderTop: "1px solid #D1D5DB" }}>
                <div className="section-wrap" style={{ maxWidth: "680px" }}>
                    <h2 className="section-title">Frequently asked questions</h2>
                    <p className="section-sub">Everything you need to know about DocMinty.</p>
                    {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section style={{ background: "#134E4A", padding: "72px 24px" }}>
                <div className="cta-grid" style={{
                    maxWidth: "900px", margin: "0 auto",
                    display: "grid", gridTemplateColumns: "1fr auto",
                    gap: "40px", alignItems: "center",
                }}>
                    <div>
                        <h2 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "clamp(24px,3vw,36px)",
                            fontWeight: 700, color: "#fff",
                            margin: "0 0 12px", lineHeight: 1.2,
                        }}>Ready to save 10+ hours every week?</h2>
                        <p style={{
                            fontSize: "15px", color: "#99F6E4",
                            margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.6,
                        }}>
                            Join 10,000+ Indian businesses automating their document workflows.
                        </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        <Link href="/invoice" className="cta-btn">
                            Get Started for Free →
                        </Link>
                        <p style={{
                            fontSize: "12px", color: "#5EEAD4",
                            margin: "8px 0 0", textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                        }}>No credit card · GST-compliant</p>
                    </div>
                </div>
            </section>

            <AdSense adSlot="SLOT_ID_3" sidebarFixed />
            <Footer />
        </>
    );
}