"use client";
import { Bell, Search } from "lucide-react";

const T = "#0D9488";

export default function AdminHeader({ title, subtitle }) {
    return (
        <header style={{
            background: "#fff",
            borderBottom: "1px solid #E5E7EB",
            padding: "0 28px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
        }}>
            <div>
                <h1 style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "17px", fontWeight: 700,
                    color: "#111827", margin: 0,
                }}>{title}</h1>
                {subtitle && (
                    <p style={{
                        fontSize: "12px", color: "#9CA3AF",
                        margin: 0, fontFamily: "Inter, sans-serif",
                    }}>{subtitle}</p>
                )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Search */}
                <div style={{
                    display: "flex", alignItems: "center",
                    gap: "8px", background: "#F8F9FA",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px", padding: "7px 12px",
                }}>
                    <Search size={14} color="#9CA3AF" />
                    <input
                        placeholder="Search..."
                        style={{
                            border: "none", background: "none",
                            outline: "none", fontSize: "13px",
                            color: "#374151", width: "180px",
                            fontFamily: "Inter, sans-serif",
                        }}
                    />
                </div>

                {/* Bell */}
                <div style={{
                    position: "relative", cursor: "pointer",
                    width: "36px", height: "36px",
                    background: "#F8F9FA", border: "1px solid #E5E7EB",
                    borderRadius: "8px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                }}>
                    <Bell size={16} color="#6B7280" />
                    <div style={{
                        position: "absolute", top: "6px", right: "6px",
                        width: "8px", height: "8px",
                        background: "#EF4444", borderRadius: "50%",
                        border: "2px solid #fff",
                    }} />
                </div>

                {/* Avatar */}
                <div style={{
                    width: "36px", height: "36px",
                    background: T, borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px", fontWeight: 700,
                    color: "#fff", cursor: "pointer",
                    fontFamily: "Space Grotesk, sans-serif",
                }}>A</div>
            </div>
        </header>
    );
}