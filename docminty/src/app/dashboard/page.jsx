"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashHeader from "@/components/dashboard/DashHeader";
import UsageBar from "@/components/dashboard/UsageBar";
import DocCard from "@/components/dashboard/DocCard";
import {
  FileText, TrendingUp, Clock, Star, ArrowRight, Plus,
  FileQuestion, Banknote, Receipt, Home, Award, Briefcase, ShoppingCart, QrCode
} from "lucide-react";
import { documentsApi } from "@/api/documents";
import { authApi, getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";

const T = "#0D9488";

const QUICK_CREATE = [
  { label: "GST Invoice",      href: "/invoice",          icon: FileText },
  { label: "Quotation",        href: "/quotation",        icon: FileQuestion },
  { label: "Salary Slip",      href: "/salary-slip",      icon: Banknote },
  { label: "Receipt",          href: "/receipt",          icon: Receipt },
  { label: "Rent Receipt",     href: "/rent-receipt",     icon: Home },
  { label: "Certificate",      href: "/certificate",      icon: Award },
  { label: "Experience Letter",href: "/experience-letter",icon: Briefcase },
  { label: "Purchase Order",   href: "/purchase-order",   icon: ShoppingCart },
  { label: "QR Code Generator", href: "/tools/qr-generator", icon: QrCode },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60)  return mins + "m ago";
  if (hrs  < 24)  return hrs  + "h ago";
  if (days < 7)   return days + "d ago";
  return new Date(dateStr).toLocaleDateString("en-IN");
}

export default function DashboardPage() {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    Promise.all([authApi.me(), documentsApi.getAll()])
      .then(([userRes, docsRes]) => {
        setUser(userRes.data.data);
        setDocs(docsRes.data.data || []);
      })
      .catch(() => { router.push("/login"); })
      .finally(() => setLoading(false));
  }, []);

  const deleteDoc = async (id) => {
    try {
      await documentsApi.delete(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast.success("Document deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const thisMonth = docs.filter(d => {
    const docDate = new Date(d.createdAt);
    const now = new Date();
    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
  }).length;

  const lastCreated = docs.length > 0 ? timeAgo(docs[0].createdAt) : "Never";
  const plan = user?.plan?.toUpperCase() || "FREE";
  const isPro = plan === "PRO" || plan === "ENTERPRISE";
  const limit = plan === "ENTERPRISE" ? 50 : (plan === "PRO" ? 20 : 0);

  const STATS = [
    { label: "Docs This Month", value: thisMonth,      icon: <TrendingUp size={18} color={T} />,         bg: "#F0FDFA" },
    { label: "Total Documents", value: docs.length,    icon: <FileText   size={18} color="#7C3AED" />,   bg: "#F5F3FF" },
    { label: "Last Created",    value: lastCreated,    icon: <Clock      size={18} color="#F59E0B" />,   bg: "#FFFBEB" },
    { label: "Plan",            value: isPro ? (plan === "ENTERPRISE" ? "Enterprise" : "Business Pro") : "Free Plan", icon: <Star size={18} color={isPro ? "#F59E0B" : "#9CA3AF"} />, bg: "#F8F9FA" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #E5E7EB", borderTopColor: T, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        .dash-container { padding: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .quick-create-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .upgrade-cta { margin-top: 20px; background: linear-gradient(135deg,#0D9488,#0F766E); border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .dash-container { padding: 16px; }
          .main-grid { grid-template-columns: 1fr; gap: 16px; }
          .upgrade-cta { flex-direction: column; text-align: center; gap: 16px; }
          .upgrade-cta div { margin-bottom: 4px; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .quick-create-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <DashHeader title="Dashboard" subtitle={"Welcome back, " + (user?.name?.split(" ")[0] || "there") + "!"} />
      
      <div className="dash-container">
        {/* Stats */}
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", background: s.bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: "#111827", margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div style={{ marginBottom: "24px" }}>
          <UsageBar used={docs.length} total={isPro ? (plan === "ENTERPRISE" ? 50 : 20) : 0} label="Cloud storage usage" />
          {limit > 0 && docs.length >= (limit * 0.8) && (
            <div style={{ marginTop: "8px", padding: "10px 14px", background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "12px", color: "#92400E", margin: 0, fontFamily: "Inter, sans-serif" }}>You are approaching your plan limit of {limit} documents.</p>
              <Link href="/dashboard/billing" style={{ fontSize: "12px", fontWeight: 700, color: "#D97706", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>Upgrade Plan</Link>
            </div>
          )}
          {limit === 0 && (
            <div style={{ marginTop: "8px", padding: "10px 14px", background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "12px", color: T, margin: 0, fontFamily: "Inter, sans-serif" }}>Cloud storage is disabled for Free users. Upgrade to save documents.</p>
              <Link href="/dashboard/billing" style={{ fontSize: "12px", fontWeight: 700, color: T, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>View Plans →</Link>
            </div>
          )}
        </div>

        <div className="main-grid">
          {/* Quick Create */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>Quick Create</h2>
              <Link href="/dashboard/create" style={{ fontSize: "12px", color: T, textDecoration: "none", fontFamily: "Inter, sans-serif" }}>View all</Link>
            </div>
            <div className="quick-create-grid">
              {QUICK_CREATE.map(item => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", textDecoration: "none", transition: "all 150ms", background: "#FAFAFA" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.background = "#F0FDFA"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#FAFAFA"; }}
                  >
                    <div style={{ width: "24px", height: "24px", background: "#F0FDFA", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #CCFBF1" }}>
                      <Icon size={14} color={T} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Documents */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>Recent Documents</h2>
              <Link href="/dashboard/documents" style={{ fontSize: "12px", color: T, textDecoration: "none", fontFamily: "Inter, sans-serif" }}>View all</Link>
            </div>
            {docs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <FileText size={32} color="#E5E7EB" style={{ margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>No documents yet.</p>
                <Link href="/invoice" style={{ display: "inline-block", padding: "8px 20px", background: T, color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif" }}>Create Invoice</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {docs.slice(0, 5).map(doc => (
                  <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#FAFAFA", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: "12px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: "0 0 2px", fontFamily: "Inter, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                      <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{doc.docType} · {timeAgo(doc.createdAt)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      {doc.amount && <span style={{ fontSize: "12px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>Rs.{doc.amount.toLocaleString("en-IN")}</span>}
                      <button onClick={() => deleteDoc(doc.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: "16px", padding: "4px" }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upgrade CTA for free users */}
        {!isPro && (
          <div className="upgrade-cta">
            <div>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", margin: "0 0 4px" }}>Upgrade to Business Pro</p>
              <p style={{ fontSize: "13px", color: "#99F6E4", margin: 0, fontFamily: "Inter, sans-serif" }}>Batch processing, cloud storage, premium templates</p>
            </div>
            <Link href="/pricing" style={{ padding: "10px 20px", background: "#fff", color: T, borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", whiteSpace: "nowrap" }}>Upgrade Now</Link>
          </div>
        )}
      </div>
    </>
  );
}
