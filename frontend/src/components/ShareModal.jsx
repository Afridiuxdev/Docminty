import { useState } from "react";
import { X, Copy, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { documentsApi } from "@/api/documents";

export default function ShareModal({ isOpen, onClose, doc, onUpdate }) {
  if (!isOpen || !doc) return null;

  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(doc.isPublic || false);
  const [shareToken, setShareToken] = useState(doc.shareToken || "");

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = !isPublic;
      const res = await documentsApi.togglePublic(doc.id, newState);
      setIsPublic(newState);
      if (newState && res.data.data) {
        setShareToken(res.data.data);
      }
      if (onUpdate) onUpdate({ ...doc, isPublic: newState, shareToken: newState ? res.data.data : null });
      toast.success(newState ? "Link generated!" : "Link disabled");
    } catch {
      toast.error("Failed to update access");
    } finally {
      setLoading(false);
    }
  };

  const linkUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${shareToken}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl);
    toast.success("Link copied!");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        width: "100%", maxWidth: "440px", padding: "0",
        position: "relative", overflow: "hidden",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>
            Share Document
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", borderRadius: "6px" }} onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB", marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {isPublic ? <Globe size={24} color="#0D9488" /> : <Lock size={24} color="#6B7280" />}
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>
                  {isPublic ? "Public Access" : "Private Route"}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                  {isPublic ? "Anyone with the link can view." : "Only you can see this."}
                </p>
              </div>
            </div>
            <button 
              onClick={handleToggle} disabled={loading}
              style={{
                width: "44px", height: "24px", background: isPublic ? "#0D9488" : "#E5E7EB", borderRadius: "12px", border: "none", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", padding: "2px", transition: "background 200ms"
              }}>
              <div style={{
                width: "20px", height: "20px", background: "#fff", borderRadius: "50%", transform: isPublic ? "translateX(20px)" : "translateX(0)", transition: "transform 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }} />
            </button>
          </div>

          {isPublic && (
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                type="text" value={linkUrl} readOnly 
                style={{
                  flex: 1, height: "40px", padding: "0 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#374151", outline: "none", fontFamily: "Inter, sans-serif"
                }} 
              />
              <button 
                onClick={handleCopy}
                style={{
                  height: "40px", padding: "0 16px", background: "#0D9488", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontFamily: "Inter, sans-serif"
                }}>
                <Copy size={16} /> Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
