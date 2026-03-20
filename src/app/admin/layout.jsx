"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#F8F9FA",
        }}>
            <AdminSidebar />
            <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
                {children}
            </main>
        </div>
    );
}