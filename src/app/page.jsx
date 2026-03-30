"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import PricingCard from "@/components/PricingCard";
import { DOC_TYPES as PREVIEW_DOC_TYPES } from "@/constants/docTypes";
import {
    ChevronDown, Download, FileText,
    Archive, Smile, AlignLeft, Timer, Search, Star
} from "lucide-react";
import WatermarkOverlay from "@/components/WatermarkOverlay";


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


const TEMPLATE_PREVIEWS = {
    invoice: [
        { name: "Classic", pro: false, accent: "#0D9488", bg: "#F0FDFA", desc: "Clean teal header", layout: "header", from: "Sharma Enterprises", gstin: "27AABCU9603R1ZM", to: "Mehta Technologies", items: [{ n: "Web Design", hsn: "9983", q: 1, r: "25,000", g: "18%", a: "Rs.29,500" }, { n: "SEO Services", hsn: "9983", q: 1, r: "8,000", g: "18%", a: "Rs.9,440" }, { n: "Managed Hosting", hsn: "9983", q: 1, r: "3,500", g: "18%", a: "Rs.4,130" }], rows: [["CGST @9%", "Rs.3,915"], ["SGST @9%", "Rs.3,915"]], total: "Rs.51,330" },
        { name: "Minimal", pro: false, accent: "#111827", bg: "#F8F9FA", desc: "Ultra clean typography", layout: "minimal", from: "Arjun Enterprises", gstin: "29AABCU9603R1ZX", to: "Nair Industries Ltd.", items: [{ n: "Product Design", hsn: "9983", q: 1, r: "45,000", g: "18%", a: "Rs.53,100" }, { n: "React Development", hsn: "9983", q: 1, r: "40,000", g: "18%", a: "Rs.47,200" }], rows: [["CGST @9%", "Rs.7,650"], ["SGST @9%", "Rs.7,650"]], total: "Rs.1,00,300" },
        { name: "Modern", pro: true, accent: "#6366F1", bg: "#EEF2FF", desc: "Indigo sidebar accent", layout: "sidebar", from: "Patel Solutions", gstin: "27PATEL9603R1ZM", to: "Kumar Pvt. Ltd.", items: [{ n: "UI/UX Design", hsn: "9983", q: 1, r: "25,000", g: "18%", a: "Rs.29,500" }, { n: "App Building", hsn: "9983", q: 1, r: "75,000", g: "18%", a: "Rs.88,500" }], rows: [["CGST @9%", "Rs.9,000"], ["SGST @9%", "Rs.9,000"]], total: "Rs.1,18,000" },
        { name: "Corporate", pro: true, accent: "#1E3A5F", bg: "#EFF6FF", desc: "Navy formal letterhead", layout: "centered", from: "Reddy & Associates", gstin: "36REDDY9603R1ZM", to: "Singh Corporates", items: [{ n: "Consulting", hsn: "9983", q: 1, r: "60,000", g: "18%", a: "Rs.70,800" }, { n: "Audit Report", hsn: "9983", q: 1, r: "40,000", g: "18%", a: "Rs.47,200" }], rows: [["CGST @9%", "Rs.9,000"], ["SGST @9%", "Rs.9,000"]], total: "Rs.1,18,000" },
        { name: "Elegant", pro: true, accent: "#D97706", bg: "#FFFBEB", desc: "Gold luxury design", layout: "header", from: "Mehta Creatives", gstin: "24MEHTA9603R1ZM", to: "Global Ventures Ltd.", items: [{ n: "Brand Strategy", hsn: "9983", q: 1, r: "80,000", g: "18%", a: "Rs.94,400" }, { n: "Marketing", hsn: "9983", q: 70, r: "1,000", g: "18%", a: "Rs.82,600" }], rows: [["CGST @9%", "Rs.13,500"], ["SGST @9%", "Rs.13,500"]], total: "Rs.1,77,000" },
    ],
    "salary-slip": [
        { name: "Classic", pro: false, accent: "#0D9488", bg: "#F0FDFA", desc: "Standard payslip", from: "TechStart Pvt. Ltd.", gstin: "EMP001", to: "Sr. Software Developer", items: [["Basic Salary", "Rs.45,000"], ["HRA", "Rs.18,000"], ["DA", "Rs.4,500"]], rows: [["Employee PF", "-Rs.1,800"], ["Prof. Tax", "-Rs.200"]], total: "Rs.65,500" },
        { name: "Minimal", pro: false, accent: "#111827", bg: "#F8F9FA", desc: "Clean black/white", from: "Innovate Labs", gstin: "EMP042", to: "Product Manager", items: [["Basic Salary", "Rs.70,000"], ["HRA", "Rs.28,000"], ["Conveyance", "Rs.1,600"]], rows: [["Employee PF", "-Rs.3,600"], ["TDS", "-Rs.2,500"]], total: "Rs.93,500" },
        { name: "Modern", pro: true, accent: "#6366F1", bg: "#EEF2FF", desc: "Purple dark header", from: "Future Systems", gstin: "EMP108", to: "Lead Engineer", items: [["Basic Salary", "Rs.90,000"], ["HRA", "Rs.36,000"], ["Special Allow.", "Rs.10,000"]], rows: [["Employee PF", "-Rs.4,800"], ["TDS", "-Rs.8,000"]], total: "Rs.1,23,200" },
        { name: "Corporate", pro: true, accent: "#1E3A5F", bg: "#EFF6FF", desc: "Navy HR format", from: "Blue Chip Corp", gstin: "EMP215", to: "Finance Manager", items: [["Basic Salary", "Rs.55,000"], ["HRA", "Rs.22,000"], ["LTA", "Rs.5,000"]], rows: [["Employee PF", "-Rs.2,640"], ["Prof. Tax", "-Rs.200"]], total: "Rs.79,160" },
        { name: "Elegant", pro: true, accent: "#D97706", bg: "#FFFBEB", desc: "Gold premium format", from: "Prestige Consulting", gstin: "EMP089", to: "Senior Consultant", items: [["Basic Salary", "Rs.1,20,000"], ["HRA", "Rs.48,000"], ["Perf. Bonus", "Rs.25,000"]], rows: [["Employee PF", "-Rs.7,200"], ["TDS", "-Rs.18,000"]], total: "Rs.1,67,800" },
    ],
    certificate: [
        { name: "Classic", pro: false, accent: "#0D9488", bg: "#F0FDFA", desc: "Traditional border", from: "Reddy Academy", gstin: "ID: DM-ABC123", to: "Rahul Gupta", items: [["Course", "Full Stack Dev"], ["Duration", "6 Months"], ["Grade", "A+"]], rows: [["Issued", "15 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Minimal", pro: false, accent: "#111827", bg: "#F8F9FA", desc: "Clean minimal lines", from: "Code Academy", gstin: "ID: DM-DEF456", to: "Priya Sharma", items: [["Course", "Data Science"], ["Duration", "3 Months"], ["Grade", "A"]], rows: [["Issued", "20 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Modern", pro: true, accent: "#6366F1", bg: "#EEF2FF", desc: "Indigo top bar", from: "Tech Institute", gstin: "ID: DM-GHI789", to: "Arjun Mehta", items: [["Course", "UI/UX Design"], ["Duration", "2 Months"], ["Grade", "A+"]], rows: [["Issued", "22 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Royal", pro: true, accent: "#D97706", bg: "#FFFBEB", desc: "Gold ornamental", from: "Premier Academy", gstin: "ID: DM-JKL012", to: "Sneha Patel", items: [["Course", "MBA Finance"], ["Duration", "12 Months"], ["Grade", "A+"]], rows: [["Issued", "25 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Elegant", pro: true, accent: "#7C3AED", bg: "#F5F3FF", desc: "Purple ribbon style", from: "Excellence Institute", gstin: "ID: DM-MNO345", to: "Kiran Reddy", items: [["Course", "Cloud Computing"], ["Duration", "4 Months"], ["Grade", "S"]], rows: [["Issued", "28 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
    ],
    quotation: [
        { name: "Classic", pro: false, accent: "#0D9488", bg: "#F0FDFA", desc: "Standard quote format", from: "Arjun Design Studio", gstin: "29AABCU9603R1ZX", to: "Nair Industries Ltd.", items: [["UI Design", "Rs.20,000"], ["Development", "Rs.40,000"], ["Deployment", "Rs.8,000"]], rows: [["Subtotal", "Rs.68,000"], ["GST @18%", "Rs.12,240"]], total: "Rs.80,240" },
        { name: "Minimal", pro: false, accent: "#111827", bg: "#F8F9FA", desc: "Clean minimal quote", from: "Studio Pixels", gstin: "27PIXEL9603R1ZM", to: "Green Energy Corp.", items: [["Brand Design", "Rs.35,000"], ["Web Dev", "Rs.55,000"], ["SEO", "Rs.10,000"]], rows: [["Subtotal", "Rs.1,00,000"], ["GST @18%", "Rs.18,000"]], total: "Rs.1,18,000" },
        { name: "Modern", pro: true, accent: "#6366F1", bg: "#EEF2FF", desc: "Modern sidebar", from: "Creative Hub", gstin: "29CREAT9603R1ZX", to: "Sunrise Enterprises", items: [["Logo Design", "Rs.15,000"], ["Social Media", "Rs.25,000"], ["Content", "Rs.20,000"]], rows: [["Subtotal", "Rs.60,000"], ["GST @18%", "Rs.10,800"]], total: "Rs.70,800" },
        { name: "Corporate", pro: true, accent: "#1E3A5F", bg: "#EFF6FF", desc: "Formal corporate", from: "Blue Solutions", gstin: "36BLUES9603R1ZM", to: "National Corp Ltd.", items: [["Consulting", "Rs.1,00,000"], ["Research", "Rs.50,000"], ["Training", "Rs.30,000"]], rows: [["Subtotal", "Rs.1,80,000"], ["GST @18%", "Rs.32,400"]], total: "Rs.2,12,400" },
        { name: "Elegant", pro: true, accent: "#D97706", bg: "#FFFBEB", desc: "Gold premium quote", from: "Prestige Agency", gstin: "24PREST9603R1ZM", to: "Diamond Holdings", items: [["Campaign", "Rs.2,00,000"], ["Production", "Rs.80,000"], ["Analytics", "Rs.40,000"]], rows: [["Subtotal", "Rs.3,20,000"], ["GST @18%", "Rs.57,600"]], total: "Rs.3,77,600" },
    ],
    receipt: [
        { name: "Classic", pro: false, accent: "#0D9488", bg: "#F0FDFA", desc: "Standard receipt", from: "Patel Enterprises", gstin: "RCP-2026-001", to: "Sharma Consulting", items: [["Consulting Fee", "Rs.15,000"], ["GST @18%", "Rs.2,700"], ["Mode", "UPI"]], rows: [["Date", "19 Mar 2026"], ["Status", "Paid"]], total: "Rs.17,700" },
        { name: "Minimal", pro: false, accent: "#111827", bg: "#F8F9FA", desc: "Clean receipt", from: "Kumar Services", gstin: "RCP-2026-042", to: "Singh Traders", items: [["Service Charge", "Rs.8,000"], ["GST @18%", "Rs.1,440"], ["Mode", "NEFT"]], rows: [["Date", "20 Mar 2026"], ["Status", "Paid"]], total: "Rs.9,440" },
        { name: "Modern", pro: true, accent: "#6366F1", bg: "#EEF2FF", desc: "Modern design", from: "Reddy Solutions", gstin: "RCP-2026-108", to: "Mehta Group", items: [["Annual Maintenance", "Rs.24,000"], ["Support", "Rs.6,000"], ["Mode", "Cheque"]], rows: [["Date", "21 Mar 2026"], ["Status", "Paid"]], total: "Rs.35,400" },
        { name: "Corporate", pro: true, accent: "#1E3A5F", bg: "#EFF6FF", desc: "Formal corporate", from: "Blue Services", gstin: "RCP-2026-215", to: "National Industries", items: [["License Fee", "Rs.50,000"], ["GST @18%", "Rs.9,000"], ["Mode", "RTGS"]], rows: [["Date", "22 Mar 2026"], ["Status", "Paid"]], total: "Rs.59,000" },
        { name: "Elegant", pro: true, accent: "#D97706", bg: "#FFFBEB", desc: "Luxury receipt", from: "Prestige Services", gstin: "RCP-2026-089", to: "Diamond Corp", items: [["Premium Package", "Rs.1,50,000"], ["GST @18%", "Rs.27,000"], ["Mode", "Wire"]], rows: [["Date", "23 Mar 2026"], ["Status", "Paid"]], total: "Rs.1,77,000" },
    ],
};

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

// ── HERO SLIDES & MOCKUPS ─────────────────────────────────────────────────
const HERO_SLIDES = [
    {
        id: "docs",
        preTitle: "Turn business details into",
        highlightTitle: "GST-ready documents",
        postTitle: "in seconds.",
        bullets: [
            "Generate invoices, quotations, receipts & salary slips.",
            "GST-compliant with CGST, SGST, IGST auto-calculation.",
            "Export to PDF instantly — no sign-up, no watermark."
        ],
        ctaParams: { type: "select" },
        badges: ["Invoice", "Quotation", "Receipt", "Salary Slip", "Certificate"],
        mockupType: "invoice"
    },
    {
        id: "hr",
        preTitle: "Generate professional",
        highlightTitle: "HR & Business letters",
        postTitle: "instantly.",
        bullets: [
            "Create Experience Letters, Job Offers & Resignations.",
            "Standard corporate formats accepted everywhere.",
            "Download as print-ready PDF in one click."
        ],
        ctaParams: { type: "button", text: "Explore HR Tools", href: "/experience-letter" },
        badges: ["Experience Letter", "Job Offer", "Resignation", "Rent Receipt", "Payment Voucher"],
        mockupType: "letter"
    },
    {
        id: "pdf",
        preTitle: "Manipulate",
        highlightTitle: "PDF files safely",
        postTitle: "in your browser.",
        bullets: [
            "Merge, split, and compress your critical documents.",
            "100% secure client-side processing — files never leave your device.",
            "Convert PDFs to Word, JPG, and more."
        ],
        ctaParams: { type: "button", text: "Try PDF Tools", href: "/tools/merge-pdf" },
        badges: ["Merge PDF", "Compress PDF", "PDF to Word", "JPG to PDF"],
        mockupType: "pdf"
    },
    {
        id: "calc",
        preTitle: "Explore financial math with",
        highlightTitle: "free Calculators.",
        postTitle: "",
        bullets: [
            "Reverse-calculate GST, plan EMIs, and breakdown salaries.",
            "Instant accurate results for Indian businesses.",
            "Clean, distraction-free interface."
        ],
        ctaParams: { type: "button", text: "View Calculators", href: "/calculators/gst-calculator" },
        badges: ["GST Calculator", "EMI Calculator", "Salary Breakdown"],
        mockupType: "calc"
    },
    {
        id: "batch",
        preTitle: "Process hundreds of documents at once with",
        highlightTitle: "Batch Export.",
        postTitle: "",
        bullets: [
            "Upload a standard CSV file with 100+ rows of data.",
            "Auto-map columns to any document template.",
            "Download all generated PDFs as a single ZIP file."
        ],
        ctaParams: { type: "button", text: "Start Batch Processing", href: "/batch" },
        badges: ["CSV Upload", "Auto-mapping", "Bulk ZIP Download"],
        mockupType: "batch"
    }
];

function HeroMockupRender({ type }) {
    if (type === "invoice") {
        return (
            <div className="hero-mockup" style={{ animation: "fadeIn 300ms ease" }}>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", background: "#fff" }}>
                    <div style={{ background: T, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        );
    }
    if (type === "letter") {
        return (
            <div className="hero-mockup" style={{ animation: "fadeIn 300ms ease" }}>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", background: "#fff" }}>
                    <div style={{ padding: "20px", borderBottom: "1px solid #F3F4F6", textAlign: "center", background: "#F9FAFB" }}>
                        <div style={{ width: "40px", height: "40px", background: "#F0FDFA", color: T, borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                            <FileText size={20} />
                        </div>
                        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", margin: 0, color: "#111827" }}>Google India Pvt Ltd</p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>Job Offer Letter</p>
                    </div>
                    <div style={{ padding: "24px 20px" }}>
                        <div style={{ width: "40%", height: "8px", background: "#D1D5DB", borderRadius: "4px", marginBottom: "16px" }}></div>
                        <div style={{ width: "100%", height: "6px", background: "#F3F4F6", borderRadius: "3px", marginBottom: "8px" }}></div>
                        <div style={{ width: "100%", height: "6px", background: "#F3F4F6", borderRadius: "3px", marginBottom: "8px" }}></div>
                        <div style={{ width: "85%", height: "6px", background: "#F3F4F6", borderRadius: "3px", marginBottom: "24px" }}></div>
                        
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", borderTop: "1px dashed #E5E7EB", paddingTop: "16px" }}>
                             <div style={{ width: "32px", height: "32px", background: TL, borderRadius: "50%", border: `1px solid ${TB}` }}></div>
                             <div>
                                 <div style={{ width: "80px", height: "8px", background: "#D1D5DB", borderRadius: "4px", marginBottom: "6px" }}></div>
                                 <div style={{ width: "50px", height: "6px", background: "#F3F4F6", borderRadius: "3px" }}></div>
                             </div>
                             <div style={{ marginLeft: "auto", background: T, color: "#fff", padding: "4px 12px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>Signed</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (type === "pdf") {
        return (
            <div className="hero-mockup" style={{ animation: "fadeIn 300ms ease" }}>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", background: "#fff", padding: "20px" }}>
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", margin: "0 0 16px", color: "#111827" }}>Merge PDF Files</p>
                    
                    <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                        <div style={{ flex: 1, height: "60px", background: "#F9FAFB", border: "1px dashed #D1D5DB", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <FileText size={16} color="#9CA3AF" />
                            <span style={{ fontSize: "9px", color: "#6B7280", marginTop: "4px", fontFamily: "Inter, sans-serif" }}>Report_1.pdf</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: T, fontWeight: "bold", fontSize: "16px" }}>+</div>
                        <div style={{ flex: 1, height: "60px", background: "#F9FAFB", border: "1px dashed #D1D5DB", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <FileText size={16} color="#9CA3AF" />
                            <span style={{ fontSize: "9px", color: "#6B7280", marginTop: "4px", fontFamily: "Inter, sans-serif" }}>Report_2.pdf</span>
                        </div>
                    </div>
                    
                    <div style={{ background: TL, padding: "16px", borderRadius: "8px", textAlign: "center", border: `1px solid ${TB}` }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                            <Archive size={20} color={T} />
                        </div>
                        <p style={{ fontSize: "12px", fontWeight: "bold", color: T, margin: 0, fontFamily: "Inter, sans-serif" }}>Merged_Report.pdf</p>
                        <p style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Ready for download</p>
                    </div>
                    <div style={{ marginTop: "16px", background: T, borderRadius: "6px", padding: "10px", textAlign: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}>↓ Download Merged PDF</span>
                    </div>
                </div>
            </div>
        );
    }
    if (type === "calc") {
        return (
            <div className="hero-mockup" style={{ animation: "fadeIn 300ms ease" }}>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", background: "#fff", padding: "20px" }}>
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", margin: "0 0 16px", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}><Timer size={16} color={T}/> GST Calculator</p>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", background: "#F9FAFB", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                        <div>
                            <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>Base Amount</p>
                            <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: "4px 0 0", fontFamily: "Space Grotesk, sans-serif" }}>₹10,000</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>GST Rate</p>
                            <p style={{ fontSize: "18px", fontWeight: 700, color: T, margin: "4px 0 0", fontFamily: "Space Grotesk, sans-serif" }}>18%</p>
                        </div>
                    </div>
                    
                    <div style={{ padding: "0 4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3F4F6", paddingBottom: "8px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>CGST (9%)</span>
                            <span style={{ fontSize: "13px", fontWeight: "600", fontFamily: "Inter, sans-serif", color: "#111827" }}>₹900</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3F4F6", paddingBottom: "8px", marginBottom: "16px" }}>
                            <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>SGST (9%)</span>
                            <span style={{ fontSize: "13px", fontWeight: "600", fontFamily: "Inter, sans-serif", color: "#111827" }}>₹900</span>
                        </div>
                    </div>
                    
                    <div style={{ background: T, padding: "16px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#fff", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>Total Amount</span>
                        <span style={{ fontSize: "18px", color: "#fff", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}>₹11,800</span>
                    </div>
                </div>
            </div>
        );
    }
    if (type === "batch") {
        return (
            <div className="hero-mockup" style={{ animation: "fadeIn 300ms ease" }}>
                <div style={{ border: "1px solid #0D9488", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(13,148,136,0.15)", background: "#fff" }}>
                    <div style={{ padding: "14px 20px", background: T, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: "#fff" }}>BATCH EXPORT</span>
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "#D97706", background: "#FEF9C3", padding: "2px 8px", borderRadius: "4px" }}>PRO</span>
                    </div>
                    
                    <div style={{ padding: "20px" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                            <div style={{ width: "40px", height: "40px", background: "#F3F4F6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FileText size={20} color="#6B7280" />
                            </div>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Inter, sans-serif" }}>employees_data.csv</p>
                                <p style={{ fontSize: "11px", color: "#0D9488", margin: "4px 0 0", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>142 rows loaded successfully</p>
                            </div>
                        </div>
                        
                        <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "3px", overflow: "hidden", marginBottom: "20px" }}>
                            <div style={{ width: "100%", height: "100%", background: T, borderRadius: "3px" }}></div>
                        </div>
                        
                        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                            <Archive size={28} color={T} style={{ marginBottom: "12px" }} />
                            <p style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>142_Salary_Slips.zip</p>
                            <p style={{ fontSize: "11px", color: "#6B7280", margin: "6px 0 0", fontFamily: "Inter, sans-serif" }}>Generated in 1.4s.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

// ── Main Page ─────────────────────────────────────────────────
export default function LandingPage() {
    const [selectedDoc, setSelectedDoc] = useState("invoice");
    const [docTab, setDocTab] = useState("finance");
    const [activeDocType, setActiveDocType] = useState("invoice");
    const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(null);
    const [heroSlideIdx, setHeroSlideIdx] = useState(0);

    // Auto-advance hero slides every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = HERO_SLIDES[heroSlideIdx];

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
                        <div style={{ animation: "fadeIn 400ms ease-out" }}>
                            <h1 style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontSize: "clamp(28px, 3.2vw, 44px)",
                                fontWeight: 700, color: "#111827",
                                lineHeight: 1.15, margin: "0 0 18px", letterSpacing: "-0.5px",
                                minHeight: "100px",
                            }}>
                                {slide.preTitle}{" "}
                                <span style={{ color: T }}>{slide.highlightTitle}</span>{" "}
                                {slide.postTitle}
                            </h1>
                            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "28px", minHeight: "85px" }}>
                                {slide.bullets.map((p, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                        <span style={{ color: T, fontWeight: 700, flexShrink: 0, fontSize: "15px", lineHeight: "1.5" }}>·</span>
                                        <span style={{ fontSize: "15px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{p}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
                                {slide.ctaParams.type === "select" ? (
                                    <>
                                        <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}
                                            className="hero-select">
                                            {PREVIEW_DOC_TYPES.map((d) => (
                                                <option key={d.id} value={d.id}>{d.label}</option>
                                            ))}
                                        </select>
                                        <Link href={`/${selectedDoc}`} className="hero-cta">
                                            Start for free
                                        </Link>
                                    </>
                                ) : (
                                    <Link href={slide.ctaParams.href} className="hero-cta">
                                        {slide.ctaParams.text}
                                    </Link>
                                )}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "32px", minHeight: "20px" }}>
                                {slide.badges.map((item) => (
                                    <span key={item} style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>✓ {item}</span>
                                ))}
                                <span style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>&nbsp;Used by 10,000+</span>
                            </div>
                            
                            {/* Dotted Pagination */}
                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                {HERO_SLIDES.map((_, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setHeroSlideIdx(idx)} 
                                        style={{ 
                                            width: heroSlideIdx === idx ? "28px" : "8px", 
                                            height: "6px", 
                                            borderRadius: "3px", 
                                            background: heroSlideIdx === idx ? T : "#E5E7EB", 
                                            border: "none", 
                                            cursor: "pointer", 
                                            padding: 0,
                                            transition: "all 300ms ease" 
                                        }} 
                                        aria-label={"Go to slide " + (idx + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hero mockup */}
                    <div style={{ paddingRight: "10px" }}>
                        <HeroMockupRender type={slide.mockupType} />
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
                    <h2 className="section-title">Document Templates</h2>
                    <p className="section-sub">5 professional templates for each document type. 2 free forever, 3 exclusive Pro designs.</p>

                    <div style={{ display: "flex", border: "1px solid #D1D5DB", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>

                        {/* Sidebar - doc type selector */}
                        <div style={{ width: "180px", flexShrink: 0, borderRight: "1px solid #E5E7EB", padding: "16px 0", display: "flex", flexDirection: "column" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 16px", margin: "0 0 12px", fontFamily: "Inter, sans-serif" }}>SELECT TYPE</p>
                            {PREVIEW_DOC_TYPES.slice(0, 5).map(dt => (
                                <button key={dt.id} onClick={() => { setActiveDocType(dt.id); setActiveTemplateIdx(0); }}
                                    className={activeDocType === dt.id ? "sidebar-item-active" : "sidebar-item"}>
                                    <span style={{ fontSize: "15px" }}>{dt.icon}</span>
                                    <span>{dt.label}</span>
                                </button>
                            ))}
                            <div style={{ marginTop: "auto", padding: "16px" }}>
                                <Link href={`/${activeDocType}`} className="download-btn">
                                    <Download size={13} /> CREATE FREE
                                </Link>
                                <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", margin: "6px 0 0", fontFamily: "Inter, sans-serif" }}>No sign-up required</p>
                            </div>
                        </div>

                        {/* Templates area */}
                        <div style={{ flex: 1, padding: "20px", background: BG }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <div>
                                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
                                        {PREVIEW_DOC_TYPES.find(d => d.id === activeDocType)?.label} Templates
                                    </p>
                                    <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                                        2 free · 3 Pro — click to preview
                                    </p>
                                </div>
                                {/* Pagination dots */}
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    {(TEMPLATE_PREVIEWS[activeDocType] || []).map((_, idx) => (
                                        <button key={idx} onClick={() => setActiveTemplateIdx(idx)} style={{
                                            width: activeTemplateIdx === idx ? "20px" : "8px",
                                            height: "8px", borderRadius: "4px", border: "none", cursor: "pointer",
                                            background: activeTemplateIdx === idx ? T : "#D1D5DB",
                                            transition: "all 200ms", padding: 0,
                                        }} />
                                    ))}
                                </div>
                            </div>

                            {/* Template cards grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                                {(TEMPLATE_PREVIEWS[activeDocType] || []).map((tmpl, idx) => {
                                    const isActive = activeTemplateIdx === idx;
                                    const isPro = tmpl.pro;
                                    return (
                                        <div key={idx} onClick={() => setActiveTemplateIdx(idx)}
                                            style={{
                                                border: `2px solid ${isActive ? tmpl.accent : "#E5E7EB"}`,
                                                borderRadius: "10px", overflow: "hidden",
                                                cursor: "pointer", background: "#fff",
                                                transition: "all 150ms",
                                                boxShadow: isActive ? `0 4px 14px ${tmpl.accent}25` : "none",
                                                position: "relative",
                                            }}>
                                            {/* Mini template preview */}
                                            <div style={{ background: tmpl.bg, padding: "8px 8px 0", height: "100px", display: "flex", flexDirection: tmpl.layout === "sidebar" ? "row" : "column" }}>
                                                {/* Structural change in mini-preview */}
                                                {tmpl.layout === "sidebar" ? (
                                                    <>
                                                        <div style={{ width: "25px", height: "100%", background: tmpl.accent, borderRadius: "4px 0 0 0" }} />
                                                        <div style={{ flex: 1, background: "#fff", padding: "6px" }}>
                                                            {[70, 90, 60].map((w, i) => (
                                                                <div key={i} style={{ height: "2px", background: "#F3F4F6", borderRadius: "1px", marginBottom: "4px", width: `${w}%` }} />
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Header style (Classic/Bold) */}
                                                        {tmpl.layout !== "minimal" && (
                                                            <div style={{ background: tmpl.accent, borderRadius: "4px 4px 0 0", padding: "4px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <div style={{ width: "40px", height: "4px", background: "rgba(255,255,255,0.8)", borderRadius: "2px" }} />
                                                                <div style={{ width: "15px", height: "4px", background: "rgba(255,255,255,0.5)", borderRadius: "2px" }} />
                                                            </div>
                                                        )}
                                                        {/* Minimal style (No background header) */}
                                                        {tmpl.layout === "minimal" && (
                                                            <div style={{ borderBottom: `1px solid ${tmpl.accent}`, padding: "4px 0", margin: "0 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <div style={{ width: "30px", height: "3px", background: tmpl.accent, borderRadius: "1px" }} />
                                                                <div style={{ width: "15px", height: "3px", background: "#D1D5DB", borderRadius: "1px" }} />
                                                            </div>
                                                        )}
                                                        <div style={{ background: "#fff", padding: "6px", flex: 1 }}>
                                                            {[100, 70, 85, 60].map((w, i) => (
                                                                <div key={i} style={{ height: "3px", background: i === 0 && tmpl.layout !== "minimal" ? tmpl.accent + "30" : "#F3F4F6", borderRadius: "1px", marginBottom: "3px", width: `${w}%` }} />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Template name + badge */}
                                            <div style={{ padding: "6px 8px", borderTop: `1px solid ${isActive ? tmpl.accent + "40" : "#F3F4F6"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: "11px", fontWeight: 700, color: isActive ? tmpl.accent : "#374151", fontFamily: "Inter, sans-serif" }}>{tmpl.name}</span>
                                                {isPro
                                                    ? <span style={{ fontSize: "9px", fontWeight: 700, background: "#FEF9C3", color: "#D97706", padding: "1px 5px", borderRadius: "6px", fontFamily: "Inter, sans-serif" }}>PRO</span>
                                                    : <span style={{ fontSize: "9px", fontWeight: 700, background: "#ECFDF5", color: "#10B981", padding: "1px 5px", borderRadius: "6px", fontFamily: "Inter, sans-serif" }}>FREE</span>
                                                }
                                            </div>

                                            {/* Pro watermark overlay */}
                                            {isPro && (
                                                <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                                                    <div style={{ background: "#1E3A5F", padding: "3px 10px", borderRadius: "10px", transform: "rotate(-15deg)" }}>
                                                        <span style={{ fontSize: "9px", fontWeight: 700, color: "#fff", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.05em" }}>DocMinty PRO</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Active checkmark */}
                                            {isActive && !isPro && (
                                                <div style={{ position: "absolute", top: "6px", right: "6px", width: "16px", height: "16px", background: tmpl.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <span style={{ color: "#fff", fontSize: "9px" }}>✓</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Active template full preview */}
                            {(() => {
                                const tmpl = (TEMPLATE_PREVIEWS[activeDocType] || [])[activeTemplateIdx];
                                if (!tmpl) return null;
                                return (
                                    <div style={{ marginTop: "16px", border: `1px solid ${tmpl.accent}40`, borderRadius: "10px", overflow: "hidden", background: "#fff" }}>
                                        {/* Preview Structure Switching */}
                                        <div style={{ display: "flex", gap: "24px", minHeight: "350px", position: "relative", padding: tmpl.layout === "sidebar" ? "0" : "24px" }}>
                                            {tmpl.pro && <WatermarkOverlay />}
                                            {/* Sidebar Layout Support */}
                                            {tmpl.layout === "sidebar" && (
                                                <div style={{ width: "120px", flexShrink: 0, background: tmpl.accent, margin: "-24px 0 -24px -24px", padding: "30px 16px", borderRadius: "12px 0 0 12px", color: "#fff" }}>
                                                    <p style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>INVOICE</p>
                                                    <p style={{ fontSize: "10px", opacity: 0.8, margin: "0 0 12px" }}>#{activeDocType.toUpperCase()}-2026</p>
                                                    
                                                    <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em", margin: "20px 0 4px" }}>Bill To</p>
                                                    <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 12px" }}>{tmpl.to}</p>
                                                    
                                                    <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em", margin: "20px 0 4px" }}>Amount Due</p>
                                                    <p style={{ fontSize: "10px", fontWeight: 600, margin: 0 }}>{tmpl.total}</p>
                                                </div>
                                            )}

                                            <div style={{ flex: 1 }}>
                                                {/* Standard Header Layout */}
                                                {tmpl.layout === "header" && (
                                                    <div style={{ background: tmpl.accent, padding: "16px 20px", margin: "-24px -24px 20px -24px", borderRadius: "12px 12px 0 0", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{tmpl.from}</h4>
                                                            <p style={{ fontSize: "9px", margin: "2px 0 0", opacity: 0.8 }}>GSTIN: {tmpl.gstin}</p>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif" }}>GST INVOICE</h3>
                                                            <p style={{ fontSize: "9px", margin: "2px 0 0", opacity: 0.8 }}>{tmpl.name} Template</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Minimal Header Layout */}
                                                {tmpl.layout === "minimal" && (
                                                    <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: `2px solid ${tmpl.accent}` }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                            <div>
                                                                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: tmpl.accent, fontFamily: "Inter, sans-serif" }}>{tmpl.from}</h4>
                                                                <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "2px 0 0" }}>GSTIN: {tmpl.gstin}</p>
                                                            </div>
                                                            <div style={{ textAlign: "right" }}>
                                                                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>Invoice</h3>
                                                                <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "2px 0 0" }}>#INV-2026-001</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Centered / Corporate Layout */}
                                                {tmpl.layout === "centered" && (
                                                    <div style={{ textAlign: "center", borderBottom: "1px solid #E5E7EB", paddingBottom: "20px", marginBottom: "20px" }}>
                                                        <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800, color: tmpl.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif" }}>{tmpl.from}</h3>
                                                        <p style={{ fontSize: "9px", color: "#6B7280", margin: "0 0 12px" }}>OFFICIAL TAX INVOICE</p>
                                                        <div style={{ display: "flex", justifyContent: "center", gap: "24px", fontSize: "9px", color: "#9CA3AF" }}>
                                                            <span>GSTIN: {tmpl.gstin}</span>
                                                            <span>•</span>
                                                            <span>Date: 2026-03-31</span>
                                                            <span>•</span>
                                                            <span>No: #INV-2026-001</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Common Receiver Info for all but Sidebar (where it's in side) */}
                                                {tmpl.layout !== "sidebar" && (
                                                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 8px", fontFamily: "Inter, sans-serif" }}>
                                                        To: <strong style={{ color: "#374151" }}>{tmpl.to}</strong>
                                                    </p>
                                                )}

                                            {/* Items Table - "Real" look for Invoice/Quotation */}
                                            {activeDocType === "invoice" || activeDocType === "quotation" ? (
                                                <div style={{ marginTop: "12px" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 50px 40px 60px 50px 60px", gap: "6px", background: "#F9FAFB", padding: "6px 8px", borderBottom: "1px solid #E5E7EB" }}>
                                                        {["#", "DESCRIPTION", "HSN", "QTY", "RATE", "GST", "AMOUNT"].map(h => (
                                                            <span key={h} style={{ fontSize: "9px", fontWeight: 700, color: "#9CA3AF", fontFamily: "Space Grotesk, sans-serif" }}>{h}</span>
                                                        ))}
                                                    </div>
                                                    {tmpl.items.map((item, i) => (
                                                        <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr 50px 40px 60px 50px 60px", gap: "6px", padding: "6px 8px", borderBottom: "1px solid #F3F4F6", alignItems: "center" }}>
                                                            <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{i + 1}</span>
                                                            <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>{item.n}</span>
                                                            <span style={{ fontSize: "10px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{item.hsn}</span>
                                                            <span style={{ fontSize: "11px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{item.q}</span>
                                                            <span style={{ fontSize: "11px", color: "#374151", fontFamily: "Inter, sans-serif" }}>₹{item.r}</span>
                                                            <span style={{ fontSize: "11px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{item.g}</span>
                                                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif", textAlign: "right" }}>{item.a}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ marginTop: "8px" }}>
                                                    {tmpl.items.map((item, i) => (
                                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                                                            <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{(Array.isArray(item) ? item[0] : item.n)}</span>
                                                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>{(Array.isArray(item) ? item[1] : item.a)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Summary */}
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ background: "#F9FAFB", padding: "10px", borderRadius: "8px", borderLeft: `3px solid ${tmpl.accent}` }}>
                                                        <p style={{ fontSize: "9px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", margin: "0 0 2px" }}>Amount in Words</p>
                                                        <p style={{ fontSize: "10px", color: "#374151", fontWeight: 600, margin: 0, fontStyle: "italic" }}>Rupees Fifty One Thousand Three Hundred Thirty Only</p>
                                                    </div>
                                                </div>
                                                <div style={{ width: "200px", paddingLeft: "20px" }}>
                                                    {tmpl.rows.map((row, i) => (
                                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                                                            <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{row[0]}</span>
                                                            <span style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{row[1]}</span>
                                                        </div>
                                                    ))}
                                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: tmpl.bg, borderRadius: "8px", marginTop: "8px", border: `1px solid ${tmpl.accent}30` }}>
                                                        <span style={{ fontSize: "14px", fontWeight: 700, color: tmpl.accent, fontFamily: "Space Grotesk, sans-serif" }}>Total</span>
                                                        <span style={{ fontSize: "14px", fontWeight: 800, color: tmpl.accent, fontFamily: "Space Grotesk, sans-serif" }}>{tmpl.total}</span>
                                                    </div>
                                                </div>
                                            </div>

                                                {/* Terms Placeholder for realism */}
                                                <div style={{ marginTop: "16px", borderTop: "1px dashed #E5E7EB", paddingTop: "12px" }}>
                                                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", margin: "0 0 4px" }}>TERMS & CONDITIONS</p>
                                                    <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>1. Payment due within 30 days. 2. Please include invoice number on checks.</p>
                                                </div>
                                            </div>

                                            {/* Pro watermark on preview */}
                                            {tmpl.pro && (
                                                <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 0 8px 8px" }}>
                                                    <div style={{ textAlign: "center" }}>
                                                        <div style={{ background: "#1E3A5F", padding: "6px 20px", borderRadius: "20px", marginBottom: "8px", display: "inline-block" }}>
                                                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.08em" }}>DocMinty PRO</span>
                                                        </div>
                                                        <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>
                                                            Upgrade to unlock this template
                                                        </p>
                                                        <Link href="/pricing" style={{ display: "inline-block", marginTop: "6px", padding: "5px 16px", background: T, color: "#fff", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>
                                                            Upgrade — Rs.199/mo
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
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
