"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashHeader from "@/components/dashboard/DashHeader";
import DocCard from "@/components/dashboard/DocCard";
import { Search, FileText, Trash2 } from "lucide-react";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";
const DOC_TYPES = ["All","invoice","quotation","salary-slip","certificate","receipt","rent-receipt","experience-letter","purchase-order","packing-slip","proforma-invoice","payment-voucher","job-offer-letter","internship-certificate","resignation-letter"];
const TYPE_LABELS = { "All":"All","invoice":"GST Invoice","quotation":"Quotation","salary-slip":"Salary Slip","certificate":"Certificate","receipt":"Receipt","rent-receipt":"Rent Receipt","experience-letter":"Experience Letter","purchase-order":"Purchase Order" };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return mins + "m ago";
  if (hrs  < 24) return hrs  + "h ago";
  if (days < 7)  return days + "d ago";
  return new Date(dateStr).toLocaleDateString("en-IN");
}

const DOC_COLORS = { invoice: T, quotation: "#F59E0B", "salary-slip": "#7C3AED", certificate: "#EC4899", receipt: "#3B82F6", "rent-receipt": "#10B981" };

export default function DashDocumentsPage() {
  const router = useRouter();
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    documentsApi.getAll()
      .then(res => setDocs(res.data.data || []))
      .catch(() => toast.error("Failed to load documents"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    setDeleting(id);
    try {
      await documentsApi.delete(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast.success("Document deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  };

  const filtered = docs.filter(d => {
    const matchType   = filter === "All" || d.docType === filter;
    const matchSearch = d.title?.toLowerCase().includes(search.toLowerCase()) || d.docType?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #E5E7EB", borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Loading documents...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <DashHeader title="My Documents" subtitle={docs.length + " documents saved"} />
      <div style={{ padding: "24px" }}>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." style={{ width: "100%", height: "38px", paddingLeft: "36px", paddingRight: "12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box", background: "#fff" }} />
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["All", "invoice", "quotation", "salary-slip", "certificate", "receipt"].map(type => (
              <button key={type} onClick={() => setFilter(type)} style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid " + (filter === type ? T : "#E5E7EB"), background: filter === type ? "#F0FDFA" : "#fff", color: filter === type ? T : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                {TYPE_LABELS[type] || type}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <FileText size={40} color="#E5E7EB" style={{ margin: "0 auto 16px", display: "block" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif" }}>
              {search || filter !== "All" ? "No documents match your search" : "No documents yet"}
            </p>
            <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 0 20px", fontFamily: "Inter, sans-serif" }}>Documents you save while generating will appear here.</p>
            <a href="/invoice" style={{ display: "inline-block", padding: "10px 24px", background: T, color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>Create First Document</a>
          </div>
        )}

        {/* Documents grid */}
        {filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "12px" }}>
            {filtered.map(doc => (
              <div key={doc.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "16px", position: "relative" }}>
                {/* Color bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: DOC_COLORS[doc.docType] || T, borderRadius: "10px 10px 0 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "4px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 4px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{TYPE_LABELS[doc.docType] || doc.docType}</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>{doc.title}</p>
                    {doc.partyName && <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 8px", fontFamily: "Inter, sans-serif" }}>To: {doc.partyName}</p>}
                  </div>
                  <button onClick={() => handleDelete(doc.id)} disabled={deleting === doc.id} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: "4px", opacity: deleting === doc.id ? 0.5 : 1 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #F3F4F6" }}>
                  {doc.amount ? <span style={{ fontSize: "14px", fontWeight: 700, color: DOC_COLORS[doc.docType] || T, fontFamily: "Space Grotesk, sans-serif" }}>Rs.{Number(doc.amount).toLocaleString("en-IN")}</span> : <span />}
                  <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{timeAgo(doc.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}