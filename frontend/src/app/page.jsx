"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import PricingCard from "@/components/PricingCard";
import { DOC_TYPES as PREVIEW_DOC_TYPES } from "@/constants/docTypes";
import {
    ChevronDown, Download, FileText, FileQuestion, Receipt, ShoppingCart,
    Box, CreditCard, Home, Banknote, Briefcase, LogOut, Mail, Award,
    GraduationCap, CheckCircle, PlusSquare, Scissors, Minimize, FileInput,
    FileOutput, Image, Calculator, Percent, BadgeIndianRupee, TrendingUp,
    Coins, BarChart3, Tag, QrCode, Archive, Smile, AlignLeft, Timer, Search, X, Star
} from "lucide-react";
import WatermarkOverlay from "@/components/WatermarkOverlay";


const T = "#0D9488";
const TL = "#F0FDFA";
const TB = "#99F6E4";
const BG = "#F0F4F3";

const STATS = [
    { num: 10, suffix: "K+", label: "Documents Created", decimals: 0 },
    { num: 2, suffix: "K+", label: "Happy Users", decimals: 0 },
    { num: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
    { num: 0.5, suffix: "s", label: "Avg Load Time", decimals: 1 },
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
        { id: "invoice", label: "GST INVOICE", description: "Create GST invoices with CGST, SGST & IGST", icon: FileText, href: "/invoice", badge: "Popular" },
        { id: "quotation", label: "QUOTATION", description: "Professional price quotes for your clients", icon: FileQuestion, href: "/quotation" },
        { id: "receipt", label: "RECEIPT", description: "Generate payment receipts instantly", icon: Receipt, href: "/receipt" },
        { id: "proforma-invoice", label: "PROFORMA INVOICE", description: "Advance billing for pending orders", icon: FileText, href: "/proforma-invoice" },
        { id: "rent-receipt", label: "RENT RECEIPT", description: "Monthly rent receipts for HRA claims", icon: Home, href: "/rent-receipt" },
        { id: "payment-voucher", label: "PAYMENT VOUCHER", description: "Internal records for business payments", icon: CreditCard, href: "/payment-voucher" },
    ],
    hr: [
        { id: "salary-slip", label: "SALARY SLIP", description: "Generate payslips with PF, TDS & allowances", icon: Banknote, href: "/salary-slip", badge: "Popular" },
        { id: "certificate", label: "CERTIFICATE", description: "Verified certificates with unique QR codes", icon: Award, href: "/certificate", badge: "Popular" },
        { id: "internship-certificate", label: "INTERNSHIP CERT", description: "Completion certificates for your interns", icon: GraduationCap, href: "/internship-certificate" },
        { id: "verify-certificate", label: "VERIFY CERTIFICATE", description: "Instant QR-based certificate validation", icon: CheckCircle, href: "/verify-certificate" },
    ],
    letters: [
        { id: "experience-letter", label: "EXPERIENCE LETTER", description: "Official HR letters for departing employees", icon: Briefcase, href: "/experience-letter" },
        { id: "resignation-letter", label: "RESIGNATION LETTER", description: "Professional resignation letter formats", icon: LogOut, href: "/resignation-letter" },
        { id: "job-offer-letter", label: "JOB OFFER LETTER", description: "Formal offer letters for new candidates", icon: Mail, href: "/job-offer-letter" },
    ],
    ops: [
        { id: "purchase-order", label: "PURCHASE ORDER", description: "Formal POs for vendors and suppliers", icon: ShoppingCart, href: "/purchase-order" },
        { id: "packing-slip", label: "PACKING SLIP", description: "Professional shipment packing lists", icon: Box, href: "/packing-slip" },
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
        { name: "Classic", pro: false, layout: "header", accent: "#0D9488", bg: "#F0FDFA", desc: "Standard payslip", from: "TechStart Pvt. Ltd.", gstin: "EMP001", to: "Sr. Software Developer", items: [["Basic Salary", "Rs.45,000"], ["HRA", "Rs.18,000"], ["DA", "Rs.4,500"]], rows: [["Employee PF", "-Rs.1,800"], ["Prof. Tax", "-Rs.200"]], total: "Rs.65,500" },
        { name: "Minimal", pro: false, layout: "minimal", accent: "#111827", bg: "#F8F9FA", desc: "Clean black/white", from: "Innovate Labs", gstin: "EMP042", to: "Product Manager", items: [["Basic Salary", "Rs.70,000"], ["HRA", "Rs.28,000"], ["Conveyance", "Rs.1,600"]], rows: [["Employee PF", "-Rs.3,600"], ["TDS", "-Rs.2,500"]], total: "Rs.93,500" },
        { name: "Modern", pro: true, layout: "sidebar", accent: "#6366F1", bg: "#EEF2FF", desc: "Purple dark header", from: "Future Systems", gstin: "EMP108", to: "Lead Engineer", items: [["Basic Salary", "Rs.90,000"], ["HRA", "Rs.36,000"], ["Special Allow.", "Rs.10,000"]], rows: [["Employee PF", "-Rs.4,800"], ["TDS", "-Rs.8,000"]], total: "Rs.1,23,200" },
        { name: "Corporate", pro: true, layout: "centered", accent: "#1E3A5F", bg: "#EFF6FF", desc: "Navy HR format", from: "Blue Chip Corp", gstin: "EMP215", to: "Finance Manager", items: [["Basic Salary", "Rs.55,000"], ["HRA", "Rs.22,000"], ["LTA", "Rs.5,000"]], rows: [["Employee PF", "-Rs.2,640"], ["Prof. Tax", "-Rs.200"]], total: "Rs.79,160" },
        { name: "Elegant", pro: true, layout: "accent-bottom", accent: "#D97706", bg: "#FFFBEB", desc: "Gold premium format", from: "Prestige Consulting", gstin: "EMP089", to: "Senior Consultant", items: [["Basic Salary", "Rs.1,20,000"], ["HRA", "Rs.48,000"], ["Perf. Bonus", "Rs.25,000"]], rows: [["Employee PF", "-Rs.7,200"], ["TDS", "-Rs.18,000"]], total: "Rs.1,67,800" },
    ],
    certificate: [
        { name: "Classic", pro: false, layout: "centered", accent: "#0D9488", bg: "#F0FDFA", desc: "Traditional border", from: "Reddy Academy", gstin: "ID: DM-ABC123", to: "Rahul Gupta", items: [["Course", "Full Stack Dev"], ["Duration", "6 Months"], ["Grade", "A+"]], rows: [["Issued", "15 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Minimal", pro: false, layout: "minimal", accent: "#111827", bg: "#F8F9FA", desc: "Clean minimal lines", from: "Code Academy", gstin: "ID: DM-DEF456", to: "Priya Sharma", items: [["Course", "Data Science"], ["Duration", "3 Months"], ["Grade", "A"]], rows: [["Issued", "20 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Modern", pro: true, layout: "header", accent: "#6366F1", bg: "#EEF2FF", desc: "Indigo top bar", from: "Tech Institute", gstin: "ID: DM-GHI789", to: "Arjun Mehta", items: [["Course", "UI/UX Design"], ["Duration", "2 Months"], ["Grade", "A+"]], rows: [["Issued", "22 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Royal", pro: true, layout: "accent-bottom", accent: "#D97706", bg: "#FFFBEB", desc: "Gold ornamental", from: "Premier Academy", gstin: "ID: DM-JKL012", to: "Sneha Patel", items: [["Course", "MBA Finance"], ["Duration", "12 Months"], ["Grade", "A+"]], rows: [["Issued", "25 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
        { name: "Elegant", pro: true, layout: "sidebar", accent: "#7C3AED", bg: "#F5F3FF", desc: "Purple ribbon style", from: "Excellence Institute", gstin: "ID: DM-MNO345", to: "Kiran Reddy", items: [["Course", "Cloud Computing"], ["Duration", "4 Months"], ["Grade", "S"]], rows: [["Issued", "28 Mar 2026"], ["QR Verified", "Yes"]], total: "Authentic" },
    ],
    quotation: [
        { name: "Classic", pro: false, layout: "header", accent: "#0D9488", bg: "#F0FDFA", desc: "Standard quote format", from: "Arjun Design Studio", gstin: "29AABCU9603R1ZX", to: "Nair Industries Ltd.", items: [["UI Design", "Rs.20,000"], ["Development", "Rs.40,000"], ["Deployment", "Rs.8,000"]], rows: [["Subtotal", "Rs.68,000"], ["GST @18%", "Rs.12,240"]], total: "Rs.80,240" },
        { name: "Minimal", pro: false, layout: "minimal", accent: "#111827", bg: "#F8F9FA", desc: "Clean minimal quote", from: "Studio Pixels", gstin: "27PIXEL9603R1ZM", to: "Green Energy Corp.", items: [["Brand Design", "Rs.35,000"], ["Web Dev", "Rs.55,000"], ["SEO", "Rs.10,000"]], rows: [["Subtotal", "Rs.1,00,000"], ["GST @18%", "Rs.18,000"]], total: "Rs.1,18,000" },
        { name: "Modern", pro: true, layout: "sidebar", accent: "#6366F1", bg: "#EEF2FF", desc: "Modern sidebar", from: "Creative Hub", gstin: "29CREAT9603R1ZX", to: "Sunrise Enterprises", items: [["Logo Design", "Rs.15,000"], ["Social Media", "Rs.25,000"], ["Content", "Rs.20,000"]], rows: [["Subtotal", "Rs.60,000"], ["GST @18%", "Rs.10,800"]], total: "Rs.70,800" },
        { name: "Corporate", pro: true, layout: "centered", accent: "#1E3A5F", bg: "#EFF6FF", desc: "Formal corporate", from: "Blue Solutions", gstin: "36BLUES9603R1ZM", to: "National Corp Ltd.", items: [["Consulting", "Rs.1,00,000"], ["Research", "Rs.50,000"], ["Training", "Rs.30,000"]], rows: [["Subtotal", "Rs.1,80,000"], ["GST @18%", "Rs.32,400"]], total: "Rs.2,12,400" },
        { name: "Elegant", pro: true, layout: "accent-bottom", accent: "#D97706", bg: "#FFFBEB", desc: "Gold premium quote", from: "Prestige Agency", gstin: "24PREST9603R1ZM", to: "Diamond Holdings", items: [["Campaign", "Rs.2,00,000"], ["Production", "Rs.80,000"], ["Analytics", "Rs.40,000"]], rows: [["Subtotal", "Rs.3,20,000"], ["GST @18%", "Rs.57,600"]], total: "Rs.3,77,600" },
    ],
    receipt: [
        { name: "Classic", pro: false, layout: "header", accent: "#0D9488", bg: "#F0FDFA", desc: "Standard receipt", from: "Patel Enterprises", gstin: "RCP-2026-001", to: "Sharma Consulting", items: [["Consulting Fee", "Rs.15,000"], ["GST @18%", "Rs.2,700"], ["Mode", "UPI"]], rows: [["Date", "19 Mar 2026"], ["Status", "Paid"]], total: "Rs.17,700" },
        { name: "Minimal", pro: false, layout: "minimal", accent: "#111827", bg: "#F8F9FA", desc: "Clean receipt", from: "Kumar Services", gstin: "RCP-2026-042", to: "Singh Traders", items: [["Service Charge", "Rs.8,000"], ["GST @18%", "Rs.1,440"], ["Mode", "NEFT"]], rows: [["Date", "20 Mar 2026"], ["Status", "Paid"]], total: "Rs.9,440" },
        { name: "Modern", pro: true, layout: "sidebar", accent: "#6366F1", bg: "#EEF2FF", desc: "Modern design", from: "Reddy Solutions", gstin: "RCP-2026-108", to: "Mehta Group", items: [["Annual Maintenance", "Rs.24,000"], ["Support", "Rs.6,000"], ["Mode", "Cheque"]], rows: [["Date", "21 Mar 2026"], ["Status", "Paid"]], total: "Rs.35,400" },
        { name: "Corporate", pro: true, layout: "centered", accent: "#1E3A5F", bg: "#EFF6FF", desc: "Formal corporate", from: "Blue Services", gstin: "RCP-2026-215", to: "National Industries", items: [["License Fee", "Rs.50,000"], ["GST @18%", "Rs.9,000"], ["Mode", "RTGS"]], rows: [["Date", "22 Mar 2026"], ["Status", "Paid"]], total: "Rs.59,000" },
        { name: "Elegant", pro: true, layout: "accent-bottom", accent: "#D97706", bg: "#FFFBEB", desc: "Luxury receipt", from: "Prestige Services", gstin: "RCP-2026-089", to: "Diamond Corp", items: [["Premium Package", "Rs.1,50,000"], ["GST @18%", "Rs.27,000"], ["Mode", "Wire"]], rows: [["Date", "23 Mar 2026"], ["Status", "Paid"]], total: "Rs.1,77,000" },
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
        description: "For individuals & freelancers getting started",
        subNote: "No expiration date, use anytime.",
        includedFeatures: ["All document types access", "Unlimited PDF downloads", "GST auto-calculation", "2 Free templates"],
        notIncludedFeatures: ["Logo upload", "Batch CSV processing", "Cloud document storage"],
        ctaLabel: "Get Started Free", ctaHref: "/invoice",
        highlighted: false,
    },
    {
        plan: "Business Pro", price: "₹199", originalPrice: "₹399", period: "/month",
        description: "For individuals & growing businesses",
        badge: "Most Popular",
        includedFeatures: ["Everything in Free", "Logo upload & custom branding", "Batch document generation (CSV)", "Store up to 20 documents in cloud", "Premium templates", "Priority support"],
        notIncludedFeatures: [],
        ctaLabel: "Start Pro – ₹199/month", ctaHref: "/signup",
        extraLink: "/batch", extraLinkLabel: "See Batch Processing →",
        highlighted: true,
    },
    {
        plan: "Enterprise", price: "₹399", originalPrice: "₹799", period: "/month",
        description: "For teams & high-volume document workflows",
        badge: "Best for Teams",
        includedFeatures: ["Everything in Pro", "Store up to 50 documents in cloud", "Team access / multi-user login", "Priority processing & faster performance", "Dedicated support"],
        notIncludedFeatures: [],
        ctaLabel: "Upgrade to Enterprise", ctaHref: "/signup",
        highlighted: false,
    },
];

const FAQS = [
    { q: "What is DocMinty and how does it work?", a: "DocMinty is a digital document platform that allows you to create, manage, and sign documents online. You can generate documents, download PDFs, and manage everything from a single dashboard." },
    { q: "Are my documents secure on DocMinty?", a: "Yes, we prioritize security. All your documents are securely stored and protected using industry-standard encryption to ensure your data remains safe and private." },
    { q: "Can I use DocMinty for free?", a: "Yes, DocMinty offers a free plan with essential features. You can upgrade anytime to access advanced features like cloud storage, branding, and batch processing." },
    { q: "What payment methods do you accept?", a: "We support secure online payments via UPI, credit cards, and other standard payment methods for a smooth and safe checkout experience." },
    { q: "Will my subscription renew automatically?", a: "Yes, subscriptions may renew automatically depending on the plan. You can manage or cancel your subscription anytime from your account settings." },
    { q: "Can I upgrade or downgrade my plan anytime?", a: "Absolutely. You can upgrade or change your plan at any time based on your needs, and the changes will reflect immediately." },
    { q: "Do you offer support if I face any issues?", a: "Yes, we provide support for all users. Pro and Enterprise users get priority and dedicated support for faster assistance." },
    { q: "Can multiple users access the same account?", a: "Yes, our Enterprise plan supports team access, allowing multiple users to collaborate and manage documents efficiently." },
];

// ── Sub components ────────────────────────────────────────────

function AnimatedNumber({ end, suffix, decimals = 0, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const startTime = performance.now();
        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3); // cubic ease out
            setCount(start + (end - start) * easeOut);
            if (progress < 1) requestAnimationFrame(update);
            else setCount(end);
        };
        requestAnimationFrame(update);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref}>
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
}

function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{
            transition: "all 0.3s ease",
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "0 20px",
            boxShadow: open ? "0 10px 15px -3px rgba(0,0,0,0.05)" : "none",
            height: "fit-content"
        }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "16px"
                }}
            >
                <span style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: open ? T : "#0F172A",
                    fontFamily: "Space Grotesk, sans-serif",
                    transition: "color 0.2s",
                    lineHeight: 1.4
                }}>{q}</span>
                <div style={{
                    background: open ? T : "#F1F5F9",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                    <ChevronDown size={14} color={open ? "#fff" : "#94A3B8"} />
                </div>
            </button>
            <div style={{
                maxHeight: open ? "300px" : "0",
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                opacity: open ? 1 : 0
            }}>
                <p style={{
                    fontSize: "14px",
                    color: "#64748B",
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                    fontFamily: "Inter, sans-serif"
                }}>{a}</p>
            </div>
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
                display: "flex", flexDirection: "column", gap: "12px",
                padding: "20px",
                border: `1px solid ${hovered ? T : "#E5E7EB"}`,
                borderRadius: "16px",
                background: "#fff",
                textDecoration: "none",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered ? `0 12px 24px ${T}15` : "0 2px 4px rgba(0,0,0,0.02)",
                position: "relative",
                height: "100%",
                flex: 1,
            }}
        >
            {doc.badge && (
                <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: "#FEF3C7", color: "#D97706",
                    fontSize: "10px", fontWeight: 800, padding: "3px 8px",
                    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                    {doc.badge}
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                    width: "40px", height: "40px", flexShrink: 0,
                    borderRadius: "12px",
                    background: hovered ? T : TL,
                    border: `1px solid ${hovered ? T : TB}`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    transition: "all 200ms",
                }}>
                    <doc.icon size={22} color={hovered ? "#fff" : T} strokeWidth={1.5} />
                </div>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "13px", fontWeight: 700,
                    color: hovered ? T : "#111827",
                    margin: 0,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    transition: "color 200ms",
                }}>{doc.label}</p>
            </div>

            <p style={{
                fontSize: "13px", color: "#64748B",
                margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.5,
                flex: 1
            }}>{doc.description}</p>

            <div style={{
                marginTop: "4px",
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "13px", fontWeight: 700, color: T,
                fontFamily: "Space Grotesk, sans-serif",
                opacity: hovered ? 1 : 0.7,
                transition: "opacity 200ms"
            }}>
                Generate Now
                <span style={{ transform: hovered ? "translateX(4px)" : "none", transition: "transform 200ms" }}>→</span>
            </div>
        </Link>
    );
}

function TestiCard({ t }) {
    return (
        <div style={{
            border: `1px solid #E5E7EB`,
            borderRadius: "12px", padding: "20px",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
            whiteSpace: "normal"
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
                "{t.short}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "#E5E7EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700,
                    color: "#6B7280",
                    fontFamily: "Space Grotesk, sans-serif",
                    flexShrink: 0,
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
        ctaParams: { type: "button", text: "Generate Invoice", href: "/invoice" },
        badges: ["Invoice", "Quotation", "Receipt", "Purchase Order", "Delivery Note", "Packing Slip"],
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
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", margin: "0 0 16px", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}><Timer size={16} color={T} /> GST Calculator</p>

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

import { InvoicePreview, DEFAULT_FORM as INV_FORM } from "@/app/invoice/page";
import { QuotationPreview, DEFAULT_FORM as QUOTE_FORM } from "@/app/quotation/page";
import { ReceiptPreview, DEFAULT_FORM as RECPT_FORM } from "@/app/receipt/page";
import { SalaryPreview, DEFAULT_FORM as SAL_FORM } from "@/app/salary-slip/page";
import { CertificatePreview, DEFAULT_FORM as CERT_FORM } from "@/app/certificate/page";

const MOCK_FORMS = {
    invoice: {
        ...INV_FORM,
        fromName: "TechCorp Solutions", fromAddress: "123 Business Park, Phase 1", fromCity: "Mumbai", fromPhone: "+91 9876543210", fromEmail: "billing@techcorp.in", fromGSTIN: "27AABCU9603R1ZM",
        toName: "Client Innovations Ltd", toAddress: "456 Tech Park, Sector 4", toCity: "Pune",
        items: [
            { description: "Software Development", hsn: "9983", qty: "1", rate: "85000", discount: "0", gstRate: "18", amount: "85000" },
            { description: "Cloud Hosting", hsn: "9983", qty: "1", rate: "12000", discount: "0", gstRate: "18", amount: "12000" }
        ]
    },
    quotation: {
        ...QUOTE_FORM,
        fromName: "Creative Agency", fromAddress: "78 Design Street", fromCity: "Bengaluru", fromPhone: "+91 8888888888",
        toName: "Startup Inc", toCity: "Hyderabad",
        items: [
            { description: "Brand Identity Design", hsn: "9983", qty: "1", rate: "45000", discount: "0", gstRate: "18", amount: "45000" },
            { description: "Website Development", hsn: "9983", qty: "1", rate: "90000", discount: "0", gstRate: "18", amount: "90000" }
        ]
    },
    receipt: {
        ...RECPT_FORM,
        fromName: "Consulting Services", fromAddress: "Corporate Road", fromCity: "Delhi",
        toName: "Beta Corp", description: "Professional services rendered for Q1 optimization", amount: "50000", paymentMode: "NEFT"
    },
    'salary-slip': {
        ...SAL_FORM,
        companyName: "Innovate Tech", companyCity: "Chennai", employeeName: "Rohan Sharma", designation: "Senior Engineer", employeeId: "EMP-1029",
        month: "March", year: "2026", basic: "60000", hra: "24000", conveyance: "1600", medical: "1250", providentFund: "4500", professionalTax: "200"
    },
    certificate: {
        ...CERT_FORM,
        orgName: "Institute of Technology", certType: "Certificate of Completion", recipientName: "Aarti Desai", description: "has successfully completed the comprehensive training program", courseName: "Full Stack Web Development", date: "25-Mar-2026", signatureName: "Dr. Vikram Seth", signatureTitle: "Director"
    }
};

const PREVIEW_COMPONENTS = {
    invoice: InvoicePreview,
    quotation: QuotationPreview,
    receipt: ReceiptPreview,
    'salary-slip': SalaryPreview,
    certificate: CertificatePreview
};

function LivePreview({ docType, tmpl }) {
    const Component = PREVIEW_COMPONENTS[docType];
    const form = MOCK_FORMS[docType];
    if (!Component || !form) return null;
    return (
        <div style={{ position: "relative", width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", borderRadius: "12px", overflow: "hidden" }}>
            {tmpl.pro && <WatermarkOverlay />}
            <Component form={form} template={tmpl.name} accent={tmpl.accent} />
        </div>
    );
}


export default function LandingPage() {
    const [selectedDoc, setSelectedDoc] = useState("invoice");
    const [docTab, setDocTab] = useState("finance");
    const [activeDocType, setActiveDocType] = useState("invoice");
    const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(null);
    const [heroSlideIdx, setHeroSlideIdx] = useState(0);
    const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | annual
    const [searchTerm, setSearchTerm] = useState("");

    // Filter tools based on search term
    const filteredTools = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return Object.values(DOC_GROUPS).flat().filter(doc => {
            // Only show the ones belonging to current tab if no search
            return DOC_GROUPS[docTab].find(d => d.id === doc.id);
        });

        const results = [];
        const seen = new Set();
        Object.values(DOC_GROUPS).forEach(group => {
            group.forEach(doc => {
                if (seen.has(doc.id)) return;
                if (doc.label.toLowerCase().includes(query) || doc.description.toLowerCase().includes(query)) {
                    results.push(doc);
                    seen.add(doc.id);
                }
            });
        });
        return results;
    }, [searchTerm, docTab]);

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
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 8px)); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(calc(-50% - 8px)); }
                    100% { transform: translateX(0); }
                }
                .marquee-container {
                    overflow: hidden;
                    width: 100%;
                    position: relative;
                }
                .marquee-container::before,
                .marquee-container::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 120px;
                    z-index: 2;
                    pointer-events: none;
                }
                .marquee-container::before {
                    left: 0;
                    background: linear-gradient(to right, #F0F4F3, transparent);
                }
                .marquee-container::after {
                    right: 0;
                    background: linear-gradient(to left, #F0F4F3, transparent);
                }
                .marquee-content {
                    display: flex;
                    gap: 16px;
                    width: max-content;
                }
                .marquee-content.anim-left {
                    animation: scroll-left 50s linear infinite;
                }
                .marquee-content.anim-right {
                    animation: scroll-right 50s linear infinite;
                }
                .marquee-container:hover .marquee-content {
                    animation-play-state: paused;
                }
                .templates-container { display: flex; flex-direction: column; border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; background: #fff; }
                .templates-tabs { display: flex; gap: 10px; border-bottom: 1px solid #E5E7EB; padding: 16px 20px; overflow-x: auto; scrollbar-width: none; background: #fff; -ms-overflow-style: none; }
                .templates-tabs::-webkit-scrollbar { display: none; }
                .tab-item, .tab-item-active {
                    display: flex; align-items: center; gap: 8px; padding: 10px 18px; 
                    border: 1px solid #E5E7EB; border-radius: 10px; background: #fff; 
                    cursor: pointer; transition: all 200ms; white-space: nowrap; 
                    font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; 
                    color: #374151; transition: all 200ms; border: 1px solid #E5E7EB;
                }
                .tab-item:hover { border-color: #0D9488; color: #0D9488; transform: translateY(-1px); }
                .tab-item-active { background: #0D9488 !important; color: #fff !important; border-color: #0D9488 !important; box-shadow: 0 4px 12px #0D948830; }
                .section-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(28px, 4vw, 36px); font-weight: 800; color: #111827; text-align: center; margin-bottom: 12px; }
                .section-subtitle { font-family: 'Inter', sans-serif; font-size: 16px; color: #6B7280; text-align: center; margin-bottom: 48px; max-width: 600px; margin-left: auto; margin-right: auto; }
                
                .templates-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
                .preview-frame { margin-top: 16px; border: 1px solid #E5E7EB; border-radius: 10px; overflow: hidden; background: #fff; position: relative; }
                
                 @media (max-width: 1200px) {
                    .templates-grid { grid-template-columns: repeat(4, 1fr) !important; }
                    .preview-doc-wrapper { zoom: 0.95; width: 800px !important; margin: 0 auto; }
                    .preview-doc-container { height: auto !important; padding-bottom: 24px !important; }
                 }
                 
                 @media (max-width: 1024px) {
                    .templates-grid { grid-template-columns: repeat(3, 1fr) !important; }
                    .preview-doc-wrapper {
                        zoom: 0.9;
                        width: 1030px !important;
                        margin: 0 auto;
                    }
                 }
                 
                 @media (max-width: 768px) {
                    .templates-tabs { padding: 12px 12px !important; }
                    .tab-item, .tab-item-active { padding: 8px 14px !important; font-size: 12px !important; }
                    .templates-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
                    .preview-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
                    .preview-frame { border-radius: 12px !important; margin: 16px 0 !important; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E5E7EB !important; }
                    .preview-doc-container { overflow: visible !important; padding: 0 !important; display: flex; justify-content: center; height: auto !important; }
                    .preview-doc-wrapper { 
                        width: 800px !important; 
                        zoom: 0.85;
                        flex-shrink: 0;
                        margin: 0 auto;
                        padding: 24px 24px !important;
                    }
                    .preview-columns { grid-template-columns: 1fr !important; }
                    .preview-footer-columns { flex-direction: column !important; gap: 16px !important; }
                    .preview-footer-columns > div { width: 100% !important; padding-left: 0 !important; }
                    .tab-cta-container { display: none !important; }
                    
                    /* HOW IT WORKS MOBILE */
                    .step-row-3col { 
                        display: flex !important; 
                        flex-direction: column !important; 
                        gap: 20px !important; 
                        text-align: center !important;
                        margin-bottom: 60px !important;
                    }
                    .step-row-3col > div:nth-child(1) { order: 2; width: 100% !important; text-align: center !important; }
                    .step-row-3col > div:nth-child(2) { order: 1; margin-bottom: 10px; }
                    .step-row-3col > div:nth-child(3) { order: 3; width: 100% !important; text-align: center !important; }
                    .step-row-3col h3, .step-row-3col p { text-align: center !important; width: 100% !important; }
                    .tip-box { margin: 10px auto !important; max-width: 100% !important; text-align: left !important; }
                    
                    .avatar-trust-group { display: flex; align-items: center; gap: 10px; }
                    @media (max-width: 768px) {
                        .avatar-trust-group { flex-direction: column !important; text-align: center !important; gap: 12px !important; }
                    }
                 }
                 
                 @media (max-width: 640px) {
                    .preview-doc-wrapper { zoom: 0.65; }
                 }
                 
                 @media (max-width: 480px) {
                    .preview-doc-wrapper { zoom: 0.45; padding: 24px 44px !important; }
                 }
                 
                 @media (max-width: 380px) {
                    .preview-doc-wrapper { zoom: 0.41; }
                 }
            `}} />
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
                <div className="section-wrap" style={{ padding: "64px 24px" }}>
                    <h2 className="section-title">Pick your document type</h2>
                    <p className="section-sub">Each tool is optimised for a specific business need.</p>

                    {/* Search Input */}
                    <div style={{ maxWidth: "500px", margin: "0 auto 32px", position: "relative" }}>
                        <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search documents (Invoice, Salary Slip...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%", padding: "14px 14px 14px 48px",
                                borderRadius: "12px", border: "1px solid #E2E8F0",
                                background: "#fff", transition: "all 200ms",
                                outline: "none", fontSize: "15px", fontFamily: "Inter, sans-serif",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}
                            onFocus={(e) => e.target.style.borderColor = T}
                            onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", color: "#64748B" }}>
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {!searchTerm && (
                        /* Tabs - Scrollable on mobile */
                        <div className="tab-scroll-container" style={{
                            display: "flex", gap: "8px", overflowX: "auto",
                            scrollbarWidth: "none", msOverflowStyle: "none",
                            marginBottom: "24px", WebkitOverflowScrolling: "touch",
                            paddingBottom: "4px" // prevent shadow cutoff
                        }}>
                            <style dangerouslySetInnerHTML={{ __html: `.tab-scroll-container::-webkit-scrollbar { display: none; }` }} />
                            {DOC_TABS.map((tab) => (
                                <button key={tab.id} onClick={() => setDocTab(tab.id)}
                                    className={docTab === tab.id ? "tab-active" : "tab-inactive"}
                                    style={{ whiteSpace: "nowrap" }}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {searchTerm && (
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#64748B", marginBottom: "16px", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" }}>
                            {filteredTools.length} tools found matching "{searchTerm}"
                        </p>
                    )}

                    <div className="docs-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px",
                    }}>
                        {filteredTools.map((doc) => (
                            <DocCard key={doc.id} doc={doc} />
                        ))}
                    </div>

                    {filteredTools.length === 0 && (
                        <div style={{ textAlign: "center", padding: "48px 0", color: "#64748B" }}>
                            <p style={{ fontSize: "16px", fontWeight: 600 }}>No documents found for "{searchTerm}"</p>
                            <button onClick={() => setSearchTerm("")} style={{ marginTop: "12px", border: "none", background: "none", color: T, fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
                                Clear search
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── DOCUMENT PREVIEW ── */}
            <section style={{ background: BG, borderTop: "1px solid #D1D5DB" }}>
                <div className="section-wrap">
                    <h2 className="section-title">Document Templates</h2>
                    <p className="section-sub">5 professional templates for each document type. 2 free forever, 3 exclusive Pro designs.</p>

                    {/* Main Container */}
                    <div className="templates-container">

                        {/* Top Navigation - doc type selector */}
                        <div className="templates-tabs">
                            {PREVIEW_DOC_TYPES.slice(0, 5).map(dt => (
                                <button key={dt.id} onClick={() => { setActiveDocType(dt.id); setActiveTemplateIdx(0); }}
                                    className={activeDocType === dt.id ? "tab-item-active" : "tab-item"}>
                                    <dt.icon size={18} strokeWidth={2} />
                                    <span>{dt.label}</span>
                                </button>
                            ))}

                            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                                <Link href={`/${activeDocType}`} style={{
                                    textDecoration: "none", background: "#f0fdfa", color: "#0d9488",
                                    fontSize: "12px", fontWeight: 700, padding: "8px 16px", borderRadius: "8px",
                                    border: "1px solid #ccfbf1", display: "flex", alignItems: "center", gap: "6px",
                                    fontFamily: "Inter, sans-serif"
                                }}>
                                    <Download size={14} /> CREATE FREE
                                </Link>
                            </div>
                        </div>

                        {/* Templates area */}
                        <div style={{ flex: 1, padding: "24px", background: BG, width: "100%", overflow: "hidden" }}>
                            {/* Header */}
                            <div className="preview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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
                            <div className="templates-grid" style={{ marginBottom: "32px" }}>
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
                                            <div style={{ background: tmpl.bg, padding: "8px 8px 0", height: "100px", display: "flex", flexDirection: tmpl.layout === "sidebar" ? "row" : "column", overflow: "hidden" }}>
                                                {tmpl.layout === "sidebar" ? (
                                                    <>
                                                        <div style={{ width: "25px", height: "100%", background: tmpl.accent, borderRadius: "4px 0 0 0" }} />
                                                        <div style={{ flex: 1, background: "#fff", padding: "6px" }}>
                                                            {[70, 90, 60].map((w, i) => (
                                                                <div key={i} style={{ height: "2px", background: "#F3F4F6", borderRadius: "1px", marginBottom: "4px", width: `${w}%` }} />
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : tmpl.layout === "centered" ? (
                                                    <div style={{ background: "#fff", padding: "6px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <div style={{ width: "50px", height: "4px", background: tmpl.accent, borderRadius: "2px", marginBottom: "4px" }} />
                                                        <div style={{ width: "30px", height: "3px", background: "#E5E7EB", borderRadius: "1px", marginBottom: "7px" }} />
                                                        {[80, 60, 80, 50].map((w, i) => (
                                                            <div key={i} style={{ height: "2px", background: "#F3F4F6", borderRadius: "1px", marginBottom: "3px", width: `${w}%` }} />
                                                        ))}
                                                    </div>
                                                ) : tmpl.layout === "accent-bottom" ? (
                                                    <>
                                                        <div style={{ background: "#fff", padding: "6px", flex: 1 }}>
                                                            {[100, 70, 90, 60].map((w, i) => (
                                                                <div key={i} style={{ height: "3px", background: "#F3F4F6", borderRadius: "1px", marginBottom: "4px", width: `${w}%` }} />
                                                            ))}
                                                        </div>
                                                        <div style={{ height: "6px", background: tmpl.accent, margin: "0 -8px" }} />
                                                    </>
                                                ) : (
                                                    <>
                                                        {tmpl.layout !== "minimal" && (
                                                            <div style={{ background: tmpl.accent, borderRadius: "4px 4px 0 0", padding: "4px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <div style={{ width: "40px", height: "4px", background: "rgba(255,255,255,0.8)", borderRadius: "2px" }} />
                                                                <div style={{ width: "15px", height: "4px", background: "rgba(255,255,255,0.5)", borderRadius: "2px" }} />
                                                            </div>
                                                        )}
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
                                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                                                    <div style={{
                                                        background: "#1E293B",
                                                        padding: "6px 16px",
                                                        borderRadius: "24px",
                                                        transform: "rotate(-12deg)",
                                                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        border: "1px solid rgba(255,255,255,0.1)"
                                                    }}>
                                                        <span style={{
                                                            fontSize: "9px",
                                                            fontWeight: 900,
                                                            color: "#fff",
                                                            fontFamily: "Space Grotesk, sans-serif",
                                                            letterSpacing: "0.12em",
                                                            textTransform: "uppercase"
                                                        }}>DocMinty PRO</span>
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
                                return <LivePreview docType={activeDocType} tmpl={tmpl} />;
                            })()}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{
                backgroundColor: BG, borderTop: "1px solid #D1D5DB",
                backgroundImage: "radial-gradient(circle, #C7D5D3 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}>
                <div className="section-wrap">
                    <h2 className="section-title">How it works</h2>
                    <p className="section-subtitle">Everything you need to know about DocMinty.</p>

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
                                }}>
                                    <AnimatedNumber end={s.num} suffix={s.suffix} decimals={s.decimals} />
                                </p>
                                <p style={{ fontSize: "13px", color: "#99F6E4", margin: 0, fontFamily: "Inter, sans-serif" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ background: BG, borderTop: "1px solid #D1D5DB", overflow: "hidden" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 0" }}>
                    <h2 className="section-title" style={{ padding: "0 24px" }}>Hear what our customers say</h2>
                    <p className="section-sub" style={{ padding: "0 24px" }}>Discover the stories of delighted customers and their experiences.</p>

                    <div className="marquee-container" style={{ marginBottom: "16px" }}>
                        <div className="marquee-content anim-left">
                            {[...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(0, 3)].map((t, i) => (
                                <div key={i} style={{ width: "340px", flexShrink: 0 }}>
                                    <TestiCard t={t} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="marquee-container">
                        <div className="marquee-content anim-right">
                            {[...TESTIMONIALS.slice(3, 6), ...TESTIMONIALS.slice(3, 6)].map((t, i) => (
                                <div key={i} style={{ width: "340px", flexShrink: 0 }}>
                                    <TestiCard t={t} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section style={{ background: "#fff", borderTop: "1px solid #D1D5DB" }}>
                <div className="section-wrap">
                    <h2 className="section-title">Simple, transparent pricing</h2>
                    <p className="section-sub">Free forever for individual use. Upgrade when you need more.</p>

                    {/* Billing Toggle */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                        <div style={{ display: "inline-flex", background: "#F3F4F6", borderRadius: "10px", padding: "4px", gap: "4px" }}>
                            {[["monthly", "Monthly"], ["annual", "Annual"]].map(([val, label]) => (
                                <button key={val} onClick={() => setBillingCycle(val)} style={{
                                    padding: "8px 22px", borderRadius: "8px", border: "none",
                                    fontSize: "13px", fontWeight: 700, cursor: "pointer",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    background: billingCycle === val ? "#fff" : "transparent",
                                    color: billingCycle === val ? "#111827" : "#6B7280",
                                    boxShadow: billingCycle === val ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                                    transition: "all 150ms",
                                }}>
                                    {label}
                                    {val === "annual" && (
                                        <span style={{ marginLeft: "6px", background: T, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px" }}>
                                            25% OFF
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pricing-grid" style={{
                        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", alignItems: "start",
                    }}>
                        {PRICING_PLANS.map((plan, i) => <PricingCard key={i} {...plan} billing={billingCycle} />)}
                    </div>

                    {/* Trust bar */}
                    <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ display: "flex", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>100%</span>
                            <span style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>positive reviews</span>
                        </div>

                        {/* Trustpilot + Google badges with real icons */}
                        <div style={{ display: "flex", gap: "12px" }}>
                            {/* Trustpilot */}
                            <div className="trust-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L14.09 8.26H21L15.45 12.1L17.54 18.36L12 14.52L6.46 18.36L8.55 12.1L3 8.26H9.91L12 2Z" fill="#00B67A" />
                                </svg>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>Trustpilot</span>
                            </div>
                            {/* Google */}
                            <div className="trust-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>Google</span>
                            </div>
                        </div>

                        {/* Indian user avatars — mix of photos + initials */}
                        <div className="avatar-trust-group">
                            <div style={{ display: "flex" }}>
                                {[
                                    { type: "img", src: "https://i.pravatar.cc/32?img=11", label: "Rahul" },
                                    { type: "img", src: "https://i.pravatar.cc/32?img=47", label: "Priya" },
                                    { type: "text", init: "AM", bg: "#0D9488", color: "#fff" },
                                    { type: "img", src: "https://i.pravatar.cc/32?img=32", label: "Sunita" },
                                    { type: "text", init: "VN", bg: "#6366F1", color: "#fff" },
                                    { type: "img", src: "https://i.pravatar.cc/32?img=60", label: "Deepa" },
                                    { type: "text", init: "RG", bg: "#D97706", color: "#fff" },
                                    { type: "img", src: "https://i.pravatar.cc/32?img=25", label: "Arjun" },
                                ].map((av, i) => (
                                    <div key={i} style={{
                                        width: "32px", height: "32px", borderRadius: "50%",
                                        border: "2px solid #fff",
                                        overflow: "hidden",
                                        marginLeft: i === 0 ? "0" : "-8px",
                                        zIndex: 8 - i,
                                        position: "relative",
                                        flexShrink: 0,
                                        background: av.type === "text" ? av.bg : "#E5E7EB",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "11px", fontWeight: 700,
                                        color: av.type === "text" ? av.color : "transparent",
                                        fontFamily: "Inter, sans-serif",
                                        transition: "transform 150ms",
                                        cursor: "default",
                                    }}>
                                        {av.type === "img" ? (
                                            <img
                                                src={av.src}
                                                alt={av.label}
                                                width={32}
                                                height={32}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                        ) : av.init}
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
            <section style={{ background: "#F1F5F9", borderTop: "1px solid #E2E8F0" }}>
                <div className="section-wrap" style={{ maxWidth: "1100px", padding: "80px 24px" }}>
                    <h2 className="section-title">Frequently asked questions</h2>
                    <p className="section-sub">Everything you need to know about DocMinty.</p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                        gap: "20px",
                        alignItems: "start"
                    }}>
                        {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>

                    <p style={{
                        marginTop: "48px",
                        textAlign: "center",
                        fontSize: "15px",
                        color: "#64748B",
                        fontFamily: "Inter, sans-serif"
                    }}>
                        Have more questions? <a href="mailto:support@docminty.com" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Contact our support team anytime.</a>
                    </p>
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
