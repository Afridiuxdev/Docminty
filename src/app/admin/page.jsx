"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";
const DOC_COLORS = { invoice: T, quotation: "#F59E0B", "salary-slip": "#7C3AED", certificate: "#EC4899", receipt: "#3B82F6", "rent-receipt": "#10B981", "experience-letter": "#6366F1", "purchase-order": "#D97706" };

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #E5E7EB", borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Loading...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const [stats,   setStats]   = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    Promise.all([adminApi.getStats(), adminApi.getRevenue()])
      .then(([sRes, rRes]) => {
        setStats(sRes.data.data);
        setRevenue(rRes.data.data || []);
      })
      .catch(() => toast.error("Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const docBreakdown = Object.entries(stats?.docTypeBreakdown || {}).map(([type, count], i) => ({
    type, count,
    color: Object.values(DOC_COLORS)[i] || "#9CA3AF",
    pct: stats.totalDocuments > 0 ? Math.round((count / stats.totalDocuments) * 100) : 0
  }));

  const maxRev = Math.max(...revenue.map(r => r.revenue || 0), 1);

  return (
    <>
      <AdminHeader title="Overview" subtitle="DocMinty platform at a glance" />
      <div style={{ padding: "24px" }}>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { title: "Total Users",       value: stats?.totalUsers?.toLocaleString("en-IN") || "0", change: "+" + (stats?.newUsersThisMonth || 0) + " this month", up: true },
            { title: "Pro Users",         value: stats?.proUsers?.toLocaleString("en-IN") || "0",   change: ((stats?.proUsers / Math.max(stats?.totalUsers,1)) * 100).toFixed(1) + "% of total", up: true },
            { title: "Total Documents",   value: stats?.totalDocuments?.toLocaleString("en-IN") || "0", change: stats?.documentsToday + " today", up: true },
            { title: "Total Revenue",     value: "Rs." + ((stats?.totalRevenue || 0) / 100).toLocaleString("en-IN"), change: "Rs." + ((stats?.revenueThisMonth || 0) / 100).toLocaleString("en-IN") + " this month", up: true },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Revenue Chart */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 20px" }}>Monthly Revenue</p>
            {revenue.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>No revenue data yet</div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "160px" }}>
                {revenue.map((r, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Rs.{((r.revenue||0)/100).toLocaleString("en-IN")}</span>
                    <div style={{ width: "100%", background: T, borderRadius: "4px 4px 0 0", height: Math.max(((r.revenue||0) / maxRev) * 120, 4) + "px", opacity: i === revenue.length-1 ? 1 : 0.6 }} />
                    <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{r.month?.slice(0,3)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Doc Type Breakdown */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 16px" }}>Document Types</p>
            {docBreakdown.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>No documents yet</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {docBreakdown.slice(0,6).map((d, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{d.type}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>{d.count}</span>
                    </div>
                    <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px" }}>
                      <div style={{ height: "100%", width: d.pct + "%", background: d.color, borderRadius: "3px" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {[
            { label: "Free Users",          value: stats?.freeUsers?.toLocaleString("en-IN") || "0" },
            { label: "Docs This Month",      value: stats?.documentsThisMonth?.toLocaleString("en-IN") || "0" },
            { label: "Docs Today",           value: stats?.documentsToday?.toLocaleString("en-IN") || "0" },
            { label: "Paid Transactions",    value: stats?.totalPayments?.toLocaleString("en-IN") || "0" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "24px", color: T, margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}