"use client";
import { useState, useEffect } from "react";
import DashSidebar from "@/components/dashboard/DashSidebar";
import { authApi } from "@/api/auth";
import { Menu, FileText, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const T = "#0D9488";

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState({
        name: "Loading...",
        email: "...",
        plan: "free",
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        authApi.me()
            .then(res => {
                const u = res.data.data;
                setUser({
                    name: u.name,
                    email: u.email,
                    plan: u.plan || "free",
                });
            })
            .catch(err => console.error("Failed to fetch user:", err));
    }, []);

    // Helper to get page title for the header
    const getPageTitle = () => {
        if (pathname.includes("/documents")) return "My Documents";
        if (pathname.includes("/create")) return "Create New";
        if (pathname.includes("/billing")) return "Billing & Subscription";
        if (pathname.includes("/profile")) return "Profile Settings";
        if (pathname.includes("/settings")) return "Account Settings";
        return "Dashboard Overview";
    };

    // Helper to get page subtitle
    const getPageSubtitle = () => {
        const name = user?.name?.split(' ')[0] || 'User';
        if (pathname.includes("/documents")) return "Manage and track your generated documents";
        if (pathname.includes("/create")) return "Select a document type to get started";
        if (pathname.includes("/billing")) return "Manage your plans and payment history";
        if (pathname.includes("/profile")) return "Update your business and personal information";
        if (pathname.includes("/settings")) return "Personalize your dashboard preferences";
        return `Welcome back, ${name}!`;
    };

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#F8F9FA",
        }}>
            <DashSidebar user={user} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Global Unified Header */}
                <header style={{
                    height: "60px",
                    background: "#fff",
                    borderBottom: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    position: "sticky",
                    top: 0,
                    zIndex: 44,
                }} className="dash-global-header">
                    
                    {/* Left: Logo (Mobile) / Dynamic Text (Desktop) */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button 
                          onClick={() => setSidebarOpen(true)}
                          style={{ border: "none", background: "none", cursor: "pointer", color: "#6B7280", padding: "8px", marginLeft: "-8px" }}
                          className="lg-hidden"
                        >
                            <Menu size={20} />
                        </button>
                        
                        {/* Desktop: Dynamic Title & Subtitle */}
                        <div className="hide-mobile" style={{ display: "flex", flexDirection: "column" }}>
                            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{getPageTitle()}</h1>
                            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{getPageSubtitle()}</p>
                        </div>

                        {/* Mobile: Logo */}
                        <Link href="/dashboard" style={{ display: "none", alignItems: "center", gap: "8px", textDecoration: "none" }} className="show-mobile">
                            <div style={{ width: "28px", height: "28px", background: T, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FileText size={14} color="#fff" />
                            </div>
                            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827" }}>DocMinty</span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link href="/dashboard/create" style={{ 
                            display: "flex", alignItems: "center", gap: "6px", 
                            padding: "8px 16px", background: T, color: "#fff", 
                            borderRadius: "8px", textDecoration: "none", 
                            fontSize: "13px", fontWeight: 600, 
                            fontFamily: "Space Grotesk, sans-serif" 
                        }} className="hide-mobile">
                            <Plus size={14} /> New Document
                        </Link>
                        {/* Mobile Plus Icon */}
                        <Link href="/dashboard/create" style={{ 
                            width: "36px", height: "36px", background: T, 
                            color: "#fff", borderRadius: "8px", display: "none", 
                            alignItems: "center", justifyContent: "center", textDecoration: "none" 
                        }} className="show-mobile">
                            <Plus size={20} />
                        </Link>

                        <Link href="/dashboard/profile" style={{ 
                            width: "36px", height: "36px", borderRadius: "50%", 
                            background: T, display: "flex", alignItems: "center", 
                            justifyContent: "center", fontSize: "14px", fontWeight: 700, 
                            color: "#fff", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif",
                            border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                        }}>
                            {(user?.name || "U").charAt(0).toUpperCase()}
                        </Link>
                    </div>
                </header>

                <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }} className="dash-main-content">
                    {children}
                </main>
            </div>

            <style>{`
                .lg-hidden { display: flex; }
                .dash-main-content { margin-left: 0; }
                .show-mobile { display: none; }
                .hide-mobile { display: flex; }
                
                @media (max-width: 640px) {
                    .hide-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                    .dash-global-header { padding: 0 12px; }
                }

                @media (min-width: 1024px) {
                    .lg-hidden { display: none !important; }
                    .dash-main-content { margin-left: 240px; }
                    .dash-global-header { margin-left: 240px; width: calc(100% - 240px); left: auto; right: 0; }
                }
            `}</style>
        </div>
    );
}