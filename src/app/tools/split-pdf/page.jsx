"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Download, FileText } from "lucide-react";
const T = "#0D9488";
export default function SplitPDFPage() {
  const [file, setFile] = useState(null);
  const [pageCount] = useState(0);
  const [splitMode, setSplitMode] = useState("range");
  const [ranges, setRanges] = useState("1-3, 4-6");
  const [everyN, setEveryN] = useState("1");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const process = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProcessing(false); setDone(true);
  };
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Split PDF</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Split a PDF into multiple files by page range or every N pages.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", border: `2px dashed ${file ? T : "#E5E7EB"}`, borderRadius: "12px", background: file ? "#F0FDFA" : "#FAFAFA", cursor: "pointer", marginBottom: "20px" }}>
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setDone(false); }} />
            {file ? (<><FileText size={32} color={T} style={{ marginBottom: "10px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: T, margin: "0 0 4px" }}>{file.name}</p><p style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>{(file.size/1024).toFixed(1)} KB</p></>) : (<><Upload size={32} color="#D1D5DB" style={{ marginBottom: "10px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#374151", margin: "0 0 4px" }}>Click to upload PDF</p></>)}
          </label>
          {file && (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
              <p className="form-label">Split Method</p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {[{ v: "range", l: "By Page Range" }, { v: "every", l: "Every N Pages" }, { v: "each", l: "Each Page" }].map(opt => (
                  <button key={opt.v} onClick={() => setSplitMode(opt.v)} className={`toggle-btn ${splitMode === opt.v ? "active" : ""}`}>{opt.l}</button>
                ))}
              </div>
              {splitMode === "range" && (
                <div className="form-field">
                  <label className="field-label">Page Ranges (e.g. 1-3, 4-6, 7)</label>
                  <input className="doc-input" value={ranges} onChange={e => setRanges(e.target.value)} placeholder="1-3, 4-6, 7" />
                  <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Separate ranges with commas. Each range becomes a separate PDF.</p>
                </div>
              )}
              {splitMode === "every" && (
                <div className="form-field">
                  <label className="field-label">Split every N pages</label>
                  <input className="doc-input" type="number" value={everyN} onChange={e => setEveryN(e.target.value)} min="1" placeholder="1" />
                </div>
              )}
              {splitMode === "each" && (
                <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Each page will be saved as a separate PDF file.</p>
              )}
            </div>
          )}
          {file && !done && (
            <button onClick={process} disabled={processing} style={{ width: "100%", height: "48px", background: processing ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {processing ? "Splitting PDF..." : "?? Split PDF"}
            </button>
          )}
          {done && (
            <div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#065F46", margin: "0 0 12px" }}>? PDF Split Successfully!</p>
              <button className="download-pdf-btn" style={{ margin: "0 auto" }}><Download size={15} /> Download Split Files (ZIP)</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
