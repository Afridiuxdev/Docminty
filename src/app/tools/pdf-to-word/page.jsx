"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
const T = "#0D9488";
export default function PDFToWordPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>PDF to Word</h1>
          <div style={{ display: "inline-block", background: "#FEF9C3", color: "#92400E", fontSize: "12px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", fontFamily: "Inter, sans-serif", marginBottom: "16px" }}>Coming Soon</div>
          <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: "0 0 24px" }}>Convert PDF documents to editable Microsoft Word files. This feature is currently in development.</p>
          <Link href="/tools" className="download-pdf-btn" style={{ margin: "0 auto" }}>? Back to PDF Tools</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
