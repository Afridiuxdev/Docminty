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

export default function AdminRevenuePage() {
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
      .catch(() => toast.error("Failed to load revenue data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const totalRev     = (stats?.totalRevenue || 0) / 100;
  const monthlyRev   = (stats?.revenueThisMonth || 0) / 100;
  const totalTxns    = stats?.totalPayments || 0;
  const proUsers     = stats?.proUsers || 0;
  const maxRev       = Math.max(...revenue.map(r => r.revenue || 0), 1);

  return (
    <>
      <AdminHeader title="Revenue" subtitle="Payment and subscription analytics" />
      <div style={{ padding: "24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { title: "Total Revenue",    value: "Rs." + totalRev.toLocaleString("en-IN"),   change: "all time",         up: true },
            { title: "This Month",       value: "Rs." + monthlyRev.toLocaleString("en-IN"), change: "current month",    up: true },
            { title: "Total Payments",   value: totalTxns,                                  change: "successful",       up: true },
            { title: "Pro Subscribers",  value: proUsers,                                   change: "active",           up: true },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Revenue Chart */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 24px" }}>Monthly Revenue (last 6 months)</p>
          {revenue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
              No revenue data yet. Revenue will appear here after your first payment.
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "200px" }}>
              {revenue.map((r, i) => {
                const rev = (r.revenue || 0) / 100;
                const h   = Math.max((r.revenue / maxRev) * 160, 4);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>Rs.{rev.toLocaleString("en-IN")}</span>
                    <div style={{ width: "100%", background: i === revenue.length-1 ? T : T+"80", borderRadius: "6px 6px 0 0", height: h + "px", transition: "height 300ms" }} />
                    <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{r.month?.slice(0,3)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Empty transactions note */}
        <div style={{ background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: T, margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif" }}>Transaction history</p>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>Detailed transaction list will appear here once payments are processed via Razorpay.</p>
        </div>
      </div>
    </>
  );
}