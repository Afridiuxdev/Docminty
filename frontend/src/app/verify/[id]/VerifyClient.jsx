"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Shield, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { documentsApi } from "@/api/documents";

const T = "#0D9488";

export default function VerifyClient() {
    const params = useParams();
    const id = params?.id;
    const [status, setStatus] = useState("loading");
    const [docData, setDocData] = useState(null);
    const [manualId, setManualId] = useState("");

    useEffect(() => {
        if (id && id !== "doc" && id !== "demo") {
            verify(id);
        } else {
            setStatus("idle");
        }
    }, [id]);

    const verify = async (verifyId) => {
        setStatus("loading");
        try {
            const res = await documentsApi.verify(verifyId);
            if (res.success) {
                const d = res.data;
                // Parse formData if needed
                let parsedForm = {};
                try {
                    parsedForm = JSON.parse(d.formData);
                } catch (e) {
                    console.error("Scale parsing error", e);
                }

                setDocData({
                    valid: true,
                    id: d.referenceNumber,
                    type: d.docType,
                    issuedTo: d.partyName,
                    issuedBy: parsedForm.orgName || d.title,
                    course: parsedForm.course || parsedForm.role || d.title,
                    issueDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "",
                });
                setStatus("valid");
            } else {
                setDocData({ valid: false, id: verifyId });
                setStatus("invalid");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setDocData({ valid: false, id: verifyId });
            setStatus("invalid");
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
                <div style={{ width: "100%", maxWidth: "520px" }}>

                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <div style={{
                            width: "56px", height: "56px",
                            background: T, borderRadius: "14px",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", margin: "0 auto 14px",
                        }}>
                            <Shield size={28} color="#fff" />
                        </div>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "24px", fontWeight: 700,
                            color: "#111827", margin: "0 0 6px",
                        }}>
                            Document Verification
                        </h1>
                        <p style={{
                            fontSize: "14px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0,
                        }}>
                            Verify the authenticity of DocMinty documents
                        </p>
                    </div>

                    {/* Manual entry */}
                    <div style={{
                        background: "#fff", border: "1px solid #E5E7EB",
                        borderRadius: "16px", padding: "28px",
                        marginBottom: "20px",
                    }}>
                        <p style={{
                            fontSize: "13px", fontWeight: 700,
                            color: "#9CA3AF", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 12px",
                            fontFamily: "Space Grotesk, sans-serif",
                        }}>
                            Enter Verification ID
                        </p>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input
                                className="doc-input"
                                placeholder="e.g. DM-ABC123-XYZ789"
                                value={manualId}
                                onChange={e => setManualId(e.target.value.toUpperCase())}
                                style={{
                                    flex: 1, height: "42px",
                                    fontFamily: "monospace", letterSpacing: "0.05em",
                                }}
                            />
                            <button
                                onClick={() => manualId && verify(manualId)}
                                style={{
                                    height: "42px", padding: "0 20px",
                                    background: T, color: "#fff", border: "none",
                                    borderRadius: "8px", fontSize: "14px",
                                    fontWeight: 700, cursor: "pointer",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    flexShrink: 0, transition: "background 150ms",
                                }}>
                                Verify
                            </button>
                        </div>
                        <p style={{
                            fontSize: "12px", color: "#9CA3AF",
                            margin: "8px 0 0", fontFamily: "Inter, sans-serif",
                        }}>
                            The verification ID can be found at the bottom of your DocMinty document.
                        </p>
                    </div>

                    {/* Result */}
                    {status === "loading" && (
                        <div style={{
                            background: "#fff", border: "1px solid #E5E7EB",
                            borderRadius: "16px", padding: "32px",
                            textAlign: "center",
                        }}>
                            <div style={{
                                width: "48px", height: "48px",
                                border: `3px solid #E5E7EB`,
                                borderTopColor: T,
                                borderRadius: "50%",
                                margin: "0 auto 16px",
                                animation: "spin 1s linear infinite",
                            }} />
                            <p style={{
                                fontSize: "14px", color: "#6B7280",
                                fontFamily: "Inter, sans-serif", margin: 0,
                            }}>
                                Verifying document...
                            </p>
                        </div>
                    )}

                    {status === "valid" && docData && (
                        <div style={{
                            background: "#F0FDFA",
                            border: `2px solid ${T}`,
                            borderRadius: "16px", padding: "28px",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "center",
                                gap: "12px", marginBottom: "20px",
                            }}>
                                <CheckCircle size={28} color={T} />
                                <div>
                                    <p style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 700, fontSize: "16px",
                                        color: "#065F46", margin: 0,
                                    }}>
                                        ✓ Document Verified
                                    </p>
                                    <p style={{
                                        fontSize: "12px", color: T,
                                        fontFamily: "Inter, sans-serif",
                                        margin: "2px 0 0",
                                    }}>
                                        This document is authentic and was issued by DocMinty
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                background: "#fff", borderRadius: "10px",
                                padding: "16px", border: "1px solid #D1FAF0",
                            }}>
                                {[
                                    ["Document ID", docData.id],
                                    ["Document Type", docData.type],
                                    ["Issued To", docData.issuedTo],
                                    ["Issued By", docData.issuedBy],
                                    ["Course", docData.course],
                                    ["Issue Date", docData.issueDate],
                                ].filter(([, v]) => v).map(([label, value]) => (
                                    <div key={label} style={{
                                        display: "flex", justifyContent: "space-between",
                                        padding: "6px 0",
                                        borderBottom: "1px solid #F0FDFA",
                                    }}>
                                        <span style={{
                                            fontSize: "12px", color: "#6B7280",
                                            fontFamily: "Inter, sans-serif",
                                        }}>{label}</span>
                                        <span style={{
                                            fontSize: "12px", fontWeight: 600,
                                            color: "#111827", fontFamily: "Inter, sans-serif",
                                        }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {status === "invalid" && (
                        <div style={{
                            background: "#FEF2F2",
                            border: "2px solid #FCA5A5",
                            borderRadius: "16px", padding: "28px",
                            textAlign: "center",
                        }}>
                            <XCircle size={40} color="#EF4444"
                                style={{ margin: "0 auto 12px", display: "block" }} />
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "16px",
                                color: "#DC2626", margin: "0 0 6px",
                            }}>
                                Document Not Found
                            </p>
                            <p style={{
                                fontSize: "13px", color: "#9CA3AF",
                                fontFamily: "Inter, sans-serif",
                                margin: "0 0 16px", lineHeight: 1.6,
                            }}>
                                The verification ID{" "}
                                <strong style={{ fontFamily: "monospace" }}>
                                    {docData?.id}
                                </strong>
                                {" "}was not found in our database. This document may be
                                invalid or not issued by DocMinty.
                            </p>
                            <button onClick={() => { setStatus("idle"); setManualId(""); }}
                                style={{
                                    padding: "8px 20px", background: "#fff",
                                    border: "1px solid #FCA5A5", borderRadius: "8px",
                                    fontSize: "13px", fontWeight: 600,
                                    color: "#DC2626", cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                }}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {status === "idle" && (
                        <div style={{
                            background: "#fff", border: "1px solid #E5E7EB",
                            borderRadius: "16px", padding: "28px",
                            textAlign: "center",
                        }}>
                            <FileText size={40} color="#D1D5DB"
                                style={{ margin: "0 auto 12px", display: "block" }} />
                            <p style={{
                                fontSize: "14px", color: "#9CA3AF",
                                fontFamily: "Inter, sans-serif", margin: 0,
                            }}>
                                Enter a verification ID above to check document authenticity.
                            </p>
                        </div>
                    )}

                    <p style={{
                        textAlign: "center", fontSize: "13px",
                        color: "#9CA3AF", margin: "20px 0 0",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        <Link href="/" style={{ color: T, textDecoration: "none" }}>
                            ← Back to DocMinty
                        </Link>
                    </p>
                </div>
            </main>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

            <Footer />
        </>
    );
}
