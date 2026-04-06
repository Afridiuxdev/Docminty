import { X } from "lucide-react";

export default function DocumentModal({ isOpen, onClose, documentUrl, title }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        width: "100%", maxWidth: "900px",
        height: "90vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid #E5E7EB",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#F9FAFB"
        }}>
          <h2 style={{
            margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827",
            fontFamily: "Space Grotesk, sans-serif"
          }}>{title || "Document Preview"}</h2>
          <button 
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center",
              padding: "4px", borderRadius: "6px", transition: "background 150ms"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#E5E7EB"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, backgroundColor: "#E5E7EB", position: "relative" }}>
          {documentUrl ? (
            <iframe
              src={`${documentUrl}#toolbar=0`}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              title="PDF Preview"
            />
          ) : (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%", color: "#6B7280", fontFamily: "Inter, sans-serif"
            }}>
              No document URL provided.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
