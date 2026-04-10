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
import { Download, Eye, RefreshCw, Shield, Cloud, PenTool, Zap } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import { INDIAN_STATES } from "@/constants/indianStates";
import { useProfileSync } from "@/hooks/useProfileSync";

const T = "#0D9488";

const CERT_TYPES = [
  "Completion Certificate",
  "Achievement Certificate",
  "Participation Certificate",
  "Excellence Certificate",
  "Appreciation Certificate",
  "Training Certificate",
];

export const DEFAULT_FORM = {
  certType: "Completion Certificate",
  orgName: "",
  recipientName: "",
  course: "",
  duration: "",
  grade: "",
  issueDate: "",
  signatoryName: "",
  signatoryDesignation: "",
  signature: null,
  description: "",
  logo: null,
  verificationId: "",
  enableQR: true,
  templateColor: "#0D9488",
  qrCodeDataUrl: null,
};

export function CertificatePreview({ form, template = "Classic", accent = "#0D9488" }) {
  const certContent = (
    <>
      {form.logo && <img src={form.logo} alt="Logo" style={{ height: "44px", objectFit: "contain", marginBottom: "8px" }} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{form.orgName || "Organisation Name"}</p>
      </div>
      <div style={{ background: accent, color: "#fff", padding: "6px 28px", borderRadius: "2px", fontFamily: "Space Grotesk, sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
        {form.certType}
      </div>
      <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 8px" }}>This is to certify that</p>
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "28px", color: "#111827", margin: "0 0 12px", borderBottom: `2px solid ${accent}`, paddingBottom: "8px", minWidth: "200px" }}>
        {form.recipientName || "Recipient Name"}
      </p>
      <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 4px", lineHeight: 1.6, maxWidth: "400px" }}>
        {form.description || "has successfully completed the course in"}
      </p>
      {form.course && <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: accent, margin: "0 0 4px" }}>{form.course}</p>}
      <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "12px" }}>
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
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif", width: "100%", aspectRatio: "3508 / 2480", display: "flex", padding: "16px" }}>
        <div style={{ flex: 1, padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #F3F4F6", borderRadius: "4px" }}>
          <div style={{ width: "30px", height: "3px", background: accent, marginBottom: "16px", borderRadius: "2px" }} />
          {certContent}
          <div style={{ width: "30px", height: "3px", background: accent, marginTop: "16px", borderRadius: "2px" }} />
        </div>
      </div>
    );
  }

  if (template === "Modern") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif", width: "100%", aspectRatio: "3508 / 2480", display: "flex", padding: "12px" }}>
        <div style={{ flex: 1, border: "1px solid #E5E7EB", position: "relative", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* Corner Accents */}
          <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "30px", height: "30px", borderTop: `4px solid ${accent}`, borderLeft: `4px solid ${accent}` }} />
          <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "30px", height: "30px", borderBottom: `4px solid ${accent}`, borderRight: `4px solid ${accent}` }} />
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            {form.logo ? <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "8px" }} /> : <div style={{ height: "40px" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "12px", color: "#111827", margin: 0, textTransform: "uppercase", letterSpacing: "0.15em" }}>{form.orgName || "Organisation Name"}</p>
          </div>

          <div style={{ borderBottom: `1px solid ${accent}`, paddingBottom: "4px", marginBottom: "20px" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "22px", color: accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.3em" }}>{form.certType}</p>
          </div>
          
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "32px", color: "#111827", margin: "0 0 16px" }}>{form.recipientName || "Recipient Name"}</p>
          
          <div style={{ textAlign: "center", maxWidth: "400px", marginBottom: "20px" }}>
             <p style={{ fontSize: "11px", color: "#4B5563", lineHeight: 1.6, margin: 0 }}>{form.description || "has shown exceptional proficiency and successfully completed the professional development requirements in"}</p>
             {form.course && <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: accent, marginTop: "4px", margin: "4px 0 0" }}>{form.course}</p>}
          </div>

          <div style={{ borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6", padding: "8px 0", width: "100%", display: "flex", justifyContent: "center", gap: "40px", marginBottom: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "8px", color: "#9CA3AF", textTransform: "uppercase", margin: "0 0 2px" }}>Duration</p>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.duration || "N/A"}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "8px", color: "#9CA3AF", textTransform: "uppercase", margin: "0 0 2px" }}>Issue Date</p>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.issueDate}</p>
            </div>
            {form.grade && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "8px", color: "#9CA3AF", textTransform: "uppercase", margin: "0 0 2px" }}>Grade</p>
                <p style={{ fontSize: "10px", fontWeight: 700, color: accent, margin: 0 }}>{form.grade}</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
            <div style={{ textAlign: "center", minWidth: "120px" }}>
              {form.signature ? <img src={form.signature} alt="Signature" style={{ maxHeight: "30px", maxWidth: "100px", marginBottom: "4px" }} /> : <div style={{ height: "30px" }} />}
              <div style={{ borderTop: "1.5px solid #111827", paddingTop: "4px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.signatoryName || "Authorized Signatory"}</p>
                <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "2px 0 0" }}>{form.signatoryDesignation || "Designation"}</p>
              </div>
            </div>
            {form.enableQR && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", border: "1px solid #F3F4F6", borderRadius: "4px", padding: "2px" }}>
                  {form.qrCodeDataUrl && <img src={form.qrCodeDataUrl} alt="QR" style={{ width: "100%", height: "100%" }} />}
                </div>
                <p style={{ fontSize: "7px", color: "#D1D5DB", marginTop: "4px", margin: "4px 0 0" }}>{form.verificationId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (template === "Corporate") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif", width: "100%", aspectRatio: "3508 / 2480", display: "flex", padding: "12px" }}>
        <div style={{ flex: 1, border: `3px solid ${accent}`, padding: "4px", display: "flex" }}>
          <div style={{ flex: 1, border: "1px solid #D1D5DB", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              {form.logo ? <img src={form.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", marginBottom: "4px" }} /> : <div style={{ height: "36px" }} />}
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "12px", color: "#111827", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{form.orgName || "Organisation Name"}</p>
            </div>

            <div style={{ backgroundColor: accent, color: "#fff", padding: "6px 40px", marginBottom: "12px" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "18px", margin: 0, textTransform: "uppercase", letterSpacing: "0.2em" }}>{form.certType}</p>
            </div>
            
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 8px" }}>This high honor is presented to</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "28px", color: "#111827", margin: "0 0 12px" }}>{form.recipientName || "Recipient Name"}</p>
            
            <div style={{ width: "50px", height: "2px", backgroundColor: accent, marginBottom: "12px" }} />
            
            <p style={{ fontSize: "12px", color: "#374151", textAlign: "center", lineHeight: 1.5, maxWidth: "450px", margin: "0 0 4px" }}>{form.description || "for the successful completion of all required components and demonstrating superior excellence in"}</p>
            {form.course && <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: accent, margin: "0 0 16px" }}>{form.course}</p>}

            <div style={{ marginTop: "auto", width: "100%" }}>
              {/* Metadata Bar moved ABOVE signatures */}
              <div style={{ display: "flex", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", padding: "8px 0", justifyContent: "center", gap: "40px", marginBottom: "16px" }}>
                <div style={{ textAlign: "center" }}><p style={{ fontSize: "8px", color: "#9CA3AF", textTransform: "uppercase", margin: 0 }}>Issue Date</p><p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.issueDate}</p></div>
                <div style={{ textAlign: "center" }}><p style={{ fontSize: "8px", color: "#9CA3AF", textTransform: "uppercase", margin: 0 }}>Duration</p><p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.duration || "N/A"}</p></div>
                {form.grade && <div style={{ textAlign: "center" }}><p style={{ fontSize: "8px", color: "#9CA3AF", textTransform: "uppercase", margin: 0 }}>Rating</p><p style={{ fontSize: "10px", fontWeight: 700, color: accent, margin: 0 }}>{form.grade}</p></div>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ maxWidth: "160px" }}>
                    {form.signature ? <img src={form.signature} alt="Signature" style={{ maxHeight: "36px", maxWidth: "110px", marginBottom: "2px" }} /> : <div style={{ height: "36px" }} />}
                    <div style={{ borderTop: "1.5px solid #111827", paddingTop: "4px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.signatoryName || "Authorized Official"}</p>
                      <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "1px 0 0" }}>{form.signatoryDesignation || "Designation"}</p>
                    </div>
                  </div>
                </div>

                {form.enableQR && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "52px", height: "52px", border: `1.5px solid ${accent}`, borderRadius: "4px", padding: "3px", position: "relative", backgroundColor: "#fff" }}>
                      <div style={{ position: "absolute", top: -5, left: -5, padding: "1px 4px", background: accent, color: "#fff", fontSize: "6px", fontWeight: 700, borderRadius: "1px" }}>SEAL</div>
                      {form.qrCodeDataUrl && <img src={form.qrCodeDataUrl} alt="QR" style={{ width: "100%", height: "100%" }} />}
                    </div>
                    <p style={{ fontSize: "7px", fontWeight: 700, color: accent, marginTop: "4px", textTransform: "uppercase" }}>Verify Digitally</p>
                  </div>
                )}
              </div>
            </div>
            
            {form.enableQR && <p style={{ position: "absolute", bottom: 4, right: 12, fontSize: "7px", color: "#D1D5DB", fontFamily: "monospace" }}>ID: {form.verificationId?.slice(0, 12)}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (template === "Royal") {
    return (
      <div style={{ background: "#fff", border: `3px solid ${accent}`, borderRadius: "4px", overflow: "hidden", fontFamily: "Inter, sans-serif", padding: "6px", width: "100%", aspectRatio: "3508 / 2480", display: "flex" }}>
        <div style={{ flex: 1, border: `1px solid ${accent}`, borderRadius: "2px", padding: "32px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif", display: "flex", width: "100%", aspectRatio: "3508 / 2480" }}>
        <div style={{ width: "10px", background: accent, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "20px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "0.85em" }}>
          {certContent}
        </div>
        <div style={{ width: "10px", background: accent, flexShrink: 0 }} />
      </div>
    );
  }

  // Classic (default)
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden", fontFamily: "Inter, sans-serif", width: "100%", aspectRatio: "3508 / 2480", display: "flex" }}>
      <div style={{ flex: 1, border: "8px solid #F0F4F3", outline: `2px solid ${accent}`, outlineOffset: "-12px", margin: "8px", borderRadius: "6px", padding: "32px 40px", background: "#fff", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
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

  const plan = user?.plan?.toUpperCase() || "FREE";
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE";

  // Auto-sync profile for Pro/Enterprise
  useProfileSync(form, (updater) => {
    setForm(prev => {
        const u = typeof updater === 'function' ? updater(prev) : updater;
        return {
            ...prev,
            orgName: u.fromName || prev.orgName,
            orgAddress: u.fromAddress || prev.orgAddress,
            orgCity: u.fromCity || prev.orgCity,
            orgState: u.fromState || prev.orgState,
            orgWebsite: u.website || prev.orgWebsite,
            logo: u.logo || prev.logo,
            signature: u.signature || prev.signature,
        };
    });
  }, plan);
  const templateMeta = TEMPLATE_REGISTRY.certificate[template] || TEMPLATE_REGISTRY.certificate.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;

  const handleDownload = () => {
    download("certificate", template, form, `Certificate-${form.recipientName||"Certificate"}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    if (!isUserPro) {
      toast.error("Cloud saving is a PRO feature. Please upgrade!");
      router.push("/dashboard/billing");
      return;
    }
    try {
      await documentsApi.save({ 
        docType: "certificate", 
        title: `Certificate - ${form.recipientName || "Recipient"}`, 
        referenceNumber: form.verificationId, 
        templateName: template,
        partyName: form.recipientName, 
        amount: "", 
        formData: JSON.stringify(form) 
      });
      toast.success("Saved to your dashboard!");
    } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  useEffect(() => {
    if (!form.verificationId || !form.issueDate) {
      setForm(prev => ({
        ...prev,
        verificationId: prev.verificationId || generateVerificationId(),
        issueDate: prev.issueDate || new Date().toISOString().split("T")[0]
      }));
    }
  }, []);

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
            {user && isUserPro && (
              <div style={{ position: "relative" }}>
                <button onClick={handleSave} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  height: "36px", padding: "0 14px",
                  border: `1px solid ${T}`, borderRadius: "8px",
                  background: "#fff", fontSize: "13px", fontWeight: 600,
                  color: T, cursor: "pointer",
                  fontFamily: "Inter, sans-serif", transition: "all 150ms",
                }}>
                  <Cloud size={14} /> Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div className="tab-bar" style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "org" && (
              <div>
                <p className="form-label">Organisation Details</p>

                {!isUserPro && (
                  <div style={{ padding: "10px 14px", background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <Zap size={14} color={T} />
                    <p style={{ fontSize: "11px", color: T, fontWeight: 600, margin: 0, fontFamily: "Inter, sans-serif" }}>
                      Tip: Upgrade to <strong style={{ color: "#0D9488" }}>Business Pro</strong> to auto-fill your profile details.
                    </p>
                  </div>
                )}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Organisation Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field"><label className="field-label">Organisation Name *</label><input className="doc-input" placeholder="Reddy Academy" value={form.orgName} onChange={e => updateField("orgName", e.target.value)} /></div>
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

            {TABS[TABS.length - 1].id !== activeTab && (
              <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.id === activeTab) + 1].id)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 20px", background: "#0D9488", color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", border: "none", borderRadius: "8px", cursor: "pointer" }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="preview-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Eye size={14} color="#9CA3AF" />
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
            </div>
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <CertificatePreview form={form} template={template} accent={form.templateColor || templateMeta.accent} />
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
