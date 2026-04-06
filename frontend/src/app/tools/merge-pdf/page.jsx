"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, X, Download, ArrowUp, ArrowDown, FileText } from "lucide-react";

const T = "#0D9488";

export default function MergePDFPage() {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [done, setDone] = useState(false);

    const handleFiles = (newFiles) => {
        const pdfs = Array.from(newFiles).filter(f =>
            f.type === "application/pdf");
        setFiles(prev => [...prev, ...pdfs.map((f, i) => ({
            id: Date.now() + i, file: f, name: f.name,
            size: (f.size / 1024).toFixed(1) + " KB",
        }))]);
        setDone(false);
    };

    const remove = (id) =>
        setFiles(prev => prev.filter(f => f.id !== id));

    const moveUp = (index) => {
        if (index === 0) return;
        const arr = [...files];
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        setFiles(arr);
    };

    const moveDown = (index) => {
        if (index === files.length - 1) return;
        const arr = [...files];
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        setFiles(arr);
    };

    const merge = async () => {
        if (files.length < 2) return;
        setMerging(true);
        // TODO: implement with pdf-lib
        await new Promise(r => setTimeout(r, 2000));
        setMerging(false);
        setDone(true);
    };

    return (
        <>
            <Navbar />
            <main style={{
                background: "#F0F4F3",
                minHeight: "calc(100vh - 120px)", padding: "40px 24px"
            }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "28px", fontWeight: 700,
                            color: "#111827", margin: "0 0 8px",
                        }}>Merge PDF</h1>
                        <p style={{
                            fontSize: "15px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0,
                        }}>
                            Combine multiple PDF files into one document.
                            Drag to reorder.
                        </p>
                    </div>

                    {/* Upload zone */}
                    <label style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        padding: "40px 24px",
                        border: `2px dashed ${T}`,
                        borderRadius: "12px",
                        background: "#F0FDFA",
                        cursor: "pointer", marginBottom: "20px",
                        transition: "all 150ms",
                    }}>
                        <input type="file" accept=".pdf" multiple
                            style={{ display: "none" }}
                            onChange={e => handleFiles(e.target.files)}
                        />
                        <Upload size={32} color={T}
                            style={{ marginBottom: "10px" }} />
                        <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "15px",
                            color: T, margin: "0 0 4px",
                        }}>Click to upload PDFs</p>
                        <p style={{
                            fontSize: "13px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0,
                        }}>
                            or drag and drop · PDF files only
                        </p>
                    </label>

                    {/* File list */}
                    {files.length > 0 && (
                        <div style={{
                            background: "#fff", border: "1px solid #E5E7EB",
                            borderRadius: "12px", overflow: "hidden",
                            marginBottom: "20px",
                        }}>
                            {/* Header */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "32px 1fr auto 80px",
                                gap: "12px", padding: "10px 16px",
                                background: "#F8F9FA",
                                borderBottom: "1px solid #E5E7EB",
                            }}>
                                {["#", "File Name", "Size", ""].map(h => (
                                    <span key={h} style={{
                                        fontSize: "10px", fontWeight: 700,
                                        color: "#9CA3AF", textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        fontFamily: "Inter, sans-serif",
                                    }}>{h}</span>
                                ))}
                            </div>

                            {files.map((f, i) => (
                                <div key={f.id} style={{
                                    display: "grid",
                                    gridTemplateColumns: "32px 1fr auto 80px",
                                    gap: "12px", padding: "12px 16px",
                                    alignItems: "center",
                                    borderBottom: i < files.length - 1
                                        ? "1px solid #F3F4F6" : "none",
                                    transition: "background 150ms",
                                }}
                                    onMouseEnter={e =>
                                        e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e =>
                                        e.currentTarget.style.background = "transparent"}
                                >
                                    <span style={{
                                        fontSize: "12px", fontWeight: 700,
                                        color: T, fontFamily: "Space Grotesk, sans-serif",
                                    }}>{i + 1}</span>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center", gap: "8px"
                                    }}>
                                        <FileText size={16} color={T} />
                                        <span style={{
                                            fontSize: "13px", color: "#374151",
                                            fontFamily: "Inter, sans-serif",
                                            overflow: "hidden", textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>{f.name}</span>
                                    </div>
                                    <span style={{
                                        fontSize: "12px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif",
                                    }}>{f.size}</span>
                                    <div style={{
                                        display: "flex", gap: "4px",
                                        justifyContent: "flex-end",
                                    }}>
                                        <button onClick={() => moveUp(i)} style={{
                                            width: "24px", height: "24px",
                                            background: "#F3F4F6", border: "none",
                                            borderRadius: "4px", cursor: "pointer",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <ArrowUp size={12} color="#6B7280" />
                                        </button>
                                        <button onClick={() => moveDown(i)} style={{
                                            width: "24px", height: "24px",
                                            background: "#F3F4F6", border: "none",
                                            borderRadius: "4px", cursor: "pointer",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <ArrowDown size={12} color="#6B7280" />
                                        </button>
                                        <button onClick={() => remove(f.id)} style={{
                                            width: "24px", height: "24px",
                                            background: "#FEF2F2", border: "none",
                                            borderRadius: "4px", cursor: "pointer",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <X size={12} color="#EF4444" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    {files.length >= 2 && !done && (
                        <button onClick={merge} disabled={merging} style={{
                            width: "100%", height: "48px",
                            background: merging ? "#9CA3AF" : T,
                            color: "#fff", border: "none",
                            borderRadius: "10px", fontSize: "15px",
                            fontWeight: 700, cursor: merging
                                ? "not-allowed" : "pointer",
                            fontFamily: "Space Grotesk, sans-serif",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "8px",
                            transition: "background 150ms",
                        }}>
                            {merging ? (
                                <>
                                    <div style={{
                                        width: "16px", height: "16px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "#fff",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                    }} />
                                    Merging {files.length} PDFs...
                                </>
                            ) : (
                                <>🔗 Merge {files.length} PDFs</>
                            )}
                        </button>
                    )}

                    {files.length === 1 && (
                        <div style={{
                            padding: "12px 16px", background: "#FEF9C3",
                            border: "1px solid #F59E0B", borderRadius: "8px",
                            fontSize: "13px", color: "#92400E",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            ⚠ Add at least one more PDF to merge.
                        </div>
                    )}

                    {done && (
                        <div style={{
                            background: "#F0FDFA", border: `2px solid ${T}`,
                            borderRadius: "12px", padding: "24px",
                            textAlign: "center",
                        }}>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "18px",
                                color: "#065F46", margin: "0 0 12px",
                            }}>
                                ✓ PDFs Merged Successfully!
                            </p>
                            <button className="download-pdf-btn"
                                style={{ margin: "0 auto" }}>
                                <Download size={15} /> Download Merged PDF
                            </button>
                        </div>
                    )}

                    {/* Info */}
                    <div style={{
                        marginTop: "24px", padding: "16px 20px",
                        background: "#fff", border: "1px solid #E5E7EB",
                        borderRadius: "10px",
                    }}>
                        <p style={{
                            fontSize: "12px", fontWeight: 700, color: "#9CA3AF",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif",
                        }}>How to merge PDFs</p>
                        {[
                            "Upload 2 or more PDF files using the upload button",
                            "Drag the ↑ ↓ arrows to reorder files as needed",
                            "Click 'Merge PDFs' to combine them into one file",
                            "Download your merged PDF instantly",
                        ].map((tip, i) => (
                            <div key={i} style={{
                                display: "flex", gap: "8px",
                                marginBottom: "6px", alignItems: "flex-start",
                            }}>
                                <span style={{
                                    fontSize: "11px", fontWeight: 700,
                                    color: T, flexShrink: 0,
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>{i + 1}.</span>
                                <span style={{
                                    fontSize: "13px", color: "#6B7280",
                                    fontFamily: "Inter, sans-serif",
                                }}>{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
            <Footer />
        </>
    );
}