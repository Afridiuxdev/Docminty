"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/api/admin";
import { getAccessToken } from "@/api/auth";
import toast from "react-hot-toast";
import DocumentViewModal from "@/components/admin/DocumentViewModal";
import { ArrowLeft, User, Mail, Phone, Building2, Calendar, FileText, ChevronRight, Ban, CheckCircle, Globe, MapPin, Hash, CreditCard, ExternalLink } from "lucide-react";

const T = "#0D9488";
const STATUS_COLORS = { ACTIVE: { bg: "#ECFDF5", color: "#10B981" }, INACTIVE: { bg: "#FEF9C3", color: "#D97706" }, BANNED: { bg: "#FEF2F2", color: "#EF4444" } };
const PLAN_COLORS   = { PRO: { bg: "#F0FDFA", color: T }, FREE: { bg: "#F8F9FA", color: "#9CA3AF" }, ENTERPRISE: { bg: "#EEF2FF", color: "#6366F1" } };
const DOC_COLORS    = { invoice: T, proforma: "#F59E0B", "proforma-invoice": "#F59E0B", quotation: "#F59E0B", "salary-slip": "#7C3AED", certificate: "#EC4899", receipt: "#3B82F6", "rent-receipt": "#10B981", "experience-letter": "#6366F1", "purchase-order": "#D97706", "packing-slip": "#4B5563" };

function Spinner() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}><div style={{ textAlign:"center" }}><div style={{ width:"40px",height:"40px",border:`3px solid #E5E7EB`,borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} /><p style={{ fontSize:"13px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Loading user profile...</p></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:"flex",alignItems:"flex-start",gap:"12px",padding:"12px 0",borderBottom:"1px solid #F3F4F6" }}>
      <div style={{ background:"#F3F4F6",padding:"8px",borderRadius:"8px",flexShrink:0 }}>{icon}</div>
      <div>
        <p style={{ margin:"0 0 2px",fontSize:"11px",color:"#9CA3AF",fontFamily:"Inter, sans-serif",textTransform:"uppercase",letterSpacing:"0.04em" }}>{label}</p>
        <p style={{ margin:0,fontSize:"13px",fontWeight:600,color:"#374151",fontFamily:"Inter, sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}

export default function UserProfilePage({ params }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const userId = unwrappedParams.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);
  const [docTab, setDocTab] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push("/login"); return; }
    adminApi.getUserDetails(userId)
      .then(res => setUser(res.data.data))
      .catch(() => { toast.error("Failed to load user"); router.push("/admin/users"); })
      .finally(() => setLoading(false));
  }, [userId, router]);

  const handleBanToggle = async () => {
    const isBanned = user.status === "BANNED";
    if (!confirm((isBanned ? "Unban " : "Ban ") + user.name + "?")) return;
    setActioning(true);
    try {
      if (isBanned) {
        await adminApi.unbanUser(user.id);
        setUser(u => ({ ...u, status: "ACTIVE" }));
        toast.success("User unbanned successfully");
      } else {
        await adminApi.banUser(user.id);
        setUser(u => ({ ...u, status: "BANNED" }));
        toast.success("User banned successfully");
      }
    } catch { toast.error("Failed to update user status"); }
    finally { setActioning(false); }
  };

  if (loading) return <Spinner />;
  if (!user)   return null;

  const documents  = user.documents || [];
  const docTypes   = ["All", ...new Set(documents.map(d => d.type).filter(Boolean))];
  const filtered   = docTab === "All" ? documents : documents.filter(d => d.type === docTab);
  const sc = STATUS_COLORS[user.status] || STATUS_COLORS.ACTIVE;
  const pc = PLAN_COLORS[user.plan]     || PLAN_COLORS.FREE;

  const hasCompany = user.companyName || user.gstin || user.address || user.city || user.state || user.pincode || user.website;

  return (
    <>
      {/* Top Nav */}
      <div style={{ background:"#fff",borderBottom:"1px solid #E5E7EB",padding:"14px 24px",display:"flex",alignItems:"center",gap:"16px",position:"sticky",top:0,zIndex:20 }}>
        <button onClick={() => router.push("/admin/users")} style={{ padding:"8px",background:"#F3F4F6",border:"none",borderRadius:"8px",cursor:"pointer",display:"flex",alignItems:"center",color:"#4B5563" }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <p style={{ margin:0,fontWeight:700,fontSize:"17px",color:"#111827",fontFamily:"Space Grotesk, sans-serif" }}>User Profile</p>
          <p style={{ margin:0,fontSize:"12px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>ID: {user.id}</p>
        </div>
      </div>

      <div style={{ padding:"24px",maxWidth:"1300px",margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"340px 1fr",gap:"24px",alignItems:"start" }}>

          {/* ───── Left Column ───── */}
          <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>

            {/* Profile Card */}
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"14px",overflow:"hidden" }}>
              <div style={{ padding:"28px 24px 20px",background:"linear-gradient(135deg,#F0FDFA,#ECFDF5)",borderBottom:"1px solid #E5E7EB",textAlign:"center" }}>
                <div style={{ width:"72px",height:"72px",borderRadius:"50%",background:T,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",fontWeight:800,color:"#fff",fontFamily:"Space Grotesk, sans-serif",boxShadow:"0 4px 12px rgba(13,148,136,0.3)" }}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <h2 style={{ margin:"0 0 4px",fontSize:"18px",fontWeight:700,fontFamily:"Space Grotesk, sans-serif",color:"#111827" }}>{user.name}</h2>
                <p style={{ margin:"0 0 14px",fontSize:"13px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{user.email}</p>
                <div style={{ display:"flex",justifyContent:"center",gap:"8px" }}>
                  <span style={{ padding:"4px 14px",borderRadius:"20px",fontSize:"12px",fontWeight:700,background:pc.bg,color:pc.color,fontFamily:"Space Grotesk, sans-serif" }}>{user.plan}</span>
                  <span style={{ padding:"4px 14px",borderRadius:"20px",fontSize:"12px",fontWeight:700,background:sc.bg,color:sc.color,fontFamily:"Space Grotesk, sans-serif",display:"flex",alignItems:"center",gap:"5px" }}>
                    <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:sc.color,flexShrink:0 }} />{user.status}
                  </span>
                </div>
              </div>

              {/* Contact & Personal Info */}
              <div style={{ padding:"4px 20px 8px" }}>
                <InfoRow icon={<Mail size={15} color="#6B7280"/>}     label="Email"        value={user.email} />
                <InfoRow icon={<Phone size={15} color="#6B7280"/>}    label="Phone"        value={user.phone} />
                <InfoRow icon={<Calendar size={15} color="#6B7280"/>} label="Date Joined"  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}) : null} />
                <InfoRow icon={<FileText size={15} color="#6B7280"/>} label="Documents"    value={documents.length + " generated"} />
              </div>
            </div>

            {/* Document Usage Statistics */}
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"14px",overflow:"hidden" }}>
              <div style={{ padding:"14px 20px",borderBottom:"1px solid #F3F4F6",background:"#F8F9FA" }}>
                <p style={{ margin:0,fontWeight:700,fontSize:"11px",color:"#374151",fontFamily:"Space Grotesk, sans-serif",textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:"7px" }}>
                  <FileText size={14} color={T} /> Usage Statistics
                </p>
              </div>
              <div style={{ padding:"20px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"10px" }}>
                  <div>
                    <p style={{ margin:0,fontSize:"12px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>Documents Saved</p>
                    <p style={{ margin:"2px 0 0",fontSize:"20px",fontWeight:800,color:"#111827",fontFamily:"Space Grotesk, sans-serif" }}>
                      {documents.length} <span style={{ fontSize:"14px",color:"#9CA3AF",fontWeight:500 }}>/ {({ FREE: 2, PRO: 20, "BUSINESS PRO": 20, ENTERPRISE: 50 }[user.plan?.toUpperCase()] || 2)}</span>
                    </p>
                  </div>
                  <span style={{ fontSize:"12px",fontWeight:700,color: documents.length >= ({ FREE: 2, PRO: 20, "BUSINESS PRO": 20, ENTERPRISE: 50 }[user.plan?.toUpperCase()] || 2) ? "#EF4444" : T,fontFamily:"Space Grotesk, sans-serif" }}>
                    {Math.round((documents.length / ({ FREE: 2, PRO: 20, "BUSINESS PRO": 20, ENTERPRISE: 50 }[user.plan?.toUpperCase()] || 2)) * 100)}% Used
                  </span>
                </div>
                <div style={{ height:"8px",background:"#F3F4F6",borderRadius:"10px",overflow:"hidden" }}>
                  <div style={{ 
                    height:"100%", 
                    width:`${Math.min(100, (documents.length / ({ FREE: 2, PRO: 20, "BUSINESS PRO": 20, ENTERPRISE: 50 }[user.plan?.toUpperCase()] || 2)) * 100)}%`, 
                    background: documents.length >= ({ FREE: 2, PRO: 20, "BUSINESS PRO": 20, ENTERPRISE: 50 }[user.plan?.toUpperCase()] || 2) ? "#EF4444" : T,
                    borderRadius:"10px", 
                    transition:"width 1s ease-out" 
                  }} />
                </div>
                {documents.length >= ({ FREE: 2, PRO: 20, "BUSINESS PRO": 20, ENTERPRISE: 50 }[user.plan?.toUpperCase()] || 2) && (
                  <p style={{ margin:"12px 0 0",fontSize:"11px",color:"#EF4444",fontFamily:"Inter, sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:"4px" }}>
                    <Ban size={12}/> Storage limit reached for {user.plan} plan.
                  </p>
                )}
              </div>
            </div>

            {/* Company Details Card */}
            {hasCompany && (
              <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"14px",overflow:"hidden" }}>
                <div style={{ padding:"14px 20px",borderBottom:"1px solid #F3F4F6",background:"#F8F9FA" }}>
                  <p style={{ margin:0,fontWeight:700,fontSize:"11px",color:"#374151",fontFamily:"Space Grotesk, sans-serif",textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:"7px" }}>
                    <Building2 size={14} color={T} /> Company Details
                  </p>
                </div>
                <div style={{ padding:"4px 20px 8px" }}>
                  <InfoRow icon={<Building2 size={15} color="#6B7280"/>} label="Company Name" value={user.companyName} />
                  <InfoRow icon={<Hash size={15} color="#6B7280"/>}       label="GSTIN"        value={user.gstin} />
                  <InfoRow icon={<MapPin size={15} color="#6B7280"/>}     label="Address"      value={[user.address, user.city, user.state, user.pincode].filter(Boolean).join(", ")} />
                  <InfoRow icon={<Globe size={15} color="#6B7280"/>}      label="Website"      value={user.website} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"14px",padding:"20px" }}>
              <p style={{ margin:"0 0 14px",fontWeight:700,fontSize:"11px",color:"#374151",fontFamily:"Space Grotesk, sans-serif",textTransform:"uppercase",letterSpacing:"0.06em" }}>Management Actions</p>
              <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
                <button onClick={() => window.open(`mailto:${user.email}`,"_blank")}
                  style={{ width:"100%",padding:"10px 16px",borderRadius:"8px",border:"1px solid #E5E7EB",background:"#fff",color:"#374151",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                  <Mail size={16}/> Send Email
                </button>
                <button onClick={handleBanToggle} disabled={actioning}
                  style={{ width:"100%",padding:"10px 16px",borderRadius:"8px",border:`1px solid ${user.status==="BANNED"?T:"#EF4444"}`,background:user.status==="BANNED"?"#F0FDFA":"#FEF2F2",color:user.status==="BANNED"?T:"#EF4444",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",opacity:actioning?0.6:1 }}>
                  {user.status==="BANNED" ? <><CheckCircle size={16}/>Unban Account</> : <><Ban size={16}/>Ban Account</>}
                </button>
              </div>
            </div>
          </div>

          {/* ───── Right Column: Documents ───── */}
          <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"14px",overflow:"hidden" }}>
            <div style={{ padding:"20px 24px",borderBottom:"1px solid #E5E7EB",background:"#F8F9FA",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div>
                <h3 style={{ margin:0,fontWeight:700,fontSize:"16px",color:"#111827",fontFamily:"Space Grotesk, sans-serif" }}>Generated Documents</h3>
                <p style={{ margin:"2px 0 0",fontSize:"13px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{documents.length} document{documents.length!==1?"s":""} total</p>
              </div>
            </div>

            {/* Tabs */}
            {docTypes.length > 1 && (
              <div style={{ padding:"14px 24px",borderBottom:"1px solid #F3F4F6",display:"flex",gap:"8px",flexWrap:"wrap" }}>
                {docTypes.map(dt => (
                  <button key={dt} onClick={() => setDocTab(dt)}
                    style={{ padding:"6px 14px",borderRadius:"20px",border:`1px solid ${docTab===dt?T:"#E5E7EB"}`,background:docTab===dt?"#F0FDFA":"#fff",color:docTab===dt?T:"#6B7280",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif",textTransform:"capitalize",transition:"all 150ms" }}>
                    {dt}
                  </button>
                ))}
              </div>
            )}

            {/* Document List */}
            <div style={{ padding:"20px 24px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center",padding:"80px 20px" }}>
                  <FileText size={48} color="#E5E7EB" style={{ margin:"0 auto 12px",display:"block" }} />
                  <p style={{ margin:0,fontWeight:500,color:"#6B7280",fontFamily:"Inter, sans-serif",fontSize:"14px" }}>No documents found</p>
                  <p style={{ margin:"4px 0 0",fontSize:"12px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>This user hasn't generated any documents yet.</p>
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
                  {filtered.map((doc, i) => {
                    const color = DOC_COLORS[doc.type?.toLowerCase()] || "#9CA3AF";
                    return (
                      <div key={i} style={{ padding:"16px 20px",background:"#FAFAFA",border:"1px solid #E5E7EB",borderRadius:"12px",display:"flex",alignItems:"center",gap:"16px",borderLeft:`4px solid ${color}`,transition:"box-shadow 200ms, background 200ms",cursor:"pointer" }}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.06)";e.currentTarget.style.background="#fff"}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.background="#FAFAFA"}}
                        onClick={() => setSelectedDoc(doc)}>
                        <div style={{ padding:"10px",background:`${color}15`,borderRadius:"10px",flexShrink:0 }}>
                          <FileText size={20} color={color} />
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <p style={{ margin:"0 0 4px",fontWeight:700,fontSize:"14px",color:"#111827",fontFamily:"Space Grotesk, sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                            {doc.title || "Untitled Document"}
                          </p>
                          <div style={{ display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap" }}>
                            <span style={{ fontSize:"11px",fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:"Space Grotesk, sans-serif" }}>{doc.type}</span>
                            {doc.partyName && <span style={{ fontSize:"12px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{doc.partyName}</span>}
                            {doc.amount && <span style={{ fontSize:"12px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>Rs.{parseFloat(doc.amount).toLocaleString("en-IN")}</span>}
                            <span style={{ fontSize:"12px",color:"#9CA3AF",fontFamily:"Inter, sans-serif",display:"flex",alignItems:"center",gap:"4px" }}>
                              <Calendar size={12}/> {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-IN",{month:"short",day:"numeric",year:"numeric"}) : "---"}
                            </span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                            style={{ padding:"8px 14px",background:"#F0FDFA",border:`1px solid #CCFBF1`,borderRadius:"8px",color:T,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif",display:"flex",alignItems:"center",gap:"6px",flexShrink:0,whiteSpace:"nowrap" }}>
                          <ExternalLink size={13}/> View
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {selectedDoc && <DocumentViewModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </>
  );
}
