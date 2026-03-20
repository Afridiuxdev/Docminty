import Navbar from "./Navbar";
import Footer from "./Footer";
import AdSense from "./AdSense";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const T = "#0D9488";
const BG = "#F0F4F3";

export default function DocPageShell({
    title,
    subtitle,
    description,
    badge,
    relatedDocs = [],
    children,
    faqItems = [],
}) {
    return (
        <>
            <Navbar />
            <main style={{ background: BG, minHeight: "100vh" }}>

                {/* Page header */}
                <div style={{
                    background: "#fff", borderBottom: "1px solid #E5E7EB",
                    padding: "40px 24px",
                }}>
                    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                        {badge && (
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                background: "#F0FDFA", border: "1px solid #99F6E4",
                                borderRadius: "20px", padding: "3px 12px", marginBottom: "12px",
                            }}>
                                <span style={{
                                    fontSize: "12px", fontWeight: 600, color: T,
                                    fontFamily: "Inter, sans-serif",
                                }}>{badge}</span>
                            </div>
                        )}
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "clamp(24px, 3vw, 36px)",
                            fontWeight: 700, color: "#111827",
                            margin: "0 0 8px",
                        }}>{title}</h1>
                        {subtitle && (
                            <p style={{
                                fontSize: "16px", color: "#6B7280",
                                margin: "0 0 4px", fontFamily: "Inter, sans-serif",
                            }}>{subtitle}</p>
                        )}
                        {description && (
                            <p style={{
                                fontSize: "14px", color: "#9CA3AF",
                                margin: 0, fontFamily: "Inter, sans-serif",
                            }}>{description}</p>
                        )}
                    </div>
                </div>

                {/* AdSense top */}
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
                    <AdSense adSlot="SLOT_ID_TOP" />
                </div>

                {/* Main content */}
                <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "24px" }}>
                    {children}
                </div>

                {/* Related docs */}
                {relatedDocs.length > 0 && (
                    <section style={{
                        borderTop: "1px solid #D1D5DB",
                        padding: "48px 24px",
                        background: "#fff",
                    }}>
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                            <h2 style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontSize: "20px", fontWeight: 700,
                                color: "#111827", margin: "0 0 20px",
                            }}>Related documents</h2>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "12px",
                            }}>
                                {relatedDocs.map((doc) => (
                                    <Link key={doc.href} href={doc.href} style={{
                                        display: "flex", alignItems: "center", gap: "10px",
                                        padding: "14px 16px",
                                        border: "1px solid #E5E7EB", borderRadius: "10px",
                                        background: "#fff", textDecoration: "none",
                                        transition: "all 150ms",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.background = "#F0FDFA"; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#fff"; }}
                                    >
                                        <span style={{ fontSize: "20px" }}>{doc.icon}</span>
                                        <span style={{
                                            fontSize: "13px", fontWeight: 600, color: "#374151",
                                            fontFamily: "Space Grotesk, sans-serif",
                                        }}>{doc.label}</span>
                                        <ArrowRight size={13} color={T} style={{ marginLeft: "auto" }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {faqItems.length > 0 && (
                    <section style={{
                        borderTop: "1px solid #D1D5DB",
                        padding: "48px 24px",
                        background: BG,
                    }}>
                        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                            <h2 style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontSize: "22px", fontWeight: 700,
                                color: "#111827", margin: "0 0 24px", textAlign: "center",
                            }}>Frequently asked questions</h2>
                            {faqItems.map((faq, i) => (
                                <div key={i} style={{ borderBottom: "1px solid #E5E7EB", padding: "14px 0" }}>
                                    <p style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontSize: "14px", fontWeight: 600,
                                        color: "#111827", margin: "0 0 4px",
                                    }}>{faq.q}</p>
                                    <p style={{
                                        fontSize: "13px", color: "#6B7280",
                                        margin: 0, lineHeight: 1.6,
                                        fontFamily: "Inter, sans-serif",
                                    }}>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* AdSense bottom */}
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 40px" }}>
                    <AdSense adSlot="SLOT_ID_BOTTOM" />
                </div>
            </main>

            <AdSense adSlot="SLOT_ID_SIDEBAR" sidebarFixed />
            <Footer />
        </>
    );
}