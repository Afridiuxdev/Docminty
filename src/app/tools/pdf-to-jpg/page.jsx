"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Download, FileText } from "lucide-react";
const T = "#0D9488";
export default function PDFToJPGPage() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState("high");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const process = async () => { setProcessing(true); await new Promise(r => setTimeout(r, 2000)); setProcessing(false); setDone(true); };
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>PDF to JPG</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Convert each PDF page to a high-quality JPG image.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", border: `2px dashed ${file ? T : "#E5E7EB"}`, borderRadius: "12px", background: file ? "#F0FDFA" : "#FAFAFA", cursor: "pointer", marginBottom: "20px" }}>
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setDone(false); }} />
            {file ? (<><FileText size={40} color={T} style={{ marginBottom: "12px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: T, margin: "0 0 4px" }}>{file.name}</p></>) : (<><Upload size={40} color="#D1D5DB" style={{ marginBottom: "12px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#374151", margin: "0 0 4px" }}>Click to upload PDF</p></>)}
          </label>
          {file && (<div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <p className="form-label">Image Quality</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[{ v: "low", l: "72 DPI" }, { v: "medium", l: "150 DPI" }, { v: "high", l: "300 DPI" }].map(opt => (<button key={opt.v} onClick={() => setQuality(opt.v)} className={`toggle-btn ${quality === opt.v ? "active" : ""}`}>{opt.l}</button>))}
            </div>
          </div>)}
          {file && !done && <button onClick={process} disabled={processing} style={{ width: "100%", height: "48px", background: processing ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>{processing ? "Converting pages..." : "Convert to JPG"}</button>}
          {done && (<div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#065F46", margin: "0 0 12px" }}>PDF Converted to Images!</p><button className="download-pdf-btn" style={{ margin: "0 auto" }}><Download size={15} /> Download All JPGs (ZIP)</button></div>)}
        </div>
      </main>
      <Footer />
    </>
  );
}
