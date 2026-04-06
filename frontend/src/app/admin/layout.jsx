"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8F9FA" }}>
            <div className="admin-mobile-header" style={{ alignItems: "center", justifyContent: "space-between", background: "#111827", padding: "12px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", padding: 0 }}>
                        <Menu size={24} />
                    </button>
                    <Link href="/admin" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", textDecoration: "none", margin: 0 }}>DocMinty Admin</Link>
                </div>
            </div>
            <div style={{ display: "flex", flex: 1 }}>
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}