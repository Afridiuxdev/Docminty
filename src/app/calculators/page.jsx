"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const T = "#0D9488";
const BG = "#F0F4F3";

const CALCULATORS = [
    { href: "/calculators/emi-calculator", icon: "🏦", label: "EMI Calculator", desc: "Monthly EMI for home, car & personal loans", badge: "Popular" },
    { href: "/calculators/gst-calculator", icon: "🇮🇳", label: "GST Calculator", desc: "Add or remove GST — all slabs supported", badge: "India" },
    { href: "/calculators/salary-calculator", icon: "💰", label: "Salary / In-hand", desc: "Calculate take-home salary after all deductions", badge: null },
    { href: "/calculators/interest-calculator", icon: "📈", label: "Interest Calculator", desc: "Simple & compound interest with breakdowns", badge: null },
    { href: "/calculators/loan-calculator", icon: "🏠", label: "Loan Calculator", desc: "Total loan cost with full amortization table", badge: null },
    { href: "/calculators/profit-margin-calculator", icon: "📊", label: "Profit Margin", desc: "Calculate profit, margin percentage & markup", badge: null },
    { href: "/calculators/discount-calculator", icon: "🏷️", label: "Discount Calculator", desc: "Final price, savings & discount percentage", badge: null },
];

export default function CalculatorsPage() {
    return (
        <>
            <Navbar />
            <main style={{ background: BG, minHeight: "calc(100vh - 120px)" }}>
                <div style={{ background: "#fff", borderBottom: "1px solid #D1D5DB", padding: "48px 24px" }}>
                    <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px", fontFamily: "Space Grotesk, sans-serif" }}>Free Calculators</p>
                        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: "#111827", margin: "0 0 12px", lineHeight: 1.2 }}>Finance Calculators for India</h1>
                        <p style={{ fontSize: "16px", color: "#6B7280", margin: "0 auto", maxWidth: "500px", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>EMI, GST, salary, interest and more — all free, no sign-up.</p>
                    </div>
                </div>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
                    <div className="tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
                        {CALCULATORS.map(calc => (
                            <Link key={calc.href} href={calc.href} style={{ display: "flex", flexDirection: "column", padding: "24px", border: "1px solid #D1D5DB", borderRadius: "12px", background: "#fff", textDecoration: "none", transition: "all 150ms", position: "relative" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.background = "#F0FDFA"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${T}18`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                {calc.badge && (<div style={{ position: "absolute", top: "12px", right: "12px", background: calc.badge === "India" ? "#F59E0B" : T, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", fontFamily: "Inter, sans-serif" }}>{calc.badge}</div>)}
                                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{calc.icon}</div>
                                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>{calc.label}</p>
                                <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>{calc.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <style>{`.tools-grid { } @media (max-width: 900px) { .tools-grid { grid-template-columns: repeat(2,1fr) !important; } } @media (max-width: 480px) { .tools-grid { grid-template-columns: 1fr !important; } }`}</style>
            <Footer />
        </>
    );
}