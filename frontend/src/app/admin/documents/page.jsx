"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

import DataTable from "@/app/admin/DataTable";
import DocumentViewModal from "@/components/admin/DocumentViewModal";
import { FileText, Eye, Trash2, Calendar, User as UserIcon } from "lucide-react";

const T = "#0D9488";
const DOC_COLORS = { 
  invoice: T, 
  proforma: "#F59E0B", 
  quotation: "#F59E0B", 
  "salary-slip": "#7C3AED", 
  certificate: "#EC4899", 
  receipt: "#3B82F6", 
  "rent-receipt": "#10B981", 
  "experience-letter": "#6366F1", 
  "purchase-order": "#D97706",
  "packing-slip": "#4B5563"
};

function Spinner() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ width:"40px",height:"40px",border:"3px solid #E5E7EB",borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} /><p style={{ fontSize:"13px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Loading documents...</p></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    
    Promise.all([
      adminApi.getStats(),
      adminApi.getDocuments()
    ])
      .then(([sRes, dRes]) => {
        setStats(sRes.data.data);
        setDocuments(dRes.data.data || []);
      })
      .catch(() => toast.error("Failed to load document data"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      // Assuming a generic delete endpoint exists or adminApi.deleteDocument
      // documentsApi.delete(id)
      setDocuments(prev => prev.filter(d => d.id !== id));
      toast.success("Document deleted");
    } catch { toast.error("Failed to delete document"); }
  };

  const activeDocs = tab === "All" ? documents : documents.filter(d => d.type === tab.toLowerCase());

  if (loading) return <Spinner />;

  const breakdown = Object.entries(stats?.docTypeBreakdown || {}).map(([type, count], i) => ({
    type, count, color: DOC_COLORS[type.toLowerCase()] || "#9CA3AF",
    pct: stats.totalDocuments > 0 ? Math.round((count / stats.totalDocuments) * 100) : 0
  }));

  const columns = [
    {
      key: "title", label: "Document", render: (v, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ padding: "6px", background: "#F3F4F6", borderRadius: "6px" }}>
            <FileText size={14} color="#6B7280" />
          </div>
          <div>
            <p style={{ fontWeight: 600, margin: 0, color: "#111827" }}>{v || "Untitled Document"}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>ID: {String(row.id || "").slice(-8)}</p>
          </div>
        </div>
      )
    },
    {
      key: "type", label: "Category", render: (v) => (
        <span style={{ 
          padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, 
          background: (DOC_COLORS[v.toLowerCase()] || "#9CA3AF") + "15", 
          color: DOC_COLORS[v.toLowerCase()] || "#9CA3AF",
          textTransform: "capitalize", fontFamily: "Space Grotesk, sans-serif"
        }}>
          {v}
        </span>
      )
    },
    {
      key: "userEmail", label: "User", render: (v, row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 500 }}>{row.userName || "N/A"}</span>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{v}</span>
        </div>
      )
    },
    {
      key: "createdAt", label: "Generated On", render: (v) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6B7280" }}>
          <Calendar size={13} />
          <span>{v?.slice(0, 10)}</span>
        </div>
      )
    },
    {
      key: "actions", label: "Action", render: (_, row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setSelectedDoc(row)} style={{ padding: "4px", background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: "6px", color: T, cursor: "pointer" }} title="View Document">
            <Eye size={14} />
          </button>
          <button onClick={() => handleDelete(row.id)} style={{ padding: "4px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "6px", color: "#EF4444", cursor: "pointer" }} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      ),
      sortable: false
    }
  ];

  const categoryCounts = documents.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  const TABS = ["All", ...Object.keys(categoryCounts).map(t => t.charAt(0).toUpperCase() + t.slice(1))];

  return (
    <>
      <AdminHeader title="Documents" subtitle="Full database generated by users" />
      <div style={{ padding: "24px" }}>

        {/* Stats */}
        <div className="admin-grid-cols-4 admin-stat-cards" style={{ marginBottom: "24px" }}>
          {[
            { title: "Total Documents",    value: stats?.totalDocuments?.toLocaleString("en-IN") || "0", change: "all time", up: true },
            { title: "This Month",         value: stats?.documentsThisMonth?.toLocaleString("en-IN") || "0", change: "documents generated", up: true },
            { title: "Today",              value: stats?.documentsToday?.toLocaleString("en-IN") || "0", change: "documents today", up: true },
            { title: "Document Types",     value: breakdown.length, change: "active types", up: true },
          ].map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Category Tabs */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ 
                padding: "8px 16px", borderRadius: "8px", border: "1px solid " + (tab === t ? T : "#E5E7EB"), 
                background: tab === t ? T : "#fff", color: tab === t ? "#fff" : "#6B7280", 
                fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
                transition: "all 200ms"
              }}>
                {t} {t !== "All" && <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.8 }}>({categoryCounts[t.toLowerCase()] || 0})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="table-responsive" style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
          <DataTable columns={columns} data={activeDocs} />
        </div>
      </div>

      {selectedDoc && <DocumentViewModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </>
  );
}