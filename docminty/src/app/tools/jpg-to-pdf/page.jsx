"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, X, Download } from "lucide-react";
const T = "#0D9488";
export default function JPGToPDFPage() {
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const handleImages = (files) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    setImages(prev => [...prev, ...imgs.map((f, i) => ({ id: Date.now() + i, file: f, name: f.name, url: URL.createObjectURL(f) }))]);
    setDone(false);
  };
  const remove = (id) => setImages(prev => prev.filter(f => f.id !== id));
  const process = async () => { setProcessing(true); await new Promise(r => setTimeout(r, 1500)); setProcessing(false); setDone(true); };
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>JPG to PDF</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Convert JPG, PNG or images into a single PDF document.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", border: `2px dashed ${T}`, borderRadius: "12px", background: "#F0FDFA", cursor: "pointer", marginBottom: "20px" }}>
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleImages(e.target.files)} />
            <Upload size={32} color={T} style={{ marginBottom: "10px" }} />
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: T, margin: "0 0 4px" }}>Click to upload images</p>
            <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>JPG, PNG, WEBP supported � Multiple files allowed</p>
          </label>
          {images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
              {images.map((img, i) => (
                <div key={img.id} style={{ position: "relative", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "4px", left: "4px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", fontFamily: "Inter, sans-serif" }}>{i + 1}</div>
                  <button onClick={() => remove(img.id)} style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", background: "#EF4444", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={10} color="#fff" /></button>
                </div>
              ))}
            </div>
          )}
          {images.length > 0 && !done && <button onClick={process} disabled={processing} style={{ width: "100%", height: "48px", background: processing ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>{processing ? "Creating PDF..." : `Convert ${images.length} Image${images.length > 1 ? "s" : ""} to PDF`}</button>}
          {done && (<div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#065F46", margin: "0 0 12px" }}>PDF Created!</p><button className="download-pdf-btn" style={{ margin: "0 auto" }}><Download size={15} /> Download PDF</button></div>)}
        </div>
      </main>
      <Footer />
    </>
  );
}
