"use client";

import { useState, useEffect } from "react";
import { X, FileText, Zap, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

const T = "#0D9488";
const BG = "#F0F4F3";

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if shown in this session
        const shown = sessionStorage.getItem("exit_intent_shown");
        if (shown) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e) => {
            if (e.clientY <= 0) {
                setIsVisible(true);
                sessionStorage.setItem("exit_intent_shown", "true");
                setHasShown(true);
                document.removeEventListener("mouseleave", handleMouseLeave);
            }
        };

        if (!hasShown) {
            document.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [hasShown]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.3s ease-out"
        }}>
            <div style={{
                background: "#fff",
                maxWidth: "480px",
                width: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                position: "relative",
                animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}>
                <button 
                    onClick={() => setIsVisible(false)}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        border: "none",
                        background: "#F1F5F9",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#64748B",
                        transition: "all 0.2s"
                    }}
                >
                    <X size={18} />
                </button>

                <div style={{ padding: "40px 32px", textAlign: "center" }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        background: "#F0FDFA",
                        color: T,
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                    }}>
                        <Zap size={32} />
                    </div>

                    <h2 style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "#111827",
                        margin: "0 0 12px",
                        lineHeight: 1.2
                    }}>
                        Wait! Don't leave yet! 🚀
                    </h2>
                    
                    <p style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "16px",
                        color: "#64748B",
                        lineHeight: 1.6,
                        margin: "0 0 28px"
                    }}>
                        Your professional document is just seconds away. Create GST-compliant invoices and letters for FREE.
                    </p>

                    <div style={{
                        background: "#F8FAFC",
                        borderRadius: "16px",
                        padding: "20px",
                        marginBottom: "32px",
                        textAlign: "left"
                    }}>
                        {[
                            { icon: <CheckCircle size={16} />, text: "100% Free Forever" },
                            { icon: <Award size={16} />, text: "No Sign-up Required" },
                            { icon: <FileText size={16} />, text: "Professional PDF Layouts" }
                        ].map((item, i) => (
                            <div key={i} style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "12px", 
                                marginBottom: i < 2 ? "12px" : 0,
                                color: "#334155",
                                fontSize: "14px",
                                fontWeight: 600
                            }}>
                                <span style={{ color: T }}>{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link 
                            href="/invoice" 
                            onClick={() => setIsVisible(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "16px",
                                background: T,
                                color: "#fff",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: 700,
                                textDecoration: "none",
                                fontFamily: "var(--font-space-grotesk)",
                                boxShadow: "0 10px 15px -3px rgba(13, 148, 136, 0.3)",
                                transition: "transform 0.2s"
                            }}
                        >
                            Stay & Create Now →
                        </Link>
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            style={{
                                border: "none",
                                background: "none",
                                color: "#94A3B8",
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            No thanks, I'll do it later
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}} />
        </div>
    );
}
