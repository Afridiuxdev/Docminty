"use client";
import Link from "next/link";
import { FileText } from "lucide-react";

const col1 = [
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
    }
];

const col2 = [
    {
        title: "HR & Tools",
        links: [
            { label: "Experience Letter", href: "/experience-letter" },
            { label: "Resignation Letter", href: "/resignation-letter" },
            { label: "Job Offer Letter", href: "/job-offer-letter" },
            { label: "Purchase Order", href: "/purchase-order" },
            { label: "Rent Receipt", href: "/rent-receipt" },
            { label: "Payment Voucher", href: "/payment-voucher" },
        ],
    }
];

const col3 = [
    {
        title: "PDF Tools",
        links: [
            { label: "Merge PDF", href: "/tools/merge-pdf" },
            { label: "Split PDF", href: "/tools/split-pdf" },
            { label: "Compress PDF", href: "/tools/compress-pdf" },
            { label: "PDF to Word", href: "/tools/pdf-to-word" },
            { label: "Word to PDF", href: "/tools/word-to-pdf" },
            { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
            { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
        ],
    }
];

const col4 = [
    {
        title: "Calculators",
        links: [
            { label: "EMI Calculator", href: "/calculators/emi-calculator" },
            { label: "GST Calculator", href: "/calculators/gst-calculator" },
            { label: "Salary Calculator", href: "/calculators/salary-calculator" },
            { label: "Loan Calculator", href: "/calculators/loan-calculator" },
            { label: "Profit Margin", href: "/calculators/profit-margin-calculator" },
        ],
    }
];

const linkColumns = [col1, col2, col3, col4];

export default function Footer() {
    return (
        <>
            <footer style={{
                borderTop: "1px solid #D1D5DB",
                background: "#fff",
                fontFamily: "Inter, sans-serif",
            }}>
                <div style={{
                    maxWidth: "1240px",
                    margin: "0 auto",
                    padding: "64px 24px 32px",
                }}>
                    <div className="footer-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr repeat(4, 1fr)",
                        gap: "56px",
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
                                Made with ❤️ in Chennai, India 🇮🇳
                            </p>
                        </div>

                        {/* Link columns */}
                        {linkColumns.map((colGroup, idx) => (
                            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                {colGroup.map((col) => (
                                    <div key={col.title}>
                                        <p style={{
                                            fontSize: "12px", fontWeight: 700,
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            color: "#111827", marginBottom: "16px",
                                            fontFamily: "Space Grotesk, sans-serif",
                                        }}>
                                            {col.title}
                                        </p>
                                        <div style={{
                                            display: "flex", flexDirection: "column", gap: "12px",
                                        }}>
                                            {col.links.map((l) => (
                                                <Link
                                                    key={l.href}
                                                    href={l.href}
                                                    className="footer-link"
                                                    style={{ fontSize: "14px", color: "#4B5563" }}
                                                >
                                                    {l.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
                            <Link href="/blogs" className="footer-link">Blogs</Link>
                            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link href="/terms" className="footer-link">Terms of Service</Link>
                            <Link href="/contact" className="footer-link">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    );
}