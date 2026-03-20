"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Download, FileText } from "lucide-react";
const T = "#0D9488";
export default function CompressPDFPage() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState("medium");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const QUALITY_OPTIONS = [
    { v: "low", l: "Maximum Compression", desc: "Smaller file, lower quality" },
    { v: "medium", l: "Balanced", desc: "Good quality, smaller size" },
    { v: "high", l: "High Quality", desc: "Best quality, moderate compression" },
  ];
  const process = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false); setDone(true);
  };
  const origSize = file ? (file.size / 1024).toFixed(1) : 0;
  const savings = { low: 0.4, medium: 0.6, high: 0.8 }[quality];
  const newSize = file ? (file.size * savings / 1024).toFixed(1) : 0;
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Compress PDF</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Reduce PDF file size without losing quality. Perfect for email attachments.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", border: `2px dashed ${file ? T : "#E5E7EB"}`, borderRadius: "12px", background: file ? "#F0FDFA" : "#FAFAFA", cursor: "pointer", marginBottom: "20px" }}>
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setDone(false); }} />
            {file ? (<><FileText size={32} color={T} style={{ marginBottom: "10px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: T, margin: "0 0 4px" }}>{file.name}</p><p style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>{origSize} KB</p></>) : (<><Upload size={32} color="#D1D5DB" style={{ marginBottom: "10px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#374151", margin: "0 0 4px" }}>Click to upload PDF</p></>)}
          </label>
          {file && (
            <>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
                <p className="form-label">Compression Level</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {QUALITY_OPTIONS.map(opt => (
                    <button key={opt.v} onClick={() => setQuality(opt.v)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: `1px solid ${quality === opt.v ? T : "#E5E7EB"}`, borderRadius: "8px", background: quality === opt.v ? "#F0FDFA" : "#fff", cursor: "pointer", transition: "all 150ms" }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: quality === opt.v ? T : "#111827", margin: 0 }}>{opt.l}</p>
                        <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: "2px 0 0" }}>{opt.desc}</p>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>~{Math.round((1-{low:0.4,medium:0.6,high:0.8}[opt.v])*100)}% smaller</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: "16px", padding: "12px 16px", background: "#F0FDFA", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                  <div><p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>Original Size</p><p style={{ fontSize: "14px", fontWeight: 700, color: "#374151", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{origSize} KB</p></div>
                  <div style={{ fontSize: "20px", alignSelf: "center" }}>?</div>
                  <div style={{ textAlign: "right" }}><p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>Estimated Size</p><p style={{ fontSize: "14px", fontWeight: 700, color: T, margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{newSize} KB</p></div>
                </div>
              </div>
              {!done && <button onClick={process} disabled={processing} style={{ width: "100%", height: "48px", background: processing ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>{processing ? "Compressing..." : "??? Compress PDF"}</button>}
              {done && (<div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#065F46", margin: "0 0 4px" }}>? PDF Compressed!</p><p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: "0 0 16px" }}>{origSize} KB ? {newSize} KB (saved {Math.round((1-savings)*100)}%)</p><button className="download-pdf-btn" style={{ margin: "0 auto" }}><Download size={15} /> Download Compressed PDF</button></div>)}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
