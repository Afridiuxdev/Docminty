"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/api/auth";
import { adminApi } from "@/api/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import { Bell, CheckCircle, AlertCircle, Info, X, RefreshCw } from "lucide-react";

const T = "#0D9488";

const TYPE_CONFIG = {
    success: { icon: CheckCircle, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
    warning: { icon: AlertCircle, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
    error:   { icon: AlertCircle, color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
    info:    { icon: Info,        color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
};

export default function AdminNotificationsPage() {
    const router = useRouter();
    useEffect(() => { if (!getAccessToken()) router.push("/login"); }, []);

    const [notifs, setNotifs]   = useState([]);
    const [filter, setFilter]   = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchNotifs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminApi.getNotifications();
            setNotifs(res.data?.data || []);
        } catch (e) {
            setError("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifs(); }, []);

    const markAll  = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
    const dismiss  = (id) => setNotifs(n => n.filter(x => x.id !== id));
    const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

    const filtered = filter === "All"    ? notifs
        : filter === "Unread"            ? notifs.filter(n => !n.read)
        : notifs.filter(n => n.type === filter.toLowerCase());

    const unread = notifs.filter(n => !n.read).length;

    return (
        <>
            <AdminHeader
                title="Notifications"
                subtitle={loading ? "Loading…" : `${unread} unread notification${unread !== 1 ? "s" : ""}`}
            />
            <div style={{ padding: "24px 28px" }}>
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", overflow: "hidden",
                }}>
                    {/* Toolbar */}
                    <div style={{
                        padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", flexWrap: "wrap", gap: "12px",
                    }}>
                        <div style={{
                            display: "flex", gap: "4px",
                            background: "#F8F9FA", borderRadius: "8px", padding: "4px",
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
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            {unread > 0 && (
                                <button onClick={markAll} style={{
                                    padding: "6px 14px", border: `1px solid ${T}`,
                                    borderRadius: "8px", background: "#F0FDFA",
                                    color: T, fontSize: "12px", fontWeight: 600,
                                    cursor: "pointer", fontFamily: "Inter, sans-serif",
                                }}>Mark all as read</button>
                            )}
                            <button onClick={fetchNotifs} style={{
                                padding: "6px 10px", border: "1px solid #E5E7EB",
                                borderRadius: "8px", background: "#fff",
                                color: "#6B7280", fontSize: "12px",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                                fontFamily: "Inter, sans-serif", fontWeight: 600,
                            }}>
                                <RefreshCw size={13} />Refresh
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "8px 0" }}>
                        {loading ? (
                            <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                                Loading notifications…
                            </div>
                        ) : error ? (
                            <div style={{ padding: "40px", textAlign: "center" }}>
                                <p style={{ color: "#EF4444", fontFamily: "Inter, sans-serif", fontSize: "14px", marginBottom: "12px" }}>{error}</p>
                                <button onClick={fetchNotifs} style={{
                                    padding: "7px 16px", background: T, color: "#fff",
                                    border: "none", borderRadius: "8px", cursor: "pointer",
                                    fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                                }}>Retry</button>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                                <Bell size={32} style={{ marginBottom: "12px", opacity: 0.3 }} />
                                <p style={{ margin: 0 }}>No notifications</p>
                            </div>
                        ) : filtered.map((n) => {
                            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
                            const Icon = cfg.icon;
                            return (
                                <div key={n.id} style={{
                                    display: "flex", alignItems: "flex-start",
                                    gap: "14px", padding: "14px 20px",
                                    background: n.read ? "transparent" : "#FAFFFE",
                                    borderLeft: n.read ? "3px solid transparent" : `3px solid ${T}`,
                                    transition: "background 150ms", cursor: "pointer",
                                }}
                                    onClick={() => markRead(n.id)}
                                    onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                                    onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "#FAFFFE"}
                                >
                                    <div style={{
                                        width: "36px", height: "36px",
                                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                                        borderRadius: "50%", display: "flex",
                                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <Icon size={16} color={cfg.color} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                            <p style={{
                                                fontSize: "13px", fontWeight: n.read ? 500 : 700,
                                                color: "#111827", margin: "0 0 3px",
                                                fontFamily: "Inter, sans-serif",
                                            }}>{n.title}</p>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                                <span style={{ fontSize: "11px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{n.time}</span>
                                                <button
                                                    onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#D1D5DB", display: "flex" }}>
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{n.msg}</p>
                                    </div>
                                    {!n.read && (
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: T, flexShrink: 0, marginTop: "4px" }} />
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
