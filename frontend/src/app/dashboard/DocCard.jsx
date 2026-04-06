"use client";
import { Download, Eye, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";

const T = "#0D9488";

const TYPE_COLORS = {
    "GST Invoice": { bg: "#F0FDFA", color: T, dot: T },
    "Quotation": { bg: "#FFFBEB", color: "#D97706", dot: "#F59E0B" },
    "Salary Slip": { bg: "#F5F3FF", color: "#7C3AED", dot: "#7C3AED" },
    "Receipt": { bg: "#EFF6FF", color: "#3B82F6", dot: "#3B82F6" },
    "Certificate": { bg: "#FDF2F8", color: "#EC4899", dot: "#EC4899" },
    "Rent Receipt": { bg: "#F0FDF4", color: "#16A34A", dot: "#16A34A" },
    "Proforma": { bg: "#FEF9C3", color: "#92400E", dot: "#F59E0B" },
    "Purchase Order": { bg: "#EEF2FF", color: "#6366F1", dot: "#6366F1" },
};

export default function DocCard({ doc, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const style = TYPE_COLORS[doc.type] || TYPE_COLORS["GST Invoice"];

    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "all 150ms",
            position: "relative",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = T;
                e.currentTarget.style.boxShadow = `0 2px 12px ${T}15`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Top row */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start",
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                }}>
                    <div style={{
                        width: "8px", height: "8px",
                        borderRadius: "50%", background: style.dot,
                        flexShrink: 0,
                    }} />
                    <span style={{
                        fontSize: "11px", fontWeight: 700,
                        color: style.color, background: style.bg,
                        padding: "2px 8px", borderRadius: "12px",
                        fontFamily: "Inter, sans-serif",
                    }}>{doc.type}</span>
                </div>
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: "none", border: "none",
                            cursor: "pointer", color: "#9CA3AF",
                            padding: "2px", display: "flex",
                        }}>
                        <MoreVertical size={15} />
                    </button>
                    {menuOpen && (
                        <div style={{
                            position: "absolute", right: 0, top: "100%",
                            background: "#fff", border: "1px solid #E5E7EB",
                            borderRadius: "8px", padding: "4px",
                            zIndex: 20, minWidth: "140px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                            onMouseLeave={() => setMenuOpen(false)}
                        >
                            {[
                                { icon: Eye, label: "Preview", color: "#374151" },
                                { icon: Download, label: "Download", color: T },
                                { icon: Trash2, label: "Delete", color: "#EF4444" },
                            ].map(item => (
                                <button key={item.label}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        if (item.label === "Delete" && onDelete) onDelete(doc.id);
                                    }}
                                    style={{
                                        display: "flex", alignItems: "center",
                                        gap: "8px", width: "100%",
                                        padding: "7px 10px", border: "none",
                                        background: "none", cursor: "pointer",
                                        borderRadius: "6px", fontSize: "12px",
                                        fontWeight: 500, color: item.color,
                                        fontFamily: "Inter, sans-serif",
                                        textAlign: "left",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                                >
                                    <item.icon size={13} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Doc name */}
            <div>
                <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "14px",
                    color: "#111827", margin: "0 0 3px",
                    overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>{doc.name}</p>
                <p style={{
                    fontSize: "12px", color: "#9CA3AF",
                    margin: 0, fontFamily: "Inter, sans-serif",
                }}>
                    {doc.amount && (
                        <span style={{ color: T, fontWeight: 600 }}>
                            {doc.amount} &nbsp;·&nbsp;
                        </span>
                    )}
                    {doc.date}
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "6px" }}>
                <button style={{
                    flex: 1, height: "30px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px", background: "#fff",
                    fontSize: "11px", fontWeight: 600,
                    color: "#6B7280", cursor: "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "4px",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 150ms",
                }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = T;
                        e.currentTarget.style.color = T;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#E5E7EB";
                        e.currentTarget.style.color = "#6B7280";
                    }}
                >
                    <Eye size={11} /> Preview
                </button>
                <button style={{
                    flex: 1, height: "30px",
                    border: `1px solid ${T}`,
                    borderRadius: "6px", background: "#F0FDFA",
                    fontSize: "11px", fontWeight: 600,
                    color: T, cursor: "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "4px",
                    fontFamily: "Inter, sans-serif",
                }}>
                    <Download size={11} /> Download
                </button>
            </div>
        </div>
    );
}