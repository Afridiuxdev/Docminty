import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        width: "100%", maxWidth: "400px", padding: "32px",
        textAlign: "center", position: "relative",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        <button 
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none", cursor: "pointer",
            color: "#9CA3AF"
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: "56px", height: "56px", background: "#FEF3C7", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <AlertTriangle size={28} color="#D97706" />
        </div>

        <h3 style={{
          margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: "#111827",
          fontFamily: "Space Grotesk, sans-serif"
        }}>
          Plan Limit Reached
        </h3>
        
        <p style={{
          margin: "0 0 24px", fontSize: "14px", color: "#6B7280", lineHeight: 1.5,
          fontFamily: "Inter, sans-serif"
        }}>
          You’ve reached your plan limit. Upgrade to continue saving documents natively within the cloud.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/dashboard/billing" onClick={onClose} style={{
            display: "block", width: "100%", padding: "12px", background: "#0D9488",
            color: "#fff", borderRadius: "8px", fontWeight: 600, fontSize: "14px",
            textDecoration: "none", fontFamily: "Space Grotesk, sans-serif",
            transition: "background 150ms"
          }}>
            Upgrade Plan
          </Link>
          <button onClick={onClose} style={{
            width: "100%", padding: "12px", background: "#F3F4F6", border: "none",
            color: "#374151", borderRadius: "8px", fontWeight: 600, fontSize: "14px",
            cursor: "pointer", fontFamily: "Space Grotesk, sans-serif",
            transition: "background 150ms"
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
