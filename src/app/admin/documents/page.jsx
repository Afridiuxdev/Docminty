"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";
const DOC_COLORS = { invoice: T, quotation: "#F59E0B", "salary-slip": "#7C3AED", certificate: "#EC4899", receipt: "#3B82F6", "rent-receipt": "#10B981", "experience-letter": "#6366F1", "purchase-order": "#D97706" };

function Spinner() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ width:"40px",height:"40px",border:"3px solid #E5E7EB",borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} /><p style={{ fontSize:"13px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Loading...</p></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    adminApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => toast.error("Failed to load document stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const breakdown = Object.entries(stats?.docTypeBreakdown || {}).map(([type, count], i) => ({
    type, count, color: Object.values(DOC_COLORS)[i] || "#9CA3AF",
    pct: stats.totalDocuments > 0 ? Math.round((count / stats.totalDocuments) * 100) : 0
  }));

  return (
    <>
      <AdminHeader title="Documents" subtitle="Document generation analytics" />
      <div style={{ padding: "24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { title: "Total Documents",    value: stats?.totalDocuments?.toLocaleString("en-IN") || "0", change: "all time", up: true },
            { title: "This Month",         value: stats?.documentsThisMonth?.toLocaleString("en-IN") || "0", change: "documents generated", up: true },
            { title: "Today",              value: stats?.documentsToday?.toLocaleString("en-IN") || "0", change: "documents today", up: true },
            { title: "Document Types",     value: breakdown.length, change: "active types", up: true },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Breakdown Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px", marginBottom: "24px" }}>
          {breakdown.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>No documents generated yet.</div>
          ) : breakdown.map((d, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", borderTop: "3px solid " + d.color }}>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "0 0 8px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.type}</p>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "28px", color: d.color, margin: "0 0 8px" }}>{d.count.toLocaleString("en-IN")}</p>
              <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px" }}>
                <div style={{ height: "100%", width: d.pct + "%", background: d.color, borderRadius: "3px" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "6px 0 0", fontFamily: "Inter, sans-serif" }}>{d.pct}% of total</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}