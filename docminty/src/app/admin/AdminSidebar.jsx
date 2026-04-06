"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, FileText, DollarSign,
    BarChart2, Settings, Bell, LogOut,
    ChevronRight, FileStack, History
} from "lucide-react";

const T = "#0D9488";

const NAV = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/documents", icon: FileStack, label: "Documents" },
    { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
    { href: "/admin/revenue", icon: DollarSign, label: "Revenue" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/activities", icon: History, label: "Activity Log" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: "240px",
            minHeight: "100vh",
            background: "#0F172A",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            position: "sticky",
            top: 0,
        }}>
            {/* Logo */}
            <div style={{
                padding: "24px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "32px", height: "32px",
                        background: T, borderRadius: "8px",
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <FileText size={16} color="#fff" />
                    </div>
                    <div>
                        <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "15px",
                            color: "#fff", margin: 0,
                        }}>DocMinty</p>
                        <p style={{
                            fontSize: "10px", color: "rgba(255,255,255,0.4)",
                            margin: 0, fontFamily: "Inter, sans-serif",
                        }}>Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "12px 12px" }}>
                {NAV.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} style={{
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px", padding: "9px 12px",
                            borderRadius: "8px", marginBottom: "2px",
                            textDecoration: "none",
                            background: isActive ? T : "transparent",
                            transition: "all 150ms",
                        }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.background = "transparent";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Icon size={16} color={isActive ? "#fff" : "rgba(255,255,255,0.5)"} />
                                <span style={{
                                    fontSize: "13px", fontWeight: 500,
                                    color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                                    fontFamily: "Inter, sans-serif",
                                }}>{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={13} color="rgba(255,255,255,0.7)" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{
                padding: "16px 12px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
                <div style={{
                    display: "flex", alignItems: "center",
                    gap: "10px", padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                }}>
                    <div style={{
                        width: "30px", height: "30px",
                        borderRadius: "50%", background: T,
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px", fontWeight: 700,
                        color: "#fff", fontFamily: "Space Grotesk, sans-serif",
                        flexShrink: 0,
                    }}>A</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            fontSize: "12px", fontWeight: 600,
                            color: "#fff", margin: 0,
                            fontFamily: "Inter, sans-serif",
                            overflow: "hidden", textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>Admin</p>
                        <p style={{
                            fontSize: "10px", color: "rgba(255,255,255,0.4)",
                            margin: 0, fontFamily: "Inter, sans-serif",
                        }}>admin@docminty.com</p>
                    </div>
                    <LogOut size={14} color="rgba(255,255,255,0.4)" style={{ cursor: "pointer" }} />
                </div>
            </div>
        </aside>
    );
}