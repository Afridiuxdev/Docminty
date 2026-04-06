"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const T = "#0D9488";
const DT = "#134E4A";

export default function BlogCTA() {
    return (
        <section style={{
            background: DT,
            borderRadius: "24px",
            padding: "48px 32px",
            textAlign: "center",
            marginTop: "64px",
            boxShadow: "0 20px 40px rgba(19, 78, 74, 0.15)",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Background Pattern */}
            <div style={{
                position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
                <h2 style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "clamp(24px, 4vw, 32px)",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "16px",
                    lineHeight: 1.2
                }}>
                    Create your first document in seconds with Docminty
                </h2>
                <p style={{
                    fontSize: "16px",
                    color: "#99F6E4",
                    marginBottom: "32px",
                    lineHeight: 1.6,
                    fontFamily: "Inter, sans-serif"
                }}>
                    Join 10,000+ Indian businesses automating their invoices, certificates, and HR workflows. No credit card required.
                </p>

                <div style={{ 
                    display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginBottom: "32px" 
                }}>
                    {["100% Free", "No Sign-up", "GST Ready"].map((text, i) => (
                        <div key={i} style={{ 
                            display: "flex", alignItems: "center", gap: "8px", color: "#fff", fontSize: "14px", fontWeight: 600 
                        }}>
                            <CheckCircle size={16} color="#5EEAD4" /> {text}
                        </div>
                    ))}
                </div>

                <Link href="/invoice" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "16px 40px",
                    background: T,
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 800,
                    textDecoration: "none",
                    fontFamily: "Space Grotesk, sans-serif",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    transition: "all 200ms ease"
                }} className="cta-button">
                    Start Generating Now <ArrowRight size={18} />
                </Link>

                <p style={{
                    fontSize: "12px",
                    color: "#5EEAD4",
                    marginTop: "16px",
                    opacity: 0.8
                }}>
                    Used by freelancers, CA firms, and HR managers.
                </p>
            </div>

            <style jsx>{`
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                    background: #0F766E;
                }
            `}</style>
        </section>
    );
}
