"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { authApi } from "@/api/auth";

const T = "#0D9488";

export default function DashHeader({ title, subtitle, action }) {
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    authApi.me()
      .then(res => setUser(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
      <div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {action && action}
        <Link href="/dashboard/create" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: T, color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", transition: "opacity 200ms" }}>
          <Plus size={14} /> New Document
        </Link>
        <Link href="/dashboard/profile" style={{ 
          width: "34px", 
          height: "34px", 
          borderRadius: "50%", 
          background: T, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "14px", 
          fontWeight: 700, 
          color: "#fff", 
          textDecoration: "none",
          fontFamily: "Space Grotesk, sans-serif"
        }}>
          {(user?.name || "U").charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
