"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Menu, X, ChevronDown, FileText, FileQuestion, Receipt, ShoppingCart, 
    Box, CreditCard, Home, Banknote, Briefcase, LogOut, Mail, Award, 
    GraduationCap, CheckCircle, PlusSquare, Scissors, Minimize, FileInput, 
    FileOutput, Image, Calculator, Percent, BadgeIndianRupee, TrendingUp, 
    Coins, BarChart3, Tag, QrCode
} from "lucide-react";
import { getAccessToken, clearTokens } from "@/api/auth";

const T = "#0D9488";

const TEMPLATE_GROUPS = [
    {
        title: "Business Documents",
        href: "/business-documents",
        items: [
            { label: "Invoice", href: "/invoice", badge: "Popular", icon: FileText },
            { label: "Quotation", href: "/quotation", icon: FileQuestion },
            { label: "Receipt", href: "/receipt", icon: Receipt },
            { label: "Proforma Invoice", href: "/proforma-invoice", icon: FileText },
            { label: "Purchase Order", href: "/purchase-order", icon: ShoppingCart },
            { label: "Packing Slip", href: "/packing-slip", icon: Box },
            { label: "Payment Voucher", href: "/payment-voucher", icon: CreditCard },
            { label: "Rent Receipt", href: "/rent-receipt", icon: Home },
        ]
    },
    {
        title: "HR Documents",
        href: "/hr-documents",
        items: [
            { label: "Salary Slip", href: "/salary-slip", icon: Banknote },
            { label: "Experience Letter", href: "/experience-letter", icon: Briefcase },
            { label: "Resignation Letter", href: "/resignation-letter", icon: LogOut },
            { label: "Job Offer Letter", href: "/job-offer-letter", icon: Mail },
        ]
    },
    {
        title: "Certificates",
        href: "/certificates",
        items: [
            { label: "Certificate", href: "/certificate", badge: "Popular", icon: Award },
            { label: "Internship Certificate", href: "/internship-certificate", icon: GraduationCap },
            { label: "Verify Certificate", href: "/verify-certificate", icon: CheckCircle },
        ]
    }
];

const PDF_TOOLS = [
    { label: "Merge PDF", href: "/tools/merge-pdf", icon: PlusSquare },
    { label: "Split PDF", href: "/tools/split-pdf", icon: Scissors },
    { label: "Compress PDF", href: "/tools/compress-pdf", icon: Minimize },
    { label: "PDF to Word", href: "/tools/pdf-to-word", icon: FileInput },
    { label: "Word to PDF", href: "/tools/word-to-pdf", icon: FileOutput },
    { label: "PDF to JPG", href: "/tools/pdf-to-jpg", icon: Image },
    { label: "JPG to PDF", href: "/tools/jpg-to-pdf", icon: FileInput },
];

const CALCULATORS = [
    { label: "EMI Calculator", href: "/calculators/emi-calculator", icon: Calculator },
    { label: "GST Calculator", href: "/calculators/gst-calculator", icon: Percent },
    { label: "Salary Calculator", href: "/calculators/salary-calculator", icon: BadgeIndianRupee, badge: "Popular" },
    { label: "Interest Calculator", href: "/calculators/interest-calculator", icon: TrendingUp },
    { label: "Loan Calculator", href: "/calculators/loan-calculator", icon: Coins },
    { label: "Profit Margin", href: "/calculators/profit-margin-calculator", icon: BarChart3 },
    { label: "Discount Calculator", href: "/calculators/discount-calculator", icon: Tag },
];

const TOOLS = [
    { label: "QR Code Generator", href: "/tools/qr-generator", icon: QrCode },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [docsOpen, setDocsOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [calcOpen, setCalcOpen] = useState(false);
    
    // Individual group toggles for mobile Templates section
    const [expandedGroups, setExpandedGroups] = useState({
        "Templates": true, 
        "PDF Tools": false, 
        "Calculators": false,
        "QR Code": false
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (getAccessToken()) setUser(true);
    }, []);

    const handleLogout = () => {
        clearTokens();
        setUser(null);
        window.location.href = "/";
    };

    const toggleGroup = (title, e) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    // Style helper for nav items
    const navBtnStyle = (isOpen) => ({
        background: "none", border: "none", padding: "6px 12px",
        fontSize: "14px", fontWeight: 500, color: isOpen ? T : "#4B5563",
        display: "flex", alignItems: "center", gap: "4px",
        cursor: "pointer", transition: "all 200ms", textDecoration: "none"
    });

    return (
        <>
            <div style={{
                background: T, color: "white", textAlign: "center",
                fontSize: "13px", fontWeight: 500, padding: "8px 16px",
                fontFamily: "Inter, sans-serif",
            }}>
                🇮🇳 GST-Ready Invoices for Indian Businesses — Free PDF, No Sign-up
            </div>

            <nav style={{
                position: "sticky", top: 0, zIndex: 100,
                background: "#fff", borderBottom: "1px solid #E5E7EB",
                fontFamily: "Inter, sans-serif",
            }}>
                <div style={{
                    maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
                    height: "64px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: "20px",
                }}>

                    {/* Logo Section */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
                        <div style={{ width: "28px", height: "28px", background: T, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FileText size={16} color="white" />
                        </div>
                        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "19px", color: "#111827" }}>
                            Doc<span style={{ color: T }}>Minty</span>
                        </div>
                    </Link>

                    {/* Desktop nav - Refined structure */}
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="desktop-nav">
                        
                        {/* 1. Templates (Mega Dropdown) */}
                        <div style={{ position: "relative" }} onMouseEnter={() => setDocsOpen(true)} onMouseLeave={() => setDocsOpen(false)}>
                            <div style={navBtnStyle(docsOpen)}>
                                Templates <ChevronDown size={14} />
                            </div>
                            {docsOpen && (
                                <div className="dropdown" style={{ minWidth: "680px", padding: "24px", borderRadius: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                                    {TEMPLATE_GROUPS.map((group) => (
                                        <div key={group.title}>
                                            <Link href={group.href} style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", marginBottom: "12px", display: "block" }}>
                                                {group.title}
                                            </Link>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                {group.items.slice(0, 8).map((l) => (
                                                    <Link key={l.href} href={l.href} className="dropdown-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "8px 10px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <l.icon size={15} color={T} strokeWidth={1.5} />
                                                            <span style={{ fontSize: "13px" }}>{l.label}</span>
                                                        </div>
                                                        {l.badge && (
                                                            <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", background: "#F1F5F9", color: "#64748B", borderRadius: "4px", textTransform: "uppercase" }}>
                                                                {l.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. QR Code (Main Menu Item) */}
                        <div style={{ position: "relative" }}>
                            <Link href="/tools/qr-generator" style={navBtnStyle(false)}>
                                <QrCode size={16} color={T} strokeWidth={1.5} style={{ marginRight: "4px" }} /> QR Code
                                <span style={{ fontSize: "8px", fontWeight: 700, padding: "1px 4px", background: T, color: "white", borderRadius: "3px", textTransform: "uppercase", position: "absolute", top: "-4px", right: "0px" }}>
                                    New
                                </span>
                            </Link>
                        </div>

                        {/* 3. PDF Tools */}
                        <div style={{ position: "relative" }} onMouseEnter={() => setPdfOpen(true)} onMouseLeave={() => setPdfOpen(false)}>
                            <Link href="/pdf-tools" style={navBtnStyle(pdfOpen)}>
                                PDF Tools <ChevronDown size={14} />
                            </Link>
                            {pdfOpen && (
                                <div className="dropdown" style={{ minWidth: "220px" }}>
                                    {PDF_TOOLS.map((l) => (
                                        <Link key={l.href} href={l.href} className="dropdown-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "10px 14px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <l.icon size={15} color={T} strokeWidth={1.5} />
                                                <span style={{ fontSize: "13px" }}>{l.label}</span>
                                            </div>
                                            {l.badge && (
                                                <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", background: "#F1F5F9", color: "#64748B", borderRadius: "4px", textTransform: "uppercase" }}>
                                                    {l.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 4. Calculators */}
                        <div style={{ position: "relative" }} onMouseEnter={() => setCalcOpen(true)} onMouseLeave={() => setCalcOpen(false)}>
                            <Link href="/calculators" style={navBtnStyle(calcOpen)}>
                                Calculators <ChevronDown size={14} />
                            </Link>
                            {calcOpen && (
                                <div className="dropdown" style={{ minWidth: "220px" }}>
                                    {CALCULATORS.map((l) => (
                                        <Link key={l.href} href={l.href} className="dropdown-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "10px 14px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <l.icon size={15} color={T} strokeWidth={1.5} />
                                                <span style={{ fontSize: "13px" }}>{l.label}</span>
                                            </div>
                                            {l.badge && (
                                                <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", background: "#F1F5F9", color: "#64748B", borderRadius: "4px", textTransform: "uppercase" }}>
                                                    {l.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/pricing" style={navBtnStyle(false)}>Pricing</Link>
                        <Link href="/batch" style={navBtnStyle(false)}>Bulk Export</Link>
                    </div>

                    {/* Right Side */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }} className="desktop-nav">
                        {user ? (
                            <button onClick={handleLogout} style={{ ...navBtnStyle(false), cursor: "pointer" }}>Logout</button>
                        ) : (
                            <>
                                <Link href="/login" style={{ ...navBtnStyle(false), fontSize: "14px" }}>Sign In</Link>
                                <Link href="/invoice" className="nav-cta">Start Free →</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}>
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile menu - Consolidated to match Desktop grouping */}
                {mobileOpen && (
                    <div style={{ borderTop: "1px solid #E5E7EB", background: "#fff", padding: "12px 0", display: "flex", flexDirection: "column", maxHeight: "80vh", overflowY: "auto" }}>
                        
                        {/* 1. Templates */}
                        <div style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "12px" }}>
                                <div style={{ flex: 1, padding: "12px 20px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                                    Templates
                                </div>
                                <button onClick={(e) => toggleGroup("Templates", e)} style={{ padding: "12px", background: "none", border: "none" }}>
                                    <ChevronDown size={18} style={{ transform: expandedGroups["Templates"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }} />
                                </button>
                            </div>
                            {expandedGroups["Templates"] && (
                                <div style={{ background: "#F9FAFB", paddingBottom: "12px" }}>
                                    {TEMPLATE_GROUPS.map((group) => (
                                        <div key={group.title}>
                                            <div style={{ padding: "8px 40px", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>{group.title}</div>
                                            {group.items.map((l) => (
                                                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "8px 50px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "13px", color: "#4B5563", textDecoration: "none" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <l.icon size={14} color={T} />
                                                        {l.label}
                                                    </div>
                                                    {l.badge && (
                                                        <span style={{ fontSize: "8px", fontWeight: 700, padding: "1px 5px", background: "#F1F5F9", color: "#64748B", borderRadius: "3px", textTransform: "uppercase", marginRight: "20px" }}>
                                                            {l.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Tools */}
                        <div style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "12px" }}>
                                <div style={{ flex: 1, padding: "12px 20px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>Tools</div>
                                <button onClick={(e) => toggleGroup("Tools", e)} style={{ padding: "12px", background: "none", border: "none" }}>
                                    <ChevronDown size={18} style={{ transform: expandedGroups["Tools"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }} />
                                </button>
                            </div>
                            {expandedGroups["Tools"] && (
                                <div style={{ background: "#F9FAFB", paddingBottom: "8px" }}>
                                    {TOOLS.map((l) => (
                                        <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "10px 40px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#4B5563", textDecoration: "none" }}>
                                            <l.icon size={14} color={T} />
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. PDF Tools */}
                        <div style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "12px" }}>
                                <div style={{ flex: 1, padding: "12px 20px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>PDF Tools</div>
                                <button onClick={(e) => toggleGroup("PDF Tools", e)} style={{ padding: "12px", background: "none", border: "none" }}>
                                    <ChevronDown size={18} style={{ transform: expandedGroups["PDF Tools"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }} />
                                </button>
                            </div>
                            {expandedGroups["PDF Tools"] && (
                                <div style={{ background: "#F9FAFB", paddingBottom: "8px" }}>
                                    {PDF_TOOLS.map((l) => (
                                        <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "13px", color: "#4B5563", textDecoration: "none" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <l.icon size={14} color={T} />
                                                {l.label}
                                            </div>
                                            {l.badge && (
                                                <span style={{ fontSize: "8px", fontWeight: 700, padding: "1px 5px", background: "#F1F5F9", color: "#64748B", borderRadius: "3px", textTransform: "uppercase", marginRight: "20px" }}>
                                                    {l.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 4. Calculators */}
                        <div style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "12px" }}>
                                <div style={{ flex: 1, padding: "12px 20px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>Calculators</div>
                                <button onClick={(e) => toggleGroup("Calculators", e)} style={{ padding: "12px", background: "none", border: "none" }}>
                                    <ChevronDown size={18} style={{ transform: expandedGroups["Calculators"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }} />
                                </button>
                            </div>
                            {expandedGroups["Calculators"] && (
                                <div style={{ background: "#F9FAFB", paddingBottom: "8px" }}>
                                    {CALCULATORS.map((l) => (
                                        <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "13px", color: "#4B5563", textDecoration: "none" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <l.icon size={14} color={T} />
                                                {l.label}
                                            </div>
                                            {l.badge && (
                                                <span style={{ fontSize: "8px", fontWeight: 700, padding: "1px 5px", background: "#F1F5F9", color: "#64748B", borderRadius: "3px", textTransform: "uppercase", marginRight: "20px" }}>
                                                    {l.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/pricing" onClick={() => setMobileOpen(false)} style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600, color: "#111827", textDecoration: "none", borderBottom: "1px solid #F3F4F6" }}>Pricing</Link>
                        <Link href="/batch" onClick={() => setMobileOpen(false)} style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600, color: "#111827", textDecoration: "none", borderBottom: "1px solid #F3F4F6" }}>Bulk Export</Link>
                        
                        {/* Auth Links (Mobile) */}
                        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {user ? (
                                <button onClick={handleLogout} style={{ width: "100%", padding: "12px", background: "#F3F4F6", color: "#4B5563", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)} style={{ width: "100%", padding: "12px", background: "#F3F4F6", color: "#4B5563", textAlign: "center", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                                        Sign In
                                    </Link>
                                    <Link href="/invoice" onClick={() => setMobileOpen(false)} style={{ width: "100%", padding: "12px", background: T, color: "white", textAlign: "center", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                                        Start Free →
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
