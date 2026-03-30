"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";

function Spinner() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ width:"40px",height:"40px",border:"3px solid #E5E7EB",borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} /><p style={{ fontSize:"13px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Loading...</p></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    adminApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <AdminHeader title="Analytics" subtitle="Platform usage and growth metrics" />
      <div style={{ padding: "24px" }}>

        {/* Real Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { title: "Total Users",       value: stats?.totalUsers?.toLocaleString("en-IN") || "0",           change: "registered", up: true },
            { title: "New This Month",    value: stats?.newUsersThisMonth?.toLocaleString("en-IN") || "0",    change: "new signups", up: true },
            { title: "Docs This Month",   value: stats?.documentsThisMonth?.toLocaleString("en-IN") || "0",   change: "generated", up: true },
            { title: "Docs Today",        value: stats?.documentsToday?.toLocaleString("en-IN") || "0",       change: "today", up: true },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* User Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 20px" }}>User Plan Distribution</p>
            {[
              { label: "Free Users", value: stats?.freeUsers || 0, color: "#9CA3AF", pct: ((stats?.freeUsers||0)/Math.max(stats?.totalUsers||1,1)*100).toFixed(0) },
              { label: "Pro Users",  value: stats?.proUsers  || 0, color: T,         pct: ((stats?.proUsers||0)/Math.max(stats?.totalUsers||1,1)*100).toFixed(0)  },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>{row.value.toLocaleString("en-IN")} ({row.pct}%)</span>
                </div>
                <div style={{ height: "8px", background: "#F3F4F6", borderRadius: "4px" }}>
                  <div style={{ height: "100%", width: row.pct + "%", background: row.color, borderRadius: "4px", transition: "width 500ms" }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 20px" }}>Document Activity</p>
            {[
              { label: "Total Generated", value: stats?.totalDocuments || 0 },
              { label: "This Month",       value: stats?.documentsThisMonth || 0 },
              { label: "Today",            value: stats?.documentsToday || 0 },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                <span style={{ fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{row.label}</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: T, fontFamily: "Space Grotesk, sans-serif" }}>{row.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note about advanced analytics */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>📊</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#92400E", margin: "0 0 2px", fontFamily: "Space Grotesk, sans-serif" }}>Advanced Analytics Coming Soon</p>
            <p style={{ fontSize: "12px", color: "#B45309", margin: 0, fontFamily: "Inter, sans-serif" }}>Daily active users, traffic sources, geographic breakdown and session analytics will be available after integrating with Google Analytics or Mixpanel.</p>
          </div>
        </div>
      </div>
    </>
  );
}