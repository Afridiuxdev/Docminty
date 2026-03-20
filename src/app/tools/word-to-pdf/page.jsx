"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Download, FileText } from "lucide-react";
const T = "#0D9488";
export default function WordToPDFPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const process = async () => { setProcessing(true); await new Promise(r => setTimeout(r, 1500)); setProcessing(false); setDone(true); };
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Word to PDF</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Convert .doc or .docx files to PDF format instantly.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", border: `2px dashed ${file ? T : "#E5E7EB"}`, borderRadius: "12px", background: file ? "#F0FDFA" : "#FAFAFA", cursor: "pointer", marginBottom: "20px" }}>
            <input type="file" accept=".doc,.docx" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setDone(false); }} />
            {file ? (<><FileText size={40} color={T} style={{ marginBottom: "12px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: T, margin: "0 0 4px" }}>{file.name}</p><p style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>{(file.size/1024).toFixed(1)} KB � Ready to convert</p></>) : (<><Upload size={40} color="#D1D5DB" style={{ marginBottom: "12px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#374151", margin: "0 0 4px" }}>Click to upload Word file</p><p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>.doc or .docx files supported</p></>)}
          </label>
          {file && !done && <button onClick={process} disabled={processing} style={{ width: "100%", height: "48px", background: processing ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>{processing ? "Converting..." : "?? Convert to PDF"}</button>}
          {done && (<div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#065F46", margin: "0 0 12px" }}>? Converted to PDF!</p><button className="download-pdf-btn" style={{ margin: "0 auto" }}><Download size={15} /> Download PDF</button></div>)}
        </div>
      </main>
      <Footer />
    </>
  );
}
