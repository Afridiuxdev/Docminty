"use client";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import SignatureModal from "@/components/SignatureModal";
import { Download, Eye, RefreshCw, Cloud, PenTool } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";

const T = "#0D9488";

const DEFAULT_FORM = {
  companyName: "", companyAddress: "", companyCity: "",
  companyPhone: "", companyEmail: "", companyWebsite: "",
  logo: null,
  employeeName: "", employeeId: "", designation: "", department: "",
  dateOfJoining: "", dateOfLeaving: "",
  letterDate: new Date().toISOString().split("T")[0],
  letterNumber: `EXP-${new Date().getFullYear()}-001`,
  performance: "excellent",
  additionalNote: "",
  signatoryName: "", signatoryDesignation: "",  signatoryDept: "",
  signature: null,
  templateColor: "#0D9488",
};

function ExperiencePreview({ form, template = "Classic", accent = "#0D9488" }) {
  const joining = form.dateOfJoining
    ? new Date(form.dateOfJoining).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "DD Month YYYY";
  const leaving = form.dateOfLeaving
    ? new Date(form.dateOfLeaving).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "DD Month YYYY";

  const performanceText = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
  }[form.performance] || "";

  const letterBody = (
    <div className="pdf-body">
      {template !== "Classic" && (form.companyAddress || form.companyPhone || form.companyEmail || form.companyWebsite) && (
        <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #F3F4F6" }}>
          {form.companyAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 1px", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</p>}
          {(form.companyPhone || form.companyEmail) && <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 1px", fontFamily: "Inter, sans-serif" }}>{[form.companyPhone && `Ph: ${form.companyPhone}`, form.companyEmail].filter(Boolean).join(" | ")}</p>}
          {form.companyWebsite && <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>{form.companyWebsite}</p>}
        </div>
      )}
      <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", margin: "0 0 16px" }}>To Whomsoever It May Concern,</p>
      <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 12px" }}>
        This is to certify that{" "}
        <strong style={{ color: "#111827" }}>{form.employeeName || "[Employee Name]"}</strong>
        {form.employeeId ? ` (Employee ID: ${form.employeeId})` : ""}
        {" "}was employed with{" "}
        <strong style={{ color: "#111827" }}>{form.companyName || "[Company Name]"}</strong>
        {form.designation ? ` as ${form.designation}` : ""}
        {form.department ? ` in the ${form.department} department` : ""}
        {" "}from{" "}
        <strong style={{ color: accent }}>{joining}</strong>
        {" "}to{" "}
        <strong style={{ color: accent }}>{leaving}</strong>.
      </p>
      <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 12px" }}>{performanceText}</p>
      {form.additionalNote && (
        <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 12px" }}>{form.additionalNote}</p>
      )}
      <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 24px" }}>
        We wish {form.employeeName || "them"} all the best in their future endeavours.
      </p>
      <div style={{ marginTop: "32px" }}>
        <div style={{ paddingTop: "6px", display: "inline-block", minWidth: "140px" }}>
          {form.signature ? (
            <div style={{ marginBottom: "4px" }}>
              <img src={form.signature} alt="Signature" style={{ maxHeight: "45px", maxWidth: "140px", display: "block" }} />
            </div>
          ) : (
            <div style={{ height: "40px" }} />
          )}
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{form.signatoryName || "Authorised Signatory"}</p>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.signatoryDesignation || "Designation"}</p>
            {form.signatoryDept && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.signatoryDept}</p>}
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyName}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" }}>
        <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
      </div>
    </div>
  );

  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", gap: 0, padding: 0, overflow: "hidden" }}>
        <div style={{ width: "140px", minWidth: "140px", background: accent, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />}
          <div>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "13px", color: "#fff", margin: 0, lineHeight: 1.3 }}>EXPERIENCE LETTER</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
          </div>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>Date</p>
            <p style={{ fontSize: "11px", color: "#fff", margin: 0, fontFamily: "Inter, sans-serif" }}>{form.letterDate}</p>
          </div>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>Company</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "12px", color: "#fff", margin: 0 }}>{form.companyName || "Company Name"}</p>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>{letterBody}</div>
      </div>
    );
  }

  if (template === "Corporate") {
    return (
      <div className="pdf-preview">
        <div style={{ background: accent, padding: "24px", textAlign: "center" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", display: "block", margin: "0 auto 8px", filter: "brightness(0) invert(1)" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", margin: "0 0 2px" }}>{form.companyName || "Company Name"}</p>
          {form.companyAddress && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}</p>}
          <div style={{ marginTop: "12px", display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "4px 16px" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "16px", color: "#fff", margin: 0 }}>EXPERIENCE LETTER</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber} &nbsp;|&nbsp; {form.letterDate}</p>
          </div>
        </div>
        {letterBody}
      </div>
    );
  }

  if (template === "Elegant") {
    return (
      <div className="pdf-preview">
        <div style={{ borderBottom: `4px solid ${accent}`, padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {form.companyAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: accent, margin: 0 }}>EXPERIENCE LETTER</p>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.letterDate}</p>
          </div>
        </div>
        {letterBody}
      </div>
    );
  }

  if (template === "Classic") {
    return (
      <div className="pdf-preview">
        <div className="pdf-header" style={{ borderBottom: `2px solid ${accent}` }}>
          <div>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {form.companyAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</p>}
            {form.companyPhone && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone}{form.companyEmail ? ` | ${form.companyEmail}` : ""}</p>}
            {form.companyWebsite && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyWebsite}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: accent, margin: 0 }}>EXPERIENCE LETTER</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.letterDate}</p>
          </div>
        </div>
        {letterBody}
      </div>
    );
  }

  // Minimal (default)
  return (
    <div className="pdf-preview">
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {form.companyAddress && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "16px", color: "#111827", margin: 0 }}>EXPERIENCE LETTER</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.letterDate}</p>
          </div>
        </div>
        <div style={{ height: "2px", background: accent, marginTop: "12px", borderRadius: "1px" }} />
      </div>
      {letterBody}
    </div>
  );
}

export default function ExperienceLetterPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const [activeTab, setActiveTab] = useState("company");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const router = useRouter();

  const isUserPro = user?.plan === "Business Pro" || user?.plan === "Enterprise";
  const templateMeta = TEMPLATE_REGISTRY.experience[template] || TEMPLATE_REGISTRY.experience.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;

  const handleDownload = () => {
    if (showWatermark) {
      toast.error("This is a PRO template. Please upgrade to download without watermark!");
      router.push("/#pricing");
      return;
    }
    download("ExperienceLetter" + template, form, `ExperienceLetter-${form.employeeName||"Employee"}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "experience-letter", title: `Experience Letter - ${form.employeeName || "Employee"}`, referenceNumber: form.letterNumber, partyName: form.employeeName, amount: "", formData: JSON.stringify(form) });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "company", label: "Company" },
    { id: "employee", label: "Employee" },
    { id: "content", label: "Content" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Experience Letter Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Professional HR experience certificates</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}><RefreshCw size={13} /> Reset</button>
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
            <div className="tab-bar" style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "company" && (
              <div>
                <p className="form-label">Company Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Company Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field"><label className="field-label">Company Name *</label><input className="doc-input" placeholder="Your Company Pvt. Ltd." value={form.companyName} onChange={e => updateField("companyName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><input className="doc-input" placeholder="Full address" value={form.companyAddress} onChange={e => updateField("companyAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" value={form.companyPhone} onChange={e => updateField("companyPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" value={form.companyEmail} onChange={e => updateField("companyEmail", e.target.value)} /></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Letter Details</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Letter Number</label><input className="doc-input" value={form.letterNumber} onChange={e => updateField("letterNumber", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Date</label><input className="doc-input" type="date" value={form.letterDate} onChange={e => updateField("letterDate", e.target.value)} /></div>
                </div>
              </div>
            )}

            {activeTab === "employee" && (
              <div>
                <p className="form-label">Employee Details</p>
                <div className="form-field"><label className="field-label">Employee Name *</label><input className="doc-input" placeholder="Full Name" value={form.employeeName} onChange={e => updateField("employeeName", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Employee ID</label><input className="doc-input" placeholder="EMP001" value={form.employeeId} onChange={e => updateField("employeeId", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Designation</label><input className="doc-input" placeholder="Sr. Developer" value={form.designation} onChange={e => updateField("designation", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Department</label><input className="doc-input" placeholder="Engineering" value={form.department} onChange={e => updateField("department", e.target.value)} /></div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Date of Joining</label><input className="doc-input" type="date" value={form.dateOfJoining} onChange={e => updateField("dateOfJoining", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Last Working Day</label><input className="doc-input" type="date" value={form.dateOfLeaving} onChange={e => updateField("dateOfLeaving", e.target.value)} /></div>
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div>
                <p className="form-label">Letter Content</p>
                <div className="form-field"><label className="field-label">Performance</label><div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>{[{ v: "excellent", l: "Excellent — Outstanding performance" }, { v: "good", l: "Good — Reliable team member" }, { v: "satisfactory", l: "Satisfactory — Met expectations" }].map(opt => (<button key={opt.v} onClick={() => updateField("performance", opt.v)} className={`toggle-btn ${form.performance === opt.v ? "active" : ""}`} style={{ justifyContent: "flex-start" }}>{opt.l}</button>))}</div></div>
                <div className="form-field"><label className="field-label">Additional Note (optional)</label><textarea className="doc-textarea" style={{ minHeight: "80px" }} placeholder="Any additional information..." value={form.additionalNote} onChange={e => updateField("additionalNote", e.target.value)} /></div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} /><p className="form-label">Signatory</p><div className="form-field"><label className="field-label">Name</label><input className="doc-input" placeholder="HR Manager Name" value={form.signatoryName} onChange={e => updateField("signatoryName", e.target.value)} /></div><div className="form-field"><label className="field-label">Designation</label><input className="doc-input" placeholder="HR Manager" value={form.signatoryDesignation} onChange={e => updateField("signatoryDesignation", e.target.value)} /></div>
                
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Digital Signature</p>
                <div style={{
                  border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#fff"
                }}>
                  {form.signature ? (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <div style={{
                        padding: "16px", background: "#F9FAFB", borderRadius: "8px",
                        border: "1px dashed #D1D5DB", display: "inline-block", minWidth: "160px"
                      }}>
                        <img src={form.signature} alt="Signature" style={{ height: "50px", maxWidth: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                        <button onClick={() => setIsSigModalOpen(true)} style={{
                          padding: "6px 12px", borderRadius: "6px", border: "1px solid #D1D5DB",
                          background: "#fff", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer"
                        }}>Change</button>
                        <button onClick={() => updateField("signature", null)} style={{
                          padding: "6px 12px", borderRadius: "6px", border: "1px solid #FEE2E2",
                          background: "#FEF2F2", fontSize: "12px", fontWeight: 600, color: "#EF4444", cursor: "pointer"
                        }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsSigModalOpen(true)} style={{
                      width: "100%", padding: "30px 20px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "8px", background: "#F9FAFB", border: "1px dashed #D1D5DB",
                      borderRadius: "10px", cursor: "pointer", transition: "all 200ms"
                    }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <PenTool size={18} color="#9CA3AF" />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Add signature</span>
                    </button>
                  )}
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}><Download size={15} /> Download PDF</button>
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <div style={{ marginTop: "8px" }}>
                  <TemplatePicker 
                    docType="experience" 
                    selected={template} 
                    onChange={(t) => {
                      setTemplate(t);
                      const meta = TEMPLATE_REGISTRY.experience[t] || TEMPLATE_REGISTRY.experience.Classic;
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
                  <Download size={15} /> Download PDF
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
              <ExperiencePreview form={form} template={template} accent={form.templateColor || templateMeta.accent} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_EXP" />
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
