"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/api/auth";
import { adminApi } from "@/api/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import { History, Search, Filter, Shield, Activity, User, Globe, Calendar } from "lucide-react";

const T = "#0D9488";

export default function AdminActivityPage() {
    const router = useRouter();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!getAccessToken()) { router.push("/login"); return; }
        adminApi.getActivities()
            .then(res => setLogs(res.data?.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = logs.filter(l => 
        (l.adminEmail || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.action || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.details || "").toLowerCase().includes(search.toLowerCase())
    );

    const getActionStyle = (action) => {
        const a = (action || "").toUpperCase();
        if (a.includes("BAN")) return { bg: "#FEF2F2", text: "#EF4444" };
        if (a.includes("DELETE")) return { bg: "#FEF2F2", text: "#EF4444" };
        if (a.includes("UPDATE") || a.includes("EDIT")) return { bg: "#EFF6FF", text: "#3B82F6" };
        if (a.includes("LOGIN")) return { bg: "#F0FDF4", text: "#16A34A" };
        if (a.includes("VIEW")) return { bg: "#FDF4FF", text: "#D946EF" };
        if (a.includes("SAVE") || a.includes("CREATE")) return { bg: "#F0FDFA", text: "#0D9488" };
        return { bg: "#F1F5F9", text: "#475569" };
    };

    return (
        <>
            <AdminHeader title="Activity Logs" subtitle="Track all administrative actions" />
            <div style={{ padding: "24px" }}>
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F9FAFB" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0 12px", height: "38px", width: "320px", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)" }}>
                            <Search size={14} color="#9CA3AF" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by admin, action, or details..." style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", width: "100%", fontFamily: "Inter, sans-serif" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6B7280", background: "#fff", padding: "6px 12px", borderRadius: "20px", border: "1px solid #E5E7EB" }}>
                                <Activity size={12} color={T} />
                                <span style={{ fontWeight: 600 }}>{filtered.length}</span> entries
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#fff", borderBottom: "2px solid #F3F4F6" }}>
                                    {["Admin User", "Action", "Activity Details", "IP & Origin", "Timestamp"].map(h => (
                                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Space Grotesk, sans-serif" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: "80px", textAlign: "center" }}>
                                        <div style={{ width:"32px", height:"32px", border:"3px solid #F3F4F6", borderTopColor:T, borderRadius:"50%", animation:"spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                                        <p style={{ margin:0, fontSize:"13px", color:"#9CA3AF", fontFamily:"Inter, sans-serif" }}>Fetching activity stream...</p>
                                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                                    </td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: "80px", textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                                        <History size={32} style={{ marginBottom: "12px", opacity: 0.3 }} />
                                        <p style={{ margin: 0 }}>No activity matching your search</p>
                                    </td></tr>
                                ) : filtered.map((l, i) => {
                                    const style = getActionStyle(l.action);
                                    return (
                                        <tr key={i} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 150ms" }}>
                                            <td style={{ padding: "14px 16px" }}>
                                               <div style={{ display:"flex", alignItems:"center", gap:"10px"}}>
                                                   <div style={{ width:30, height:30, borderRadius:"8px", background:T+"10", color:T, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily: "Space Grotesk, sans-serif" }}>{(l.adminEmail || "A")[0].toUpperCase()}</div>
                                                   <div style={{ display: "flex", flexDirection: "column" }}>
                                                       <span style={{ fontSize: "13px", color: "#111827", fontWeight:600, fontFamily: "Inter, sans-serif" }}>{l.adminEmail}</span>
                                                       <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Administrator</span>
                                                   </div>
                                               </div>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span style={{ 
                                                    padding: "4px 10px", 
                                                    background: style.bg, 
                                                    borderRadius: "6px", 
                                                    fontSize: "10px", 
                                                    fontWeight: 800, 
                                                    color: style.text, 
                                                    fontFamily: "Space Grotesk, sans-serif", 
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.02em",
                                                    display: "inline-block"
                                                }}>{l.action}</span>
                                            </td>
                                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#475569", fontFamily: "Inter, sans-serif", lineHeight: 1.5, maxWidth: "400px" }}>{l.details}</td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B" }}>
                                                    <Globe size={12} color="#9CA3AF" />
                                                    <span style={{ fontSize: "12px", fontFamily: "monospace", letterSpacing: "-0.01em" }}>{l.ipAddress || "Unknown IP"}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px", fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontWeight: 500 }}>
                                                    <Calendar size={13} color="#9CA3AF" />
                                                    {l.createdAt ? new Date(l.createdAt).toLocaleString("en-IN", { 
                                                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" 
                                                    }) : "N/A"}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
