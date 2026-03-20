"use client";
import Link from "next/link";
import { Bell, Plus } from "lucide-react";
const T = "#0D9488";
export default function DashHeader({ title, subtitle, action }) {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
      <div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {action && action}
        <div style={{ position: "relative", cursor: "pointer", width: "34px", height: "34px", background: "#F8F9FA", border: "1px solid #E5E7EB", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell size={15} color="#6B7280" />
          <div style={{ position: "absolute", top: "7px", right: "7px", width: "7px", height: "7px", background: "#EF4444", borderRadius: "50%", border: "1.5px solid #fff" }} />
        </div>
        <Link href="/dashboard/create" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: T, color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>
          <Plus size={14} /> New Document
        </Link>
      </div>
    </header>
  );
}
