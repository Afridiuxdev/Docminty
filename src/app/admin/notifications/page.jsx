"use client";
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";

const T = "#0D9488";

const NOTIFS = [
    { id: 1, type: "success", title: "New Pro Subscription", msg: "Arjun Sharma upgraded to Business Pro", time: "2 min ago", read: false },
    { id: 2, type: "warning", title: "High PDF Failure Rate", msg: "PDF generation failures up 12% in last hour", time: "14 min ago", read: false },
    { id: 3, type: "info", title: "New User Milestone", msg: "DocMinty reached 14,000 registered users", time: "1 hr ago", read: false },
    { id: 4, type: "success", title: "Payment Received", msg: "Rs. 1,990 from Priya Nair (Annual Pro)", time: "2 hr ago", read: false },
    { id: 5, type: "error", title: "API Timeout Detected", msg: "Spring Boot API responded in 8.2s (>2s threshold)", time: "3 hr ago", read: true },
    { id: 6, type: "success", title: "AdSense Payment", msg: "Google AdSense payout of Rs. 28,400 received", time: "5 hr ago", read: true },
    { id: 7, type: "info", title: "GST Rate Update", msg: "New GST notifications for FY 2025-26 available", time: "1 day ago", read: true },
    { id: 8, type: "warning", title: "Storage Warning", msg: "Document storage at 72% capacity", time: "1 day ago", read: true },
    { id: 9, type: "success", title: "5 New Pro Subscriptions", msg: "5 users upgraded to Business Pro today", time: "2 days ago", read: true },
    { id: 10, type: "info", title: "System Maintenance Scheduled", "msg": "Planned maintenance on 28 Mar 2:00-4:00 AM", time: "2 days ago", read: true },
];

const TYPE_CONFIG = {
    success: { icon: CheckCircle, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
    warning: { icon: AlertCircle, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
    error: { icon: AlertCircle, color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
    info: { icon: Info, color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
};

export default function AdminNotificationsPage() {
    const [notifs, setNotifs] = useState(NOTIFS);
    const [filter, setFilter] = useState("All");

    const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
    const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id));
    const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

    const filtered = filter === "All" ? notifs
        : filter === "Unread" ? notifs.filter(n => !n.read)
            : notifs.filter(n => n.type === filter.toLowerCase());

    const unread = notifs.filter(n => !n.read).length;

    return (
        <>
            <AdminHeader
                title="Notifications"
                subtitle={`${unread} unread notifications`}
            />
            <div style={{ padding: "24px 28px" }}>
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", flexWrap: "wrap", gap: "12px",
                    }}>
                        <div style={{
                            display: "flex", gap: "4px",
                            background: "#F8F9FA", borderRadius: "8px", padding: "4px"
                        }}>
                            {["All", "Unread", "Success", "Warning", "Error", "Info"].map(f => (
                                <button key={f} onClick={() => setFilter(f)} style={{
                                    padding: "5px 12px", borderRadius: "6px",
                                    border: "none", fontSize: "12px", fontWeight: 600,
                                    cursor: "pointer", fontFamily: "Inter, sans-serif",
                                    background: filter === f ? "#fff" : "transparent",
                                    color: filter === f ? T : "#6B7280",
                                    boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                                    transition: "all 150ms",
                                }}>{f}</button>
                            ))}
                        </div>
                        {unread > 0 && (
                            <button onClick={markAll} style={{
                                padding: "6px 14px", border: `1px solid ${T}`,
                                borderRadius: "8px", background: "#F0FDFA",
                                color: T, fontSize: "12px", fontWeight: 600,
                                cursor: "pointer", fontFamily: "Inter, sans-serif",
                            }}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications list */}
                    <div style={{ padding: "8px 0" }}>
                        {filtered.length === 0 ? (
                            <div style={{
                                padding: "60px", textAlign: "center",
                                color: "#9CA3AF", fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                            }}>
                                No notifications
                            </div>
                        ) : filtered.map((n) => {
                            const cfg = TYPE_CONFIG[n.type];
                            const Icon = cfg.icon;
                            return (
                                <div key={n.id} style={{
                                    display: "flex", alignItems: "flex-start",
                                    gap: "14px", padding: "14px 20px",
                                    background: n.read ? "transparent" : "#FAFFFE",
                                    borderLeft: n.read ? "3px solid transparent" : `3px solid ${T}`,
                                    transition: "background 150ms",
                                    cursor: "pointer",
                                }}
                                    onClick={() => markRead(n.id)}
                                    onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                                    onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "#FAFFFE"}
                                >
                                    <div style={{
                                        width: "36px", height: "36px",
                                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                                        borderRadius: "50%", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={16} color={cfg.color} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "flex-start", gap: "8px",
                                        }}>
                                            <p style={{
                                                fontSize: "13px", fontWeight: n.read ? 500 : 700,
                                                color: "#111827", margin: "0 0 3px",
                                                fontFamily: "Inter, sans-serif",
                                            }}>{n.title}</p>
                                            <div style={{
                                                display: "flex", alignItems: "center",
                                                gap: "8px", flexShrink: 0,
                                            }}>
                                                <span style={{
                                                    fontSize: "11px", color: "#D1D5DB",
                                                    fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
                                                }}>{n.time}</span>
                                                <button
                                                    onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                                    style={{
                                                        background: "none", border: "none",
                                                        cursor: "pointer", padding: "2px",
                                                        color: "#D1D5DB", display: "flex",
                                                    }}>
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{
                                            fontSize: "12px", color: "#6B7280",
                                            margin: 0, fontFamily: "Inter, sans-serif",
                                            lineHeight: 1.5,
                                        }}>{n.msg}</p>
                                    </div>
                                    {!n.read && (
                                        <div style={{
                                            width: "8px", height: "8px",
                                            borderRadius: "50%", background: T,
                                            flexShrink: 0, marginTop: "4px",
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}