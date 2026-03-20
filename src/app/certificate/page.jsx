"use client";
import TemplatePicker from "@/components/TemplatePicker";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { generateVerificationId, generateQRData } from "@/engine/hashGen";
import { Download, Eye, RefreshCw, Shield } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";

const T = "#0D9488";

const CERT_TYPES = [
  "Completion Certificate",
  "Achievement Certificate",
  "Participation Certificate",
  "Excellence Certificate",
  "Appreciation Certificate",
  "Training Certificate",
];

const DEFAULT_FORM = {
  certType: "Completion Certificate",
  orgName: "",
  orgAddress: "",
  orgWebsite: "",
  recipientName: "",
  course: "",
  duration: "",
  grade: "",
  issueDate: new Date().toISOString().split("T")[0],
  signatoryName: "",
  signatoryDesignation: "",
  description: "",
  logo: null,
  verificationId: generateVerificationId(),
  enableQR: true,
};

function CertPreview({ form }) {
  const qrData = generateQRData(form.verificationId);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Certificate border design */}
      <div style={{
        border: "8px solid #F0F4F3",
        outline: `2px solid ${T}`,
        outlineOffset: "-12px",
        margin: "8px",
        borderRadius: "6px",
        padding: "32px 40px",
        background: "linear-gradient(135deg, #F0FDFA 0%, #fff 50%, #F0FDFA 100%)",
        textAlign: "center",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        {/* Decorative corners */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
          <div key={pos} style={{
            position: "absolute",
            [pos.includes("top") ? "top" : "bottom"]: "16px",
            [pos.includes("left") ? "left" : "right"]: "16px",
            width: "24px", height: "24px",
            borderTop: pos.includes("top") ? `3px solid ${T}` : "none",
            borderBottom: pos.includes("bottom") ? `3px solid ${T}` : "none",
            borderLeft: pos.includes("left") ? `3px solid ${T}` : "none",
            borderRight: pos.includes("right") ? `3px solid ${T}` : "none",
          }} />
        ))}

        {/* Logo */}
        {form.logo && (
          <img src={form.logo} alt="Logo"
            style={{ height: "52px", objectFit: "contain", marginBottom: "12px" }}
          />
        )}

        {/* Org name */}
        <p style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700, fontSize: "18px",
          color: "#111827", margin: "0 0 4px",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          {form.orgName || "Organisation Name"}
        </p>

        {form.orgAddress && (
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 20px" }}>
            {form.orgAddress}
          </p>
        )}

        {/* Certificate type */}
        <div style={{
          background: T, color: "#fff",
          padding: "6px 28px", borderRadius: "2px",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "13px", fontWeight: 700,
          letterSpacing: "0.15em", textTransform: "uppercase",
          marginBottom: "20px",
        }}>
          {form.certType}
        </div>

        {/* This is to certify */}
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 8px" }}>
          This is to certify that
        </p>

        {/* Recipient name */}
        <p style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800, fontSize: "28px",
          color: "#111827", margin: "0 0 12px",
          borderBottom: `2px solid ${T}`,
          paddingBottom: "8px", minWidth: "200px",
        }}>
          {form.recipientName || "Recipient Name"}
        </p>

        {/* Description */}
        <p style={{
          fontSize: "13px", color: "#374151",
          margin: "0 0 8px", lineHeight: 1.6,
          maxWidth: "400px",
        }}>
          {form.description ||
            `has successfully completed the course in`}
        </p>

        {/* Course */}
        {form.course && (
          <p style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700, fontSize: "16px",
            color: T, margin: "0 0 8px",
          }}>
            {form.course}
          </p>
        )}

        {/* Duration & Grade */}
        <div style={{
          display: "flex", gap: "24px",
          justifyContent: "center", marginBottom: "20px",
        }}>
          {form.duration && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Duration</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.duration}</p>
            </div>
          )}
          {form.grade && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Grade</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: T, margin: 0 }}>{form.grade}</p>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.issueDate}</p>
          </div>
        </div>

        {/* Signature */}
        <div style={{
          display: "flex", gap: "48px",
          justifyContent: "center", alignItems: "flex-end",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              borderTop: `2px solid #374151`,
              paddingTop: "6px", minWidth: "120px",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0 }}>
                {form.signatoryName || "Signatory Name"}
              </p>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "2px 0 0" }}>
                {form.signatoryDesignation || "Designation"}
              </p>
            </div>
          </div>

          {/* QR Code placeholder */}
          {form.enableQR && (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "56px", height: "56px",
                border: `2px solid ${T}`,
                borderRadius: "4px",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                background: "#F0FDFA",
                fontSize: "8px", color: T,
                fontWeight: 600, flexDirection: "column",
                gap: "2px",
              }}>
                <Shield size={16} color={T} />
                <span>QR</span>
              </div>
              <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "4px 0 0" }}>Scan to Verify</p>
            </div>
          )}
        </div>

        {/* Verification ID */}
        {form.enableQR && (
          <p style={{
            fontSize: "9px", color: "#D1D5DB",
            margin: "12px 0 0", letterSpacing: "0.05em",
            fontFamily: "monospace",
          }}>
            Verification ID: {form.verificationId}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CertificatePage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const [activeTab, setActiveTab] = useState("org");
  const handleDownload = () => {
    download("Certificate" + template, form, `Certificate-${form.recipientName||"Certificate"}.pdf`);
  };
  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "org", label: "Organisation" },
    { id: "recipient", label: "Recipient" },
    { id: "content", label: "Content" },
    { id: "verify", label: "Verification" },
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Certificate Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>QR verified · Bulk export · Professional design</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setForm({ ...DEFAULT_FORM, verificationId: generateVerificationId() })}
              style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              <RefreshCw size={13} /> Reset
            </button>
            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">
              <Download size={15} />
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "org" && (
              <div>
                <p className="form-label">Organisation Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Organisation Logo</p>
                  <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                <div style={{ marginTop: "16px" }}><TemplatePicker docType="certificate" selected={template} onChange={setTemplate} isPro={false} /></div>
</div>
                <div className="form-field"><label className="field-label">Organisation Name *</label><input className="doc-input" placeholder="Reddy Academy" value={form.orgName} onChange={e => updateField("orgName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><input className="doc-input" placeholder="City, State" value={form.orgAddress} onChange={e => updateField("orgAddress", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Website</label><input className="doc-input" placeholder="www.yourorg.com" value={form.orgWebsite} onChange={e => updateField("orgWebsite", e.target.value)} /></div>
                <div className="form-field">
                  <label className="field-label">Certificate Type</label>
                  <select className="doc-select" value={form.certType} onChange={e => updateField("certType", e.target.value)}>
                    {CERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {activeTab === "recipient" && (
              <div>
                <p className="form-label">Recipient Details</p>
                <div className="form-field"><label className="field-label">Recipient Name *</label><input className="doc-input" placeholder="Full Name" value={form.recipientName} onChange={e => updateField("recipientName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Course / Achievement *</label><input className="doc-input" placeholder="Full Stack Development" value={form.course} onChange={e => updateField("course", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Duration</label><input className="doc-input" placeholder="6 Months" value={form.duration} onChange={e => updateField("duration", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Grade</label><input className="doc-input" placeholder="A+" value={form.grade} onChange={e => updateField("grade", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Issue Date</label><input className="doc-input" type="date" value={form.issueDate} onChange={e => updateField("issueDate", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "content" && (
              <div>
                <p className="form-label">Certificate Content</p>
                <div className="form-field">
                  <label className="field-label">Description Text</label>
                  <textarea className="doc-textarea" style={{ minHeight: "80px" }}
                    placeholder="has successfully completed the course in"
                    value={form.description}
                    onChange={e => updateField("description", e.target.value)}
                  />
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Signatory</p>
                <div className="form-field"><label className="field-label">Name</label><input className="doc-input" placeholder="Dr. Ravi Kumar" value={form.signatoryName} onChange={e => updateField("signatoryName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Designation</label><input className="doc-input" placeholder="Director" value={form.signatoryDesignation} onChange={e => updateField("signatoryDesignation", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "verify" && (
              <div>
                <p className="form-label">Verification System</p>
                <div style={{
                  background: "#F0FDFA", border: `1px solid ${T}`,
                  borderRadius: "10px", padding: "16px", marginBottom: "16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Shield size={16} color={T} />
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>QR Verification Enabled</p>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
                    Each certificate gets a unique QR code. Employers can scan it to verify authenticity at docminty.com/verify
                  </p>
                </div>
                <div className="form-field">
                  <label className="field-label">Verification ID</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input className="doc-input" value={form.verificationId} readOnly
                      style={{ fontFamily: "monospace", background: "#F8F9FA", flex: 1 }}
                    />
                    <button
                      onClick={() => updateField("verificationId", generateVerificationId())}
                      style={{ height: "36px", padding: "0 12px", border: "1px solid #E5E7EB", borderRadius: "6px", background: "#fff", cursor: "pointer", fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
                      Regenerate
                    </button>
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">Enable QR Code</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[{ v: true, l: "Yes — Show QR" }, { v: false, l: "No — Hide QR" }].map(opt => (
                      <button key={String(opt.v)} onClick={() => updateField("enableQR", opt.v)}
                        className={`toggle-btn ${form.enableQR === opt.v ? "active" : ""}`}>
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">
                  <Download size={15} />
                  {downloading ? "Generating..." : "Download PDF"}
                </button>
              </div>
            )}
          </div>

          <div className="preview-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={14} color="#9CA3AF" />
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
              </div>
              <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">
                <Download size={15} />
                {downloading ? "Generating..." : "Download PDF"}
              </button>
            </div>
            <CertPreview form={form} />
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_CERT" />
        </div>
      </div>
      <Footer />
    </>
  );
}
