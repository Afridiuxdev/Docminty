"use client";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import QRCode from "qrcode";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { generateVerificationId, generateQRData } from "@/engine/hashGen";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import SignatureModal from "@/components/SignatureModal";
import { Download, Eye, RefreshCw, Shield, Cloud, PenTool } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";

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
  signature: null,
  description: "",
  logo: null,
  verificationId: generateVerificationId(),
  enableQR: true,
  templateColor: "#0D9488",
  qrCodeDataUrl: null,
};

function CertPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const certContent = (
    <>
      {form.logo && <img src={form.logo} alt="Logo" style={{ height: "52px", objectFit: "contain", marginBottom: "12px" }} />}
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", color: "#111827", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {form.orgName || "Organisation Name"}
      </p>
      {form.orgAddress && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 20px" }}>{form.orgAddress}</p>}
      <div style={{ background: accent, color: "#fff", padding: "6px 28px", borderRadius: "2px", fontFamily: "Space Grotesk, sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
        {form.certType}
      </div>
      <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 8px" }}>This is to certify that</p>
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "28px", color: "#111827", margin: "0 0 12px", borderBottom: `2px solid ${accent}`, paddingBottom: "8px", minWidth: "200px" }}>
        {form.recipientName || "Recipient Name"}
      </p>
      <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 8px", lineHeight: 1.6, maxWidth: "400px" }}>
        {form.description || "has successfully completed the course in"}
      </p>
      {form.course && <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: accent, margin: "0 0 8px" }}>{form.course}</p>}
      <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "20px" }}>
        {form.duration && <div style={{ textAlign: "center" }}><p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Duration</p><p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.duration}</p></div>}
        {form.grade && <div style={{ textAlign: "center" }}><p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Grade</p><p style={{ fontSize: "13px", fontWeight: 600, color: accent, margin: 0 }}>{form.grade}</p></div>}
        <div style={{ textAlign: "center" }}><p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</p><p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.issueDate}</p></div>
      </div>
      <div style={{ display: "flex", gap: "48px", justifyContent: "center", alignItems: "flex-end" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ minWidth: "120px" }}>
            {form.signature ? (
              <div style={{ marginBottom: "4px" }}>
                <img src={form.signature} alt="Signature" style={{ maxHeight: "40px", maxWidth: "120px", display: "block", margin: "0 auto" }} />
              </div>
            ) : (
              <div style={{ height: "30px" }} />
            )}
            <div style={{ borderTop: "2px solid #374151", paddingTop: "6px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.signatoryName || "Signatory Name"}</p>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "2px 0 0" }}>{form.signatoryDesignation || "Designation"}</p>
            </div>
          </div>
        </div>
        {form.enableQR && (
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              width: "56px", height: "56px", border: `2px solid ${accent}`, borderRadius: "4px", 
              display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FA", 
              fontSize: "8px", color: accent, fontWeight: 600, overflow: "hidden" 
            }}>
              {form.qrCodeDataUrl ? (
                <img src={form.qrCodeDataUrl} alt="Verification QR" style={{ width: "100%", height: "100%", padding: "2px" }} />
              ) : (
                <Shield size={16} color={accent} />
              )}
            </div>
            <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "4px 0 0" }}>Scan to Verify</p>
          </div>
        )}
      </div>
      {form.enableQR && <p style={{ fontSize: "9px", color: "#D1D5DB", margin: "12px 0 0", letterSpacing: "0.05em", fontFamily: "monospace" }}>Verification ID: {form.verificationId}</p>}
    </>
  );

  if (template === "Minimal") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "400px", justifyContent: "center" }}>
          <div style={{ width: "40px", height: "3px", background: accent, marginBottom: "24px", borderRadius: "2px" }} />
          {certContent}
          <div style={{ width: "40px", height: "3px", background: accent, marginTop: "24px", borderRadius: "2px" }} />
        </div>
      </div>
    );
  }

  if (template === "Modern") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: accent, padding: "20px 40px", textAlign: "center" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" }}>Certificate</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.certType}</p>
        </div>
        <div style={{ padding: "32px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "44px", objectFit: "contain", marginBottom: "12px" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{form.orgName || "Organisation Name"}</p>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 8px" }}>This is to certify that</p>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "26px", color: "#111827", margin: "0 0 12px", borderBottom: `2px solid ${accent}`, paddingBottom: "8px", minWidth: "200px" }}>{form.recipientName || "Recipient Name"}</p>
          <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 8px", lineHeight: 1.6 }}>{form.description || "has successfully completed the course in"}</p>
          {form.course && <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: accent, margin: "0 0 16px" }}>{form.course}</p>}
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "20px" }}>
            {form.duration && <div style={{ textAlign: "center" }}><p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase" }}>Duration</p><p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.duration}</p></div>}
            {form.grade && <div style={{ textAlign: "center" }}><p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase" }}>Grade</p><p style={{ fontSize: "13px", fontWeight: 600, color: accent, margin: 0 }}>{form.grade}</p></div>}
            <div style={{ textAlign: "center" }}><p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase" }}>Date</p><p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.issueDate}</p></div>
          </div>
          <div style={{ borderTop: "2px solid #374151", paddingTop: "6px", minWidth: "140px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0 }}>{form.signatoryName || "Signatory Name"}</p>
            <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "2px 0 0" }}>{form.signatoryDesignation || "Designation"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (template === "Royal") {
    return (
      <div style={{ background: "#fff", border: `3px solid ${accent}`, borderRadius: "4px", overflow: "hidden", fontFamily: "Inter, sans-serif", padding: "6px" }}>
        <div style={{ border: `1px solid ${accent}`, borderRadius: "2px", padding: "32px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "400px", justifyContent: "center", position: "relative" }}>
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div key={pos} style={{ position: "absolute", [pos.includes("top") ? "top" : "bottom"]: "12px", [pos.includes("left") ? "left" : "right"]: "12px", width: "20px", height: "20px", borderTop: pos.includes("top") ? `2px solid ${accent}` : "none", borderBottom: pos.includes("bottom") ? `2px solid ${accent}` : "none", borderLeft: pos.includes("left") ? `2px solid ${accent}` : "none", borderRight: pos.includes("right") ? `2px solid ${accent}` : "none" }} />
          ))}
          {certContent}
        </div>
      </div>
    );
  }

  if (template === "Elegant") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif", display: "flex" }}>
        <div style={{ width: "12px", background: accent, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "32px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "400px", justifyContent: "center" }}>
          {certContent}
        </div>
        <div style={{ width: "12px", background: accent, flexShrink: 0 }} />
      </div>
    );
  }

  // Classic (default)
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
      <div style={{ border: "8px solid #F0F4F3", outline: `2px solid ${accent}`, outlineOffset: "-12px", margin: "8px", borderRadius: "6px", padding: "32px 40px", background: "linear-gradient(135deg, #F8FFFE 0%, #fff 50%, #F8FFFE 100%)", textAlign: "center", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
          <div key={pos} style={{ position: "absolute", [pos.includes("top") ? "top" : "bottom"]: "16px", [pos.includes("left") ? "left" : "right"]: "16px", width: "24px", height: "24px", borderTop: pos.includes("top") ? `3px solid ${accent}` : "none", borderBottom: pos.includes("bottom") ? `3px solid ${accent}` : "none", borderLeft: pos.includes("left") ? `3px solid ${accent}` : "none", borderRight: pos.includes("right") ? `3px solid ${accent}` : "none" }} />
        ))}
        {certContent}
      </div>
    </div>
  );
}

export default function CertificatePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const [activeTab, setActiveTab] = useState("org");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const router = useRouter();

  const isUserPro = user?.plan === "Business Pro" || user?.plan === "Enterprise";
  const templateMeta = TEMPLATE_REGISTRY.certificate[template] || TEMPLATE_REGISTRY.certificate.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;

  const handleDownload = () => {
    if (showWatermark) {
      toast.error("This is a PRO template. Please upgrade to download without watermark!");
      router.push("/#pricing");
      return;
    }
    download("Certificate" + template, form, `Certificate-${form.recipientName||"Certificate"}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "certificate", title: `Certificate - ${form.recipientName || "Recipient"}`, referenceNumber: form.verificationId, partyName: form.recipientName, amount: "", formData: JSON.stringify(form) });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  useEffect(() => {
    if (form.enableQR && form.verificationId) {
      const qrUrl = generateQRData(form.verificationId);
      QRCode.toDataURL(qrUrl, { margin: 1, width: 200, color: { dark: form.templateColor || "#0D9488" } })
        .then(url => updateField("qrCodeDataUrl", url))
        .catch(err => console.error("QR Generation Error:", err));
    }
  }, [form.verificationId, form.enableQR, form.templateColor, updateField]);

  const TABS = [
    { id: "org", label: "Organisation" },
    { id: "recipient", label: "Recipient" },
    { id: "content", label: "Content" },
    { id: "verify", label: "Verification" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
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
            {user && (
              <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}>
                <Cloud size={14} /> Save
              </button>
            )}
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

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Digital Signature</p>
                <div style={{
                  border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fff"
                }}>
                  {form.signature ? (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <div style={{
                        padding: "12px", background: "#F9FAFB", borderRadius: "8px",
                        border: "1px dashed #D1D5DB", display: "inline-block", minWidth: "140px"
                      }}>
                        <img src={form.signature} alt="Signature" style={{ height: "45px", maxWidth: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "10px" }}>
                        <button onClick={() => setIsSigModalOpen(true)} style={{ fontSize: "12px", fontWeight: 600, color: T, background: "none", border: "none", cursor: "pointer" }}>Change</button>
                        <button onClick={() => updateField("signature", null)} style={{ fontSize: "12px", fontWeight: 600, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsSigModalOpen(true)} style={{
                      width: "100%", padding: "24px 16px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "8px", background: "#F9FAFB", border: "1px dashed #D1D5DB",
                      borderRadius: "10px", cursor: "pointer"
                    }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <PenTool size={16} color="#9CA3AF" />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Provide Signature</span>
                    </button>
                  )}
                </div>
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

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <div style={{ marginTop: "8px" }}>
                  <TemplatePicker 
                    docType="certificate" 
                    selected={template} 
                    onChange={(t) => {
                      setTemplate(t);
                      const meta = TEMPLATE_REGISTRY.certificate[t] || TEMPLATE_REGISTRY.certificate.Classic;
                      updateField("templateColor", meta.accent);
                    }} 
                    isPro={isUserPro} 
                  />
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />
                <p className="form-label">Template Color</p>
                <TemplateColorPicker 
                  value={form.templateColor || templateMeta.accent}
                  onChange={(color) => updateField("templateColor", color)}
                />
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "24px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}>
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
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <CertPreview form={form} template={template} accent={form.templateColor || templateMeta.accent} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_CERT" />
        </div>
      </div>
      <Footer />
      <SignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(sig) => updateField("signature", sig)}
      />
    </>
  );
}
