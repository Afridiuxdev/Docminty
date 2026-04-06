"use client";
import { useState, useEffect } from "react";
import { X, FileText, Calendar, User, Tag, DollarSign, Hash, ExternalLink } from "lucide-react";

const T = "#0D9488";
const DOC_COLORS = {
  invoice: T, 
  proforma: "#F59E0B", 
  "proforma-invoice": "#F59E0B",
  quotation: "#F59E0B", 
  "salary-slip": "#7C3AED", 
  certificate: "#EC4899",
  receipt: "#3B82F6", 
  "rent-receipt": "#10B981", 
  "experience-letter": "#6366F1",
  "purchase-order": "#D97706", 
  "packing-slip": "#4B5563",
  "resignation-letter": "#EF4444", 
  "job-offer-letter": "#059669",
  "internship-certificate": "#EC4899", 
  "payment-voucher": "#8B5CF6"
};

/**
 * DocumentViewModal — renders the document inside an iframe pointing to
 * the new internal admin preview route.
 */
export default function DocumentViewModal({ doc, onClose }) {
  const [loaded, setLoaded] = useState(false);
  if (!doc) return null;

  const color = DOC_COLORS[doc.type?.toLowerCase()] || "#9CA3AF";
  // New Admin Preview Route
  const previewUrl = `/admin/documents/preview/${doc.id}`;
  const publicVerifyUrl = doc.referenceNumber ? `/verify/${doc.referenceNumber}` : null;

  return (
    <div style={{ position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)" }} />

      {/* Modal Box */}
      <div style={{
        position:"relative",zIndex:1,
        width:"min(92vw, 1100px)", height:"min(90vh, 850px)",
        background:"#fff",borderRadius:"16px",
        boxShadow:"0 25px 60px rgba(0,0,0,0.25)",
        display:"flex",flexDirection:"column",
        animation:"slideUp 220ms ease-out"
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {/* Header */}
        <div style={{ padding:"16px 24px",borderBottom:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:"12px",flexShrink:0,background:"#F8F9FA",borderRadius:"16px 16px 0 0" }}>
          <div style={{ padding:"8px",background:color+"18",borderRadius:"10px" }}>
            <FileText size={20} color={color} />
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <p style={{ margin:0,fontWeight:700,fontSize:"15px",color:"#111827",fontFamily:"Space Grotesk, sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
              {doc.title || "Untitled Document"}
            </p>
            <div style={{ display:"flex",alignItems:"center",gap:"12px",marginTop:"3px",flexWrap:"wrap" }}>
              <span style={{ fontSize:"11px",fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:"Space Grotesk, sans-serif" }}>{doc.type}</span>
              {doc.referenceNumber && <span style={{ fontSize:"11px",color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Ref: {doc.referenceNumber}</span>}
              {doc.userName && <span style={{ fontSize:"11px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>by {doc.userName}</span>}
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
            {publicVerifyUrl && (
              <a href={publicVerifyUrl} target="_blank" rel="noreferrer"
                style={{ padding:"7px 12px",borderRadius:"8px",background:"#fff",border:"1px solid #E5E7EB",color:"#6B7280",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif",display:"flex",alignItems:"center",gap:"5px",textDecoration:"none",transition:"all 150ms" }}>
                <ExternalLink size={12}/> Public Link
              </a>
            )}
            <button onClick={onClose} style={{ padding:"8px",background:"#F3F4F6",border:"none",borderRadius:"8px",cursor:"pointer",display:"flex",alignItems:"center",color:"#6B7280" }}>
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* Body: High-Fidelity Preview iframe */}
        <div style={{ flex:1,overflow:"hidden",borderRadius:"0 0 16px 16px",position:"relative", background: "#F3F4F6" }}>
          {!loaded && (
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#F8F9FA",flexDirection:"column",gap:"12px", zIndex: 2 }}>
              <div style={{ width:"36px",height:"36px",border:"3px solid #E5E7EB",borderTopColor:T,borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
              <p style={{ margin:0,fontSize:"12px",color:"#9CA3AF",fontFamily:"Inter, sans-serif",fontWeight: 500 }}>Rendering full document preview...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          <iframe
            src={previewUrl}
            title={doc.title || "Document"}
            onLoad={() => setLoaded(true)}
            style={{ width:"100%",height:"100%",border:"none",borderRadius:"0 0 16px 16px",display:loaded?"block":"none" }}
          />
        </div>
      </div>
    </div>
  );
}
