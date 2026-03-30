"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import { UserPlus, Download } from "lucide-react";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";
const STATUS_COLORS = { ACTIVE: { bg: "#ECFDF5", color: "#10B981" }, INACTIVE: { bg: "#FEF9C3", color: "#D97706" }, BANNED: { bg: "#FEF2F2", color: "#EF4444" } };
const PLAN_COLORS   = { PRO: { bg: "#F0FDFA", color: T }, FREE: { bg: "#F8F9FA", color: "#9CA3AF" } };

function Spinner() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ width:"40px",height:"40px",border:"3px solid #E5E7EB",borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} /><p style={{ fontSize:"13px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Loading users...</p></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [actioning, setActioning]   = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    adminApi.getUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleBan = async (user) => {
    if (!confirm((user.status === "BANNED" ? "Unban " : "Ban ") + user.name + "?")) return;
    setActioning(user.id);
    try {
      if (user.status === "BANNED") {
        await adminApi.unbanUser(user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "ACTIVE" } : u));
        toast.success("User unbanned");
      } else {
        await adminApi.banUser(user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "BANNED" } : u));
        toast.success("User banned");
      }
    } catch { toast.error("Action failed"); }
    finally { setActioning(null); }
  };

  const exportCSV = () => {
    const rows = [["ID","Name","Email","Plan","Status","Joined"],...users.map(u => [u.id,u.name,u.email,u.plan,u.status,u.createdAt?.slice(0,10)])];
    const csv  = rows.map(r => r.join(",")).join("\n");
    const a    = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "docminty-users.csv";
    a.click();
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan   = planFilter === "All" || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const proCount  = users.filter(u => u.plan === "PRO").length;
  const freeCount = users.filter(u => u.plan === "FREE").length;
  const bannedCount = users.filter(u => u.status === "BANNED").length;

  if (loading) return <Spinner />;

  return (
    <>
      <AdminHeader title="Users" subtitle={users.length + " registered users"} />
      <div style={{ padding: "24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { title: "Total Users", value: users.length, change: "registered", up: true },
            { title: "Pro Users",   value: proCount,     change: ((proCount/Math.max(users.length,1))*100).toFixed(1) + "% of total", up: true },
            { title: "Free Users",  value: freeCount,    change: ((freeCount/Math.max(users.length,1))*100).toFixed(1) + "% of total", up: false },
            { title: "Banned",      value: bannedCount,  change: "accounts suspended", up: false },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Toolbar */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ flex: 1, minWidth: "200px", height: "36px", padding: "0 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "Inter, sans-serif" }} />
          {["All","PRO","FREE"].map(p => (
            <button key={p} onClick={() => setPlanFilter(p)} style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid " + (planFilter === p ? T : "#E5E7EB"), background: planFilter === p ? "#F0FDFA" : "#fff", color: planFilter === p ? T : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{p}</button>
          ))}
          <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        {/* Users Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FA", borderBottom: "1px solid #E5E7EB" }}>
                  {["Name","Email","Plan","Status","Joined","Action"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const sc = STATUS_COLORS[u.status] || STATUS_COLORS.ACTIVE;
                  const pc = PLAN_COLORS[u.plan]   || PLAN_COLORS.FREE;
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", background: T, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}>{u.name?.charAt(0)}</span>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, background: pc.bg, color: pc.color, fontFamily: "Space Grotesk, sans-serif" }}>{u.plan}</span></td>
                      <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, background: sc.bg, color: sc.color, fontFamily: "Space Grotesk, sans-serif" }}>{u.status}</span></td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{u.createdAt?.slice(0,10)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => handleBan(u)} disabled={actioning === u.id} style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid " + (u.status === "BANNED" ? T : "#EF4444"), background: "#fff", color: u.status === "BANNED" ? T : "#EF4444", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", opacity: actioning === u.id ? 0.5 : 1 }}>
                          {actioning === u.id ? "..." : u.status === "BANNED" ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}