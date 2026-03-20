"use client";
import Link from "next/link";
import { FileText } from "lucide-react";

const cols = [
    {
        title: "Documents",
        links: [
            { label: "Invoice Generator", href: "/invoice" },
            { label: "Quotation", href: "/quotation" },
            { label: "Receipt", href: "/receipt" },
            { label: "Salary Slip", href: "/salary-slip" },
            { label: "Certificate", href: "/certificate" },
            { label: "Proforma Invoice", href: "/proforma-invoice" },
        ],
    },
    {
        title: "Tools",
        links: [
            { label: "Experience Letter", href: "/experience-letter" },
            { label: "Resignation Letter", href: "/resignation-letter" },
            { label: "Job Offer Letter", href: "/job-offer-letter" },
            { label: "Purchase Order", href: "/purchase-order" },
            { label: "Rent Receipt", href: "/rent-receipt" },
            { label: "Batch Processor", href: "/batch" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Pricing", href: "/pricing" },
            { label: "Sign In", href: "/login" },
            { label: "Sign Up", href: "/signup" },
            { label: "Verify Document", href: "/verify/demo" },
        ],
    },
];

export default function Footer() {
    return (
        <>
            <footer style={{
                borderTop: "1px solid #D1D5DB",
                background: "#fff",
                fontFamily: "Inter, sans-serif",
            }}>
                <div style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "48px 24px 32px",
                }}>
                    <div className="footer-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        gap: "40px",
                    }}>
                        {/* Brand */}
                        <div>
                            <Link href="/" style={{
                                display: "flex", alignItems: "center",
                                gap: "8px", textDecoration: "none", marginBottom: "12px",
                            }}>
                                <div style={{
                                    width: "28px", height: "28px",
                                    background: "#0D9488", borderRadius: "6px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FileText size={16} color="white" />
                                </div>
                                <span style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 800, fontSize: "18px", color: "#111827",
                                }}>
                                    Doc<span style={{ color: "#0D9488" }}>Minty</span>
                                </span>
                            </Link>
                            <p style={{
                                fontSize: "14px", color: "#6B7280",
                                lineHeight: 1.6, maxWidth: "240px", margin: 0,
                            }}>
                                Free GST invoice generator for Indian businesses.
                                Create professional documents in seconds.
                            </p>
                            <p style={{
                                fontSize: "13px", color: "#9CA3AF", marginTop: "16px",
                            }}>
                                Made with ❤️ in India 🇮🇳
                            </p>
                        </div>

                        {/* Link columns */}
                        {cols.map((col) => (
                            <div key={col.title}>
                                <p style={{
                                    fontSize: "11px", fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#9CA3AF", marginBottom: "12px",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>
                                    {col.title}
                                </p>
                                <div style={{
                                    display: "flex", flexDirection: "column", gap: "8px",
                                }}>
                                    {col.links.map((l) => (
                                        <Link
                                            key={l.href}
                                            href={l.href}
                                            className="footer-link"
                                        >
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div style={{
                        borderTop: "1px solid #E5E7EB",
                        marginTop: "40px", paddingTop: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap", gap: "8px",
                    }}>
                        <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
                            © {new Date().getFullYear()} DocMinty. All rights reserved.
                        </p>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link href="/terms" className="footer-link">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    );
}