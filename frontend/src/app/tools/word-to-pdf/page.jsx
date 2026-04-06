"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Download, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import mammoth from 'mammoth';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  body: { fontSize: 12, lineHeight: 1.5, color: "#111827" },
});

const WordToPdfDocument = ({ text }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.body}>{text}</Text>
      </View>
    </Page>
  </Document>
);

const T = "#0D9488";
export default function WordToPDFPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState(null);

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    setDone(false);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Use mammoth to extract basic raw text
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value; // The raw text

      const blob = await pdf(<WordToPdfDocument text={text} />).toBlob();
      setConvertedBlob(blob);
      setDone(true);
      toast.success("Successfully converted to PDF!");
    } catch (err) {
      console.error(err);
      toast.error("Error converting Word: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Word to PDF</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Convert .doc or .docx files to PDF format instantly.</p>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", border: `2px dashed ${file ? T : "#E5E7EB"}`, borderRadius: "12px", background: file ? "#F0FDFA" : "#FAFAFA", cursor: "pointer", marginBottom: "20px" }}>
            <input type="file" accept=".doc,.docx" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setDone(false); }} />
            {file ? (<><FileText size={40} color={T} style={{ marginBottom: "12px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: T, margin: "0 0 4px" }}>{file.name}</p><p style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>{(file.size / 1024).toFixed(1)} KB � Ready to convert</p></>) : (<><Upload size={40} color="#D1D5DB" style={{ marginBottom: "12px" }} /><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#374151", margin: "0 0 4px" }}>Click to upload Word file</p><p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>.doc or .docx files supported</p></>)}
          </label>
          {file && !done && <button onClick={process} disabled={processing} style={{ width: "100%", height: "48px", background: processing ? "#9CA3AF" : T, color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "Space Grotesk, sans-serif" }}>{processing ? "Converting..." : "Convert to PDF"}</button>}
          {done && (<div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "24px", textAlign: "center" }}><p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#065F46", margin: "0 0 12px" }}>🎉 Converted to PDF!</p><button className="download-pdf-btn" style={{ margin: "0 auto" }} onClick={() => { if(convertedBlob) saveAs(convertedBlob, file.name.replace(/\.docx?$/, '.pdf')); }}><Download size={15} /> Download PDF</button></div>)}
        </div>
      </main>

      <Footer />
    </>
  );
}
