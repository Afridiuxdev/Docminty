"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, FileText } from "lucide-react";

const T = "#0D9488";

const docLinks = [
    { label: "Invoice", href: "/invoice" },
    { label: "Quotation", href: "/quotation" },
    { label: "Receipt", href: "/receipt" },
    { label: "Salary Slip", href: "/salary-slip" },
    { label: "Certificate", href: "/certificate" },
    { label: "Proforma Invoice", href: "/proforma-invoice" },
];

const toolLinks = [
    // HR Tools
    { label: "Experience Letter", href: "/experience-letter" },
    { label: "Resignation Letter", href: "/resignation-letter" },
    { label: "Job Offer Letter", href: "/job-offer-letter" },
    { label: "Internship Certificate", href: "/internship-certificate" },
    { label: "Purchase Order", href: "/purchase-order" },
    { label: "Packing Slip", href: "/packing-slip" },
    { label: "Rent Receipt", href: "/rent-receipt" },
    { label: "Payment Voucher", href: "/payment-voucher" },
    { label: "Batch Processor", href: "/batch" },
];

const pdfToolLinks = [
    { label: "Merge PDF", href: "/tools/merge-pdf" },
    { label: "Split PDF", href: "/tools/split-pdf" },
    { label: "Compress PDF", href: "/tools/compress-pdf" },
    { label: "PDF to Word", href: "/tools/pdf-to-word" },
    { label: "Word to PDF", href: "/tools/word-to-pdf" },
    { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
    { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
];

const calcLinks = [
    { label: "EMI Calculator", href: "/calculators/emi-calculator" },
    { label: "GST Calculator", href: "/calculators/gst-calculator" },
    { label: "Salary Calculator", href: "/calculators/salary-calculator" },
    { label: "Interest Calculator", href: "/calculators/interest-calculator" },
    { label: "Loan Calculator", href: "/calculators/loan-calculator" },
    { label: "Profit Margin", href: "/calculators/profit-margin-calculator" },
    { label: "Discount Calculator", href: "/calculators/discount-calculator" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [docsOpen, setDocsOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [calcOpen, setCalcOpen] = useState(false);

    return (
        <>
            {/* Announcement bar */}
            <div style={{
                background: T, color: "white", textAlign: "center",
                fontSize: "13px", fontWeight: 500, padding: "8px 16px",
                fontFamily: "Inter, sans-serif",
            }}>
                🇮🇳 GST-Ready Invoices for Indian Businesses — Free PDF, No Sign-up
            </div>

            {/* Main navbar */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 100,
                background: "#fff", borderBottom: "1px solid #E5E7EB",
                fontFamily: "Inter, sans-serif",
            }}>
                <div style={{
                    maxWidth: "1100px", margin: "0 auto", padding: "0 24px",
                    height: "56px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: "24px",
                }}>

                    {/* Logo */}
                    <Link href="/" style={{
                        display: "flex", alignItems: "center",
                        gap: "8px", textDecoration: "none", flexShrink: 0,
                    }}>
                        <div style={{
                            width: "28px", height: "28px", background: T,
                            borderRadius: "6px", display: "flex",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <FileText size={16} color="white" />
                        </div>
                        <span style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 800, fontSize: "18px", color: "#111827",
                        }}>
                            Doc<span style={{ color: T }}>Minty</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        gap: "4px", flex: 1,
                    }} className="desktop-nav">

                        {/* Documents dropdown */}
                        <div style={{ position: "relative" }}
                            onMouseEnter={() => setDocsOpen(true)}
                            onMouseLeave={() => setDocsOpen(false)}
                        >
                            <button className="nav-btn">
                                Documents <ChevronDown size={14} />
                            </button>
                            {docsOpen && (
                                <div className="dropdown">
                                    {docLinks.map((l) => (
                                        <Link key={l.href} href={l.href} className="dropdown-item">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tools dropdown */}
                        <div style={{ position: "relative" }}
                            onMouseEnter={() => setToolsOpen(true)}
                            onMouseLeave={() => setToolsOpen(false)}
                        >
                            <button className="nav-btn">
                                Tools <ChevronDown size={14} />
                            </button>
                            {toolsOpen && (
                                <div className="dropdown">
                                    {toolLinks.map((l) => (
                                        <Link key={l.href} href={l.href} className="dropdown-item">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PDF Tools dropdown */}
                        <div style={{ position: "relative" }}
                            onMouseEnter={() => setPdfOpen(true)}
                            onMouseLeave={() => setPdfOpen(false)}
                        >
                            <button className="nav-btn">
                                PDF Tools <ChevronDown size={14} />
                            </button>
                            {pdfOpen && (
                                <div className="dropdown">
                                    {pdfToolLinks.map((l) => (
                                        <Link key={l.href} href={l.href} className="dropdown-item">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Calculators dropdown */}
                        <div style={{ position: "relative" }}
                            onMouseEnter={() => setCalcOpen(true)}
                            onMouseLeave={() => setCalcOpen(false)}
                        >
                            <button className="nav-btn">
                                Calculators <ChevronDown size={14} />
                            </button>
                            {calcOpen && (
                                <div className="dropdown">
                                    {calcLinks.map((l) => (
                                        <Link key={l.href} href={l.href} className="dropdown-item">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/pricing" className="nav-link">Pricing</Link>
                        <Link href="/batch" className="nav-link">Bulk Export</Link>
                    </div>

                    {/* Right CTA */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        gap: "8px", flexShrink: 0,
                    }} className="desktop-nav">
                        <Link href="/login" className="nav-link">Sign In</Link>
                        <Link href="/invoice" className="nav-cta">Start Free →</Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-menu-btn"
                        style={{
                            display: "none", background: "none",
                            border: "none", cursor: "pointer", padding: "4px",
                        }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div style={{
                        borderTop: "1px solid #E5E7EB", background: "#fff",
                        padding: "16px 24px", display: "flex",
                        flexDirection: "column", gap: "4px",
                    }}>
                        <p style={{
                            fontSize: "11px", fontWeight: 600, color: "#9CA3AF",
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            margin: "8px 0 4px",
                        }}>Documents</p>
                        {docLinks.map((l) => (
                            <Link key={l.href} href={l.href}
                                onClick={() => setMobileOpen(false)}
                                className="mobile-link">
                                {l.label}
                            </Link>
                        ))}
                        <p style={{
                            fontSize: "11px", fontWeight: 600, color: "#9CA3AF",
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            margin: "12px 0 4px",
                        }}>Tools</p>
                        {toolLinks.map((l) => (
                            <Link key={l.href} href={l.href}
                                onClick={() => setMobileOpen(false)}
                                className="mobile-link">
                                {l.label}
                            </Link>
                        ))}
                        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                            <Link href="/login" className="btn-ghost"
                                style={{ flex: 1, justifyContent: "center" }}
                                onClick={() => setMobileOpen(false)}>
                                Sign In
                            </Link>
                            <Link href="/invoice" className="btn-primary"
                                style={{ flex: 1, justifyContent: "center" }}
                                onClick={() => setMobileOpen(false)}>
                                Start Free
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}