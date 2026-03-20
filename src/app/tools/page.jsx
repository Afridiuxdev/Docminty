"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const T = "#0D9488";
const BG = "#F0F4F3";

const PDF_TOOLS = [
    { href: "/tools/merge-pdf", icon: "🔗", label: "Merge PDF", desc: "Combine multiple PDFs into one file", badge: null },
    { href: "/tools/split-pdf", icon: "✂️", label: "Split PDF", desc: "Split a PDF into multiple files by pages", badge: null },
    { href: "/tools/compress-pdf", icon: "🗜️", label: "Compress PDF", desc: "Reduce PDF file size without losing quality", badge: "Popular" },
    { href: "/tools/pdf-to-word", icon: "📝", label: "PDF to Word", desc: "Convert PDF documents to editable Word files", badge: null },
    { href: "/tools/word-to-pdf", icon: "📄", label: "Word to PDF", desc: "Convert Word documents to PDF format", badge: null },
    { href: "/tools/pdf-to-jpg", icon: "🖼️", label: "PDF to JPG", desc: "Convert each PDF page to a JPG image", badge: null },
    { href: "/tools/jpg-to-pdf", icon: "📷", label: "JPG to PDF", desc: "Convert JPG images into a PDF document", badge: null },
];

const CALC_TOOLS = [
    { href: "/calculators/emi-calculator", icon: "🏦", label: "EMI Calculator", desc: "Calculate monthly EMI for loans" },
    { href: "/calculators/gst-calculator", icon: "🇮🇳", label: "GST Calculator", desc: "Add or remove GST from any amount" },
    { href: "/calculators/salary-calculator", icon: "💰", label: "Salary / In-hand", desc: "Calculate take-home salary after deductions" },
    { href: "/calculators/interest-calculator", icon: "📈", label: "Interest Calculator", desc: "Simple & compound interest calculator" },
    { href: "/calculators/loan-calculator", icon: "🏠", label: "Loan Calculator", desc: "Total loan cost with amortization schedule" },
    { href: "/calculators/profit-margin-calculator", icon: "📊", label: "Profit Margin", desc: "Calculate profit, margin & markup" },
    { href: "/calculators/discount-calculator", icon: "🏷️", label: "Discount Calculator", desc: "Calculate final price after discount" },
];

function ToolCard({ tool }) {
    return (
        <Link href={tool.href} style={{
            display: "flex", alignItems: "flex-start",
            gap: "14px", padding: "20px",
            border: "1px solid #D1D5DB",
            borderRadius: "12px", background: "#fff",
            textDecoration: "none", transition: "all 150ms",
            position: "relative",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = T;
                e.currentTarget.style.background = "#F0FDFA";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${T}18`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {tool.badge && (
                <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: "#F59E0B", color: "#fff",
                    fontSize: "10px", fontWeight: 700,
                    padding: "2px 8px", borderRadius: "10px",
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "0.05em",
                }}>
                    {tool.badge}
                </div>
            )}
            <div style={{
                width: "44px", height: "44px",
                background: "#F0FDFA",
                border: `1px solid #99F6E4`,
                borderRadius: "10px",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: "22px", flexShrink: 0,
            }}>
                {tool.icon}
            </div>
            <div>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "14px", fontWeight: 700,
                    color: "#111827", margin: "0 0 4px",
                }}>{tool.label}</p>
                <p style={{
                    fontSize: "12px", color: "#9CA3AF",
                    margin: 0, fontFamily: "Inter, sans-serif",
                    lineHeight: 1.4,
                }}>{tool.desc}</p>
            </div>
        </Link>
    );
}

export default function ToolsHubPage() {
    return (
        <>
            <Navbar />
            <main style={{ background: BG, minHeight: "calc(100vh - 120px)" }}>

                {/* Hero */}
                <div style={{
                    background: "#fff", borderBottom: "1px solid #D1D5DB",
                    padding: "48px 24px",
                }}>
                    <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
                        <p style={{
                            fontSize: "12px", fontWeight: 700, color: T,
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            margin: "0 0 10px", fontFamily: "Space Grotesk, sans-serif",
                        }}>Free Online Tools</p>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "clamp(28px, 3.5vw, 40px)",
                            fontWeight: 700, color: "#111827",
                            margin: "0 0 12px", lineHeight: 1.2,
                        }}>
                            PDF Tools & Finance Calculators
                        </h1>
                        <p style={{
                            fontSize: "16px", color: "#6B7280",
                            margin: "0 auto", maxWidth: "500px",
                            fontFamily: "Inter, sans-serif", lineHeight: 1.6,
                        }}>
                            Free tools for Indian businesses — no sign-up, no watermark,
                            works in your browser.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>

                    {/* PDF Tools */}
                    <div style={{ marginBottom: "48px" }}>
                        <div style={{
                            display: "flex", alignItems: "center",
                            gap: "10px", marginBottom: "20px"
                        }}>
                            <div style={{
                                width: "32px", height: "32px",
                                background: T, borderRadius: "8px",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "16px",
                            }}>
                                📄
                            </div>
                            <div>
                                <h2 style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontSize: "20px", fontWeight: 700,
                                    color: "#111827", margin: 0,
                                }}>PDF Tools</h2>
                                <p style={{
                                    fontSize: "13px", color: "#9CA3AF",
                                    margin: 0, fontFamily: "Inter, sans-serif",
                                }}>
                                    Merge, split, compress and convert PDF files
                                </p>
                            </div>
                        </div>
                        <div className="tools-grid" style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "12px",
                        }}>
                            {PDF_TOOLS.map(tool => (
                                <ToolCard key={tool.href} tool={tool} />
                            ))}
                        </div>
                    </div>

                    {/* Finance Calculators */}
                    <div>
                        <div style={{
                            display: "flex", alignItems: "center",
                            gap: "10px", marginBottom: "20px"
                        }}>
                            <div style={{
                                width: "32px", height: "32px",
                                background: "#7C3AED", borderRadius: "8px",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "16px",
                            }}>
                                🧮
                            </div>
                            <div>
                                <h2 style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontSize: "20px", fontWeight: 700,
                                    color: "#111827", margin: 0,
                                }}>Finance Calculators</h2>
                                <p style={{
                                    fontSize: "13px", color: "#9CA3AF",
                                    margin: 0, fontFamily: "Inter, sans-serif",
                                }}>
                                    EMI, GST, salary and profit calculators for India
                                </p>
                            </div>
                        </div>
                        <div className="tools-grid" style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "12px",
                        }}>
                            {CALC_TOOLS.map(tool => (
                                <ToolCard key={tool.href} tool={tool} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        @media (max-width: 900px) {
          .tools-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

            <Footer />
        </>
    );
}