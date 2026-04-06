"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashHeader from "@/components/dashboard/DashHeader";
import DocCard from "@/components/dashboard/DocCard";
import { Search, FileText, Trash2 } from "lucide-react";
import { documentsApi } from "@/api/documents";
import { authApi, getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";
import DocumentModal from "@/components/DocumentModal";
import ShareModal from "@/components/ShareModal";

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
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleting, setDeleting] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    Promise.all([authApi.me(), documentsApi.getAll()])
      .then(([uRes, dRes]) => {
        setUser(uRes.data.data);
        setDocs(dRes.data.data || []);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const isPro = user?.plan?.toUpperCase() === "PRO" || user?.plan?.toUpperCase() === "ENTERPRISE";

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

  const handleAction = (action, doc) => {
    try {
      const data = JSON.parse(doc.formData || "{}");
      if (action === "edit") {
        data.docId = doc.id; 
        data.editMode = true;
        localStorage.setItem("docminty_draft", JSON.stringify(data));
        router.push(`/${doc.docType}`);
      } else if (action === "duplicate") {
        delete data.docId;
        data.editMode = false;
        localStorage.setItem("docminty_draft", JSON.stringify(data));
        router.push(`/${doc.docType}`);
      } else if (action === "share") {
        setSelectedDoc(doc);
        setShareModalOpen(true);
      } else if (action === "view" || action === "download") {
        if (action === "view" && doc.cloudinaryUrl) {
          setSelectedDoc(doc);
          setModalOpen(true);
        } else {
          data.autoDownload = action === "download";
          data.viewMode = action === "view";
          data.docId = doc.id; 
          localStorage.setItem("docminty_draft", JSON.stringify(data));
          router.push(`/${doc.docType}`);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to parse document data");
    }
  };

  const filtered = docs.filter(d => {
    const matchType = filter === "All" || d.docType === filter;
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
      <style>{`
        .docs-container { padding: 24px; }
        .filter-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-box { position: relative; flex: 1; min-width: 280px; }
        .filter-buttons { display: flex; gap: 6px; flex-wrap: wrap; }
        .docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 12px; }

        @media (max-width: 768px) {
          .docs-container { padding: 16px; }
          .search-box { min-width: 100%; order: 1; }
          .filter-buttons { order: 2; width: 100%; justify-content: flex-start; }
          .filter-buttons button { flex: 1; min-width: 80px; white-space: nowrap; }
        }
      `}</style>

      <DashHeader title="My Documents" subtitle={docs.length + " documents saved"} />
      
      <div className="docs-container">
        {/* Search + Filter */}
        <div className="filter-bar">
          <div className="search-box">
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." style={{ width: "100%", height: "38px", paddingLeft: "36px", paddingRight: "12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box", background: "#fff" }} />
          </div>
          <div className="filter-buttons">
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
            {!isPro && !search && filter === "All" ? (
               <div style={{ maxWidth: "400px", margin: "0 auto", padding: "0 16px" }}>
                 <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 20px", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                   Cloud document saving is a premium feature. Upgrade to <strong>Business Pro</strong> to save and manage your documents in the cloud.
                 </p>
                 <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                   <Link href="/dashboard/billing" style={{ display: "inline-block", padding: "10px 24px", background: T, color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>View Plans</Link>
                 </div>
               </div>
            ) : (
              <div style={{ padding: "0 16px" }}>
                <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 0 20px", fontFamily: "Inter, sans-serif" }}>Documents you save while generating will appear here.</p>
                <Link href="/invoice" style={{ display: "inline-block", padding: "10px 24px", background: T, color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>Create First Document</Link>
              </div>
            )}
          </div>
        )}

        {/* Documents grid */}
        {filtered.length > 0 && (
          <div className="docs-grid">
            {filtered.map(doc => (
              <DocCard 
                key={doc.id}
                doc={{
                  id: doc.id,
                  type: TYPE_LABELS[doc.docType] || doc.docType,
                  docType: doc.docType,
                  name: doc.title,
                  amount: doc.amount ? "Rs." + Number(doc.amount).toLocaleString("en-IN") : "",
                  date: timeAgo(doc.createdAt),
                  formData: doc.formData,
                  cloudinaryUrl: doc.cloudinaryUrl,
                  isPublic: doc.isPublic,
                  shareToken: doc.shareToken
                }}
                onAction={handleAction}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <DocumentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        documentUrl={selectedDoc?.cloudinaryUrl} 
        title={selectedDoc?.name || selectedDoc?.title} 
      />
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        doc={selectedDoc}
        onUpdate={(updatedDoc) => {
          setDocs(docs.map(d => d.id === updatedDoc.id ? { ...d, isPublic: updatedDoc.isPublic, shareToken: updatedDoc.shareToken } : d));
          setSelectedDoc(updatedDoc);
        }}
      />
    </>
  );
}