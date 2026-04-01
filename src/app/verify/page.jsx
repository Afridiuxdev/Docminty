"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Search, ArrowRight } from "lucide-react";

const T = "#0D9488";

export default function VerifyLandingPage() {
    const [manualId, setManualId] = useState("");
    const router = useRouter();

    const handleVerify = (e) => {
        e.preventDefault();
        if (manualId.trim()) {
            router.push(`/verify/${manualId.trim().toUpperCase()}`);
        }
    };

    return (
        <>
            <Navbar />
            <main style={{
                minHeight: "calc(100vh - 120px)",
                background: "#F0F4F3",
                display: "flex", alignItems: "center",
                justifyContent: "center", padding: "40px 24px",
            }}>
                <div style={{ width: "100%", maxWidth: "600px" }}>
                    <div style={{ textAlign: "center", marginBottom: "40px" }}>
                        <div style={{
                            width: "64px", height: "64px",
                            background: T, borderRadius: "16px",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", margin: "0 auto 16px",
                            boxShadow: `0 8px 16px ${T}20`,
                        }}>
                            <Shield size={32} color="#fff" />
                        </div>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "32px", fontWeight: 700,
                            color: "#111827", margin: "0 0 12px",
                        }}>
                            Document Verification
                        </h1>
                        <p style={{
                            fontSize: "16px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0,
                            lineHeight: 1.6,
                        }}>
                            Instantly verify the authenticity of certificates and letters issued through DocMinty.
                        </p>
                    </div>

                    <div style={{
                        background: "#fff", border: "1px solid #E5E7EB",
                        borderRadius: "24px", padding: "40px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}>
                        <form onSubmit={handleVerify}>
                            <p style={{
                                fontSize: "14px", fontWeight: 700,
                                color: "#374151", margin: "0 0 16px",
                                fontFamily: "Space Grotesk, sans-serif",
                            }}>
                                Verification ID
                            </p>
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <input
                                    className="doc-input"
                                    placeholder="e.g. DM-ABCD-12345"
                                    value={manualId}
                                    onChange={e => setManualId(e.target.value.toUpperCase())}
                                    autoFocus
                                    style={{
                                        width: "100%", height: "56px",
                                        padding: "0 56px 0 20px",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontFamily: "monospace",
                                        letterSpacing: "0.05em",
                                        border: `2px solid #E5E7EB`,
                                        transition: "all 150ms",
                                    }}
                                />
                                <div style={{
                                    position: "absolute", right: "20px", top: "50%",
                                    transform: "translateY(-50%)", color: "#9CA3AF"
                                }}>
                                    <Search size={20} />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!manualId.trim()}
                                style={{
                                    width: "100%", height: "56px",
                                    background: manualId.trim() ? T : "#9CA3AF",
                                    color: "#fff", border: "none",
                                    borderRadius: "12px", fontSize: "16px",
                                    fontWeight: 700, cursor: manualId.trim() ? "pointer" : "not-allowed",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    transition: "all 200ms",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "8px"
                                }}>
                                Verify Document <ArrowRight size={18} />
                            </button>
                        </form>
                        
                        <div style={{
                            marginTop: "32px", padding: "20px",
                            background: "#F9FAFB", borderRadius: "12px",
                            border: "1px solid #F3F4F6",
                        }}>
                            <h3 style={{
                                fontSize: "14px", fontWeight: 700,
                                color: "#111827", margin: "0 0 8px",
                                fontFamily: "Space Grotesk, sans-serif",
                            }}>
                                Where to find the ID?
                            </h3>
                            <p style={{
                                fontSize: "13px", color: "#6B7280",
                                fontFamily: "Inter, sans-serif", margin: 0,
                                lineHeight: 1.5,
                            }}>
                                All genuine DocMinty documents carry a unique Verification ID at the bottom or a QR code. 
                                Enter the manual ID above or scan the QR code to check for authenticity.
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: "40px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                            Secure. Encrypted. Authentic. 
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
