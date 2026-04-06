"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";
import { Download, CheckCircle, XCircle, Clock, CreditCard, Search, Calendar, Filter } from "lucide-react";

const T = "#0D9488";

const STATUS_CONFIG = {
  "captured":   { label: "Paid",      bg: "#ECFDF5", color: "#10B981", Icon: CheckCircle },
  "paid":       { label: "Paid",      bg: "#ECFDF5", color: "#10B981", Icon: CheckCircle },
  "created":    { label: "Pending",   bg: "#FEF9C3", color: "#D97706", Icon: Clock },
  "attempted":  { label: "Pending",   bg: "#FEF9C3", color: "#D97706", Icon: Clock },
  "failed":     { label: "Failed",    bg: "#FEF2F2", color: "#EF4444", Icon: XCircle },
  "refunded":   { label: "Refunded",  bg: "#F3F4F6", color: "#6B7280", Icon: CreditCard },
};

function Spinner() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ width:"40px",height:"40px",border:"3px solid #E5E7EB",borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} /><p style={{ fontSize:"13px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Loading revenue data...</p></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || { label: status || "—", bg: "#F3F4F6", color: "#6B7280", Icon: CreditCard };
  const { label, bg, color, Icon } = cfg;
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:700,background:bg,color,fontFamily:"Space Grotesk, sans-serif" }}>
      <Icon size={11} />
      {label}
    </span>
  );
}

export default function AdminRevenuePage() {
  const router = useRouter();
  const [stats,    setStats]    = useState(null);
  const [revenue,  setRevenue]  = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    Promise.all([adminApi.getStats(), adminApi.getRevenue(), adminApi.getPayments()])
      .then(([sRes, rRes, pRes]) => {
        setStats(sRes.data.data);
        setRevenue(rRes.data.data || []);
        setPayments(pRes.data.data || []);
      })
      .catch(() => toast.error("Failed to load revenue data"))
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const rows = [
      ["Transaction ID", "Order ID", "User", "Email", "Amount (Rs.)", "Plan", "Status", "Date"],
      ...payments.map(p => [
        p.paymentId || p.razorpayPaymentId || p.id,
        p.orderId || p.razorpayOrderId || "—",
        p.userName || "—",
        p.userEmail || "—",
        ((p.amount || 0) / 100).toFixed(2),
        p.plan || "PRO",
        p.status || "—",
        p.createdAt?.slice(0, 10),
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "docminty-payments.csv";
    a.click();
  };

  if (loading) return <Spinner />;

  const totalRev   = (stats?.totalRevenue || 0) / 100;
  const monthlyRev = (stats?.revenueThisMonth || 0) / 100;
  const maxRev     = Math.max(...revenue.map(r => r.revenue || 0), 1);

  // Filter payments
  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      (p.userName || "").toLowerCase().includes(q) ||
      (p.userEmail || "").toLowerCase().includes(q) ||
      (p.paymentId || p.razorpayPaymentId || p.id || "").toLowerCase().includes(q) ||
      (p.orderId || p.razorpayOrderId || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || (p.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged      = filtered.slice((page - 1) * perPage, page * perPage);

  const totalFiltered = filtered.reduce((s, p) => s + (p.amount || 0) / 100, 0);

  const STATUS_FILTERS = ["All", "Paid", "Pending", "Failed", "Refunded"];

  return (
    <>
      <AdminHeader title="Revenue" subtitle="Payment and subscription analytics" />
      <div style={{ padding: "24px" }}>

        {/* Stats */}
        <div className="admin-grid-cols-4 admin-stat-cards" style={{ marginBottom: "24px" }}>
          {[
            { title: "Total Revenue",   value: "Rs." + totalRev.toLocaleString("en-IN"),   change: "all time",      up: true },
            { title: "This Month",      value: "Rs." + monthlyRev.toLocaleString("en-IN"), change: "current month", up: true },
            { title: "Total Payments",  value: stats?.totalPayments || 0,                  change: "successful",    up: true },
            { title: "Pro Subscribers", value: stats?.proUsers || 0,                       change: "active",        up: true },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Revenue Chart */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 24px" }}>Monthly Revenue (last 6 months)</p>
          {revenue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
              No revenue data yet.
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "200px" }}>
              {revenue.map((r, i) => {
                const rev = (r.revenue || 0) / 100;
                const h   = Math.max((r.revenue / maxRev) * 160, 4);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>
                      Rs.{rev.toLocaleString("en-IN")}
                    </span>
                    <div style={{ width: "100%", background: i === revenue.length - 1 ? T : T + "80", borderRadius: "6px 6px 0 0", height: h + "px", transition: "height 300ms", position: "relative" }}>
                      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(255,255,255,0.1),transparent)",borderRadius:"6px 6px 0 0" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{r.month?.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>

          {/* Table Toolbar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "220px" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", color: "#111827", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>
                Transaction History
              </p>
              <span style={{ padding: "2px 8px", fontSize: "11px", fontWeight: 700, background: "#F0FDFA", color: T, borderRadius: "20px", fontFamily: "Space Grotesk, sans-serif" }}>
                {filtered.length}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0 12px", height: "36px", flex: 1, minWidth: "200px", maxWidth: "300px" }}>
              <Search size={14} color="#9CA3AF" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, ID..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif", width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {STATUS_FILTERS.map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ padding: "5px 12px", borderRadius: "20px", border: "1px solid " + (statusFilter === s ? T : "#E5E7EB"), background: statusFilter === s ? "#F0FDFA" : "#fff", color: statusFilter === s ? T : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                  {s}
                </button>
              ))}
            </div>

            <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
              <Download size={13} /> Export CSV
            </button>
          </div>

          {/* Summary strip */}
          {filtered.length > 0 && (
            <div style={{ padding: "10px 20px", background: "#F0FDFA", borderBottom: "1px solid #CCFBF1", display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>
                Showing {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>
                Total: Rs.{totalFiltered.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
              <thead>
                <tr style={{ background: "#F8F9FA", borderBottom: "1px solid #E5E7EB" }}>
                  {["Transaction ID", "Order ID", "User", "Plan", "Amount", "Status", "Date"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                      {payments.length === 0 ? "No transactions yet. Payments will appear here after they are processed." : "No transactions match your filters."}
                    </td>
                  </tr>
                ) : paged.map((p, i) => {
                  const txnId   = p.paymentId || p.razorpayPaymentId || p.id || "—";
                  const orderId = p.orderId || p.razorpayOrderId || "—";
                  const amount  = ((p.amount || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 });
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 150ms" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ padding: "6px", background: "#F0FDFA", borderRadius: "6px", flexShrink: 0 }}>
                            <CreditCard size={13} color={T} />
                          </div>
                          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#374151", fontWeight: 600 }}>
                            {txnId.length > 16 ? txnId.slice(0, 16) + "…" : txnId}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#9CA3AF" }}>
                          {orderId.length > 16 ? orderId.slice(0, 16) + "…" : orderId}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div>
                          <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "13px", color: "#111827", fontFamily: "Inter, sans-serif" }}>{p.userName || "—"}</p>
                          <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{p.userEmail || ""}</p>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, background: "#F0FDFA", color: T, fontFamily: "Space Grotesk, sans-serif" }}>
                          {p.plan || "PRO"}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#111827" }}>
                          Rs.{amount}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <StatusBadge status={p.status} />
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6B7280" }}>
                          <Calendar size={12} />
                          <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>{p.createdAt?.slice(0, 10)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: "14px 20px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", fontSize: "12px", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, fontFamily: "Inter, sans-serif" }}>← Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: "30px", height: "30px", border: `1px solid ${p === page ? T : "#E5E7EB"}`, borderRadius: "6px", background: p === page ? T : "#fff", color: p === page ? "#fff" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", fontSize: "12px", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontFamily: "Inter, sans-serif" }}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}