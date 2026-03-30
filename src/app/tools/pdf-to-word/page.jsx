"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Download, FileText, File } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;


const T = "#0D9488";

export default function PDFToWordPage() {
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
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      let fullText = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const textItems = content.items.map(item => item.str);
        fullText.push(textItems.join(" "));
      }

      // Generate docx
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: fullText.map(para => new Paragraph({
              children: [new TextRun(para)],
            })),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      setConvertedBlob(blob);
      setDone(true);
      toast.success("Successfully converted to Word!");
    } catch (err) {
      console.error(err);
      toast.error("Error converting PDF: " + err.message);
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
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>PDF to Word</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Convert PDF files to editable .docx documents instantly.</p>
          </div>

          <label style={{ 
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
            padding: "48px 24px", border: `2px dashed ${file ? T : "#E5E7EB"}`, borderRadius: "12px", 
            background: file ? "#F0FDFA" : "#FAFAFA", cursor: "pointer", marginBottom: "20px",
            transition: "all 0.3s ease"
          }}>
            <input type="file" accept=".pdf" style={{ display: "none" }} 
              onChange={e => { setFile(e.target.files[0]); setDone(false); }} 
            />
            {file ? (
              <>
                <FileText size={48} color={T} style={{ marginBottom: "16px" }} />
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: T, margin: "0 0 4px" }}>{file.name}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to convert
                </p>
              </>
            ) : (
              <>
                <Upload size={48} color="#D1D5DB" style={{ marginBottom: "16px" }} />
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#374151", margin: "0 0 4px" }}>Click or drag to upload PDF</p>
                <p style={{ fontSize: "14px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Max file size: 20MB</p>
              </>
            )}
          </label>

          {file && !done && (
            <button 
              onClick={process} 
              disabled={processing} 
              style={{ 
                width: "100%", height: "52px", background: processing ? "#9CA3AF" : T, 
                color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", 
                fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", 
                fontFamily: "Space Grotesk, sans-serif", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "10px"
              }}
            >
              <File size={18} />
              {processing ? "Converting PDF..." : "Convert to Word"}
            </button>
          )}

          {done && (
            <div style={{ background: "#F0FDFA", border: `2px solid ${T}`, borderRadius: "12px", padding: "32px", textAlign: "center" }}>
              <div style={{ 
                width: "48px", height: "48px", background: T, borderRadius: "50%", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                margin: "0 auto 16px" 
              }}>
                <Download size={24} color="#fff" />
              </div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "20px", color: "#065F46", margin: "0 0 8px" }}>Conversion Complete!</h2>
              <p style={{ fontSize: "14px", color: "#059669", fontFamily: "Inter, sans-serif", marginBottom: "24px" }}>Your editable Word document is ready for download.</p>
              <button 
                className="download-pdf-btn" 
                style={{ margin: "0 auto", padding: "0 32px", height: "48px" }}
                onClick={() => {
                  if (convertedBlob) {
                    saveAs(convertedBlob, file.name.replace(".pdf", ".docx"));
                  }
                }}
              >
                <Download size={18} /> Download Word Document
              </button>
            </div>
          )}

          <div style={{ marginTop: "40px", borderTop: "1px solid #E5E7EB", paddingTop: "24px" }}>
             <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, color: "#374151", marginBottom: "12px" }}>Why convert PDF to Word?</h3>
             <p style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
               Our PDF to Word converter makes it easy to edit your PDF documents. By converting them to Microsoft Word format, you can easily change text, add images, and modify the layout while preserving the original formatting as much as possible.
             </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

