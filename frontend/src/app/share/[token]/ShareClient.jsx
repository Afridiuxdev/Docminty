"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { documentsApi } from "@/api/documents";

export default function ShareClient() {
  const { token } = useParams();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || token === "view") {
        setLoading(false);
        return;
    }
    documentsApi.getPublic(token)
      .then(res => setDocData(res.data.data))
      .catch(err => {
        if (err?.response?.status === 403 || err?.response?.data?.message === "Document is not public") {
          setError("This document is no longer available or is set to private.");
        } else {
          setError("Document not found or an error occurred.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f9fafb" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #E5E7EB", borderTopColor: "#0D9488", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Loading Document...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !docData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f9fafb" }}>
        <div style={{ padding: "40px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", textAlign: "center", maxWidth: "400px" }}>
          <h1 style={{ margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", color: "#111827" }}>Access Denied</h1>
          <p style={{ margin: 0, fontFamily: "Inter, sans-serif", color: "#6B7280", lineHeight: 1.5 }}>
            {error || "Document not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F3F4F6", overflow: "hidden" }}>
      {/* Top branding bar */}
      <div style={{ height: "60px", background: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", background: "#0D9488", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: "16px", fontFamily: "Dancing Script, cursive" }}>D</span>
          </div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>DocMinty</span>
        </div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "#374151", fontSize: "15px" }}>
          {docData.title}
        </div>
      </div>

      {/* PDF View */}
      <div style={{ flex: 1, padding: "20px", overflow: "hidden" }}>
        <iframe
          src={`${docData.cloudinaryUrl}#toolbar=0`}
          style={{ width: "100%", height: "100%", border: "none", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          title={docData.title}
        />
      </div>
    </div>
  );
}
