"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { useAuth } from "@/contexts/AuthContext";
import SignatureModal from "@/components/SignatureModal";
import TemplatePicker from "@/components/TemplatePicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { Download, Eye, RefreshCw, Cloud, PenTool } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";


const T = "#0D9488";

const DEFAULT_FORM = {
  companyName: "", companyAddress: "", companyPhone: "", companyEmail: "",
  logo: null,
  letterDate: new Date().toISOString().split("T")[0],
  letterNumber: `OFF-${new Date().getFullYear()}-001`,
  candidateName: "", candidateAddress: "",
  designation: "", department: "", reportingTo: "",
  dateOfJoining: "", employmentType: "Full-Time", probationPeriod: "6",
  ctcAmount: "", basicPercent: "40", hra: "20",
  workingHours: "9", workingDays: "5",
  signatoryName: "", signatoryDesignation: "",
  signature: null,
  additionalTerms: "",
  acceptanceDeadline: "",
  templateColor: "#0D9488",
};

function JobOfferPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const ctc = parseFloat(form.ctcAmount) || 0;
  const monthly = ctc / 12;
  const basic = (monthly * (parseFloat(form.basicPercent) || 40)) / 100;
  const hra = (monthly * (parseFloat(form.hra) || 20)) / 100;
  const other = monthly - basic - hra;

  const offerBody = (
    <div className="pdf-body">
      <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}><strong>{form.candidateName || "Candidate Name"}</strong></p>
      {form.candidateAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 16px", fontFamily: "Inter, sans-serif" }}>{form.candidateAddress}</p>}
      <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 12px", fontFamily: "Inter, sans-serif" }}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</p>
      <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.8, margin: "0 0 12px", fontFamily: "Inter, sans-serif" }}>
        We are pleased to offer you the position of{" "}
        <strong>{form.designation || "[Designation]"}</strong>
        {form.department ? ` in the ${form.department} department` : ""}
        {form.companyName ? ` at ${form.companyName}` : ""}.
        Your employment type will be <strong>{form.employmentType}</strong>
        {form.reportingTo ? ` and you will be reporting to ${form.reportingTo}` : ""}.
      </p>
      <table className="pdf-table">
        <tbody>
          <tr><td style={{ fontWeight: 600, color: "#6B7280", width: "40%" }}>Date of Joining</td><td style={{ color: accent, fontWeight: 600 }}>{form.dateOfJoining || "—"}</td></tr>
          <tr><td style={{ fontWeight: 600, color: "#6B7280" }}>Employment Type</td><td>{form.employmentType}</td></tr>
          {form.probationPeriod && <tr><td style={{ fontWeight: 600, color: "#6B7280" }}>Probation Period</td><td>{form.probationPeriod} months</td></tr>}
          <tr><td style={{ fontWeight: 600, color: "#6B7280" }}>Working Hours</td><td>{form.workingHours} hours/day, {form.workingDays} days/week</td></tr>
        </tbody>
      </table>
      {ctc > 0 && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif" }}>Compensation (Annual CTC)</p>
          <div style={{ background: "#F0FDFA", border: `1px solid ${accent}`, borderRadius: "8px", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Annual CTC</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: accent, fontFamily: "Space Grotesk, sans-serif" }}>Rs.{ctc.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ borderTop: "1px solid #D1FAF0", paddingTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[["Basic/mo", `Rs.${Math.round(basic).toLocaleString("en-IN")}`], ["HRA/mo", `Rs.${Math.round(hra).toLocaleString("en-IN")}`], ["Other/mo", `Rs.${Math.round(other).toLocaleString("en-IN")}`]].map(([l, v]) => (
                <div key={l}>
                  <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>{l}</p>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {form.additionalTerms && (
        <div style={{ marginTop: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif" }}>Additional Terms</p>
          <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.7, margin: 0 }}>{form.additionalTerms}</p>
        </div>
      )}
      <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "16px 0" }}>
        {form.acceptanceDeadline ? `Please confirm your acceptance of this offer by ${form.acceptanceDeadline}.` : "Please confirm your acceptance of this offer at the earliest."}
        {" "}We look forward to having you on our team.
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
        <div style={{ minWidth: "140px" }}>
          {form.signature ? <div style={{ marginBottom: "4px" }}><img src={form.signature} alt="Signature" style={{ maxHeight: "40px", maxWidth: "120px", display: "block" }} /></div> : <div style={{ height: "36px" }} />}
          <div style={{ borderTop: "1px solid #374151", paddingTop: "6px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{form.signatoryName || "HR Manager"}</p>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.signatoryDesignation || "Designation"}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyName}</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #374151", paddingTop: "6px", minWidth: "140px", textAlign: "right" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{form.candidateName || "Candidate"}</p>
          <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Candidate Signature</p>
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
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#fff", margin: "0 0 4px", textTransform: "uppercase" }}>Offer</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#fff", margin: 0, textTransform: "uppercase" }}>Letter</p>
          </div>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>Ref</p>
            <p style={{ fontSize: "10px", color: "#fff", margin: 0, fontFamily: "Inter, sans-serif" }}>{form.letterNumber}</p>
          </div>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>Date</p>
            <p style={{ fontSize: "10px", color: "#fff", margin: 0, fontFamily: "Inter, sans-serif" }}>{form.letterDate}</p>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>{offerBody}</div>
      </div>
    );
  }
  if (template === "Corporate") {
    return (
      <div className="pdf-preview">
        <div style={{ background: accent, padding: "20px 24px", textAlign: "center" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", filter: "brightness(0) invert(1)", display: "block", margin: "0 auto 8px" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff", margin: 0 }}>OFFER LETTER</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyName || "Company Name"} · Ref: {form.letterNumber} · {form.letterDate}</p>
        </div>
        {offerBody}
      </div>
    );
  }
  if (template === "Elegant") {
    return (
      <div className="pdf-preview" style={{ borderBottom: `4px solid ${accent}` }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: accent, margin: 0 }}>OFFER LETTER</p>
              <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "3px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
            </div>
          </div>
        </div>
        {offerBody}
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
            {form.companyAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}</p>}
            {form.companyEmail && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyEmail}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: accent, margin: 0 }}>OFFER LETTER</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.letterDate}</p>
          </div>
        </div>
        {offerBody}
      </div>
    );
  }
  // Minimal (default)
  return (
    <div className="pdf-preview">
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain", marginBottom: "4px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>OFFER LETTER</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
          </div>
        </div>
        <div style={{ height: "2px", background: accent, marginTop: "12px", borderRadius: "1px" }} />
      </div>
      {offerBody}
    </div>
  );
}

export default function JobOfferLetterPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const router = useRouter();
  const isUserPro = user?.plan === "Business Pro" || user?.plan === "Enterprise";
  const templateMeta = TEMPLATE_REGISTRY.jobOffer[template] || TEMPLATE_REGISTRY.jobOffer.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;
  const handleDownload = () => {
    if (showWatermark) {
      toast.error("This is a PRO template. Please upgrade to download without watermark!");
      router.push("/#pricing");
      return;
    }
    download(`JobOffer${template}`, form, `OfferLetter-${form.candidateName || "Candidate"}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "job-offer-letter", title: `Offer Letter - ${form.candidateName || "Candidate"}`, referenceNumber: form.letterNumber, partyName: form.candidateName, amount: form.ctcAmount, formData: JSON.stringify(form) });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const [activeTab, setActiveTab] = useState("company");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "company", label: "Company" },
    { id: "candidate", label: "Candidate" },
    { id: "terms", label: "Terms" },
    { id: "ctc", label: "CTC" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Job Offer Letter Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Professional offer letter with CTC breakdown</p>
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
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
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
                  <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                </div>
                <div className="form-field"><label className="field-label">Company Name *</label><input className="doc-input" placeholder="Company Pvt. Ltd." value={form.companyName} onChange={e => updateField("companyName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><input className="doc-input" placeholder="Address" value={form.companyAddress} onChange={e => updateField("companyAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" value={form.companyPhone} onChange={e => updateField("companyPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" value={form.companyEmail} onChange={e => updateField("companyEmail", e.target.value)} /></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Letter Number</label><input className="doc-input" value={form.letterNumber} onChange={e => updateField("letterNumber", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Letter Date</label><input className="doc-input" type="date" value={form.letterDate} onChange={e => updateField("letterDate", e.target.value)} /></div>
                </div>
              </div>
            )}

            {activeTab === "candidate" && (
              <div>
                <p className="form-label">Candidate Details</p>
                <div className="form-field"><label className="field-label">Candidate Name *</label><input className="doc-input" placeholder="Full Name" value={form.candidateName} onChange={e => updateField("candidateName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Candidate Address</label><textarea className="doc-textarea" placeholder="Address" value={form.candidateAddress} onChange={e => updateField("candidateAddress", e.target.value)} /></div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Role Details</p>
                <div className="form-field"><label className="field-label">Designation *</label><input className="doc-input" placeholder="Sr. Developer" value={form.designation} onChange={e => updateField("designation", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Department</label><input className="doc-input" placeholder="Engineering" value={form.department} onChange={e => updateField("department", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Reporting To</label><input className="doc-input" placeholder="Team Lead Name" value={form.reportingTo} onChange={e => updateField("reportingTo", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Date of Joining</label><input className="doc-input" type="date" value={form.dateOfJoining} onChange={e => updateField("dateOfJoining", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "terms" && (
              <div>
                <p className="form-label">Employment Terms</p>
                <div className="form-field">
                  <label className="field-label">Employment Type</label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["Full-Time", "Part-Time", "Contract", "Internship"].map(t => (
                      <button key={t} onClick={() => updateField("employmentType", t)} className={`toggle-btn ${form.employmentType === t ? "active" : ""}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Probation (months)</label><select className="doc-select" value={form.probationPeriod} onChange={e => updateField("probationPeriod", e.target.value)}>{["0", "3", "6", "12"].map(v => <option key={v} value={v}>{v === "0" ? "None" : `${v} months`}</option>)}</select></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Working Days/Week</label><select className="doc-select" value={form.workingDays} onChange={e => updateField("workingDays", e.target.value)}>{["5", "6", "7"].map(d => <option key={d} value={d}>{d} days</option>)}</select></div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Acceptance Deadline</label><input className="doc-input" type="date" value={form.acceptanceDeadline} onChange={e => updateField("acceptanceDeadline", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Additional Terms</label><textarea className="doc-textarea" style={{ minHeight: "80px" }} placeholder="Any additional terms..." value={form.additionalTerms} onChange={e => updateField("additionalTerms", e.target.value)} /></div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Signatory</p>
                 <div className="form-field"><label className="field-label">Designation</label><input className="doc-input" placeholder="HR Manager" value={form.signatoryDesignation} onChange={e => updateField("signatoryDesignation", e.target.value)} /></div>
                 
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

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <TemplatePicker 
                  docType="jobOffer" 
                  selected={template} 
                  onChange={(val) => {
                    setTemplate(val);
                    updateField("templateColor", TEMPLATE_REGISTRY.jobOffer[val]?.accent || "#0D9488");
                  }} 
                  isPro={isUserPro} 
                />
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <TemplateColorPicker 
                  selectedColor={form.templateColor} 
                  onChange={(color) => updateField("templateColor", color)} 
                />
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}>
                  <Download size={15} /> Download PDF
                </button>
              </div>
            )}

            {activeTab === "ctc" && (
              <div>
                <p className="form-label">CTC Breakdown</p>
                <div className="form-field">
                  <label className="field-label">Annual CTC (Rs.)</label>
                  <input className="doc-input" type="number" placeholder="600000"
                    value={form.ctcAmount}
                    onChange={e => updateField("ctcAmount", e.target.value)}
                    style={{ fontSize: "16px", fontWeight: 700, color: "#0D9488", fontFamily: "Space Grotesk, sans-serif" }}
                  />
                </div>
                {form.ctcAmount && (
                  <div style={{ padding: "12px", background: "#F0FDFA", borderRadius: "8px", marginBottom: "12px" }}>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Monthly: Rs.{Math.round(parseFloat(form.ctcAmount) / 12).toLocaleString("en-IN")}</p>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Basic % of Monthly</label><input className="doc-input" type="number" value={form.basicPercent} onChange={e => updateField("basicPercent", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">HRA % of Monthly</label><input className="doc-input" type="number" value={form.hra} onChange={e => updateField("hra", e.target.value)} /></div>
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
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <JobOfferPreview form={form} template={template} accent={form.templateColor} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_OFFER" />
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