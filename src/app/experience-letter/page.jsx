"use client";
import TemplatePicker from "@/components/TemplatePicker";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { Download, Eye, RefreshCw, Cloud } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

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
  signatoryName: "", signatoryDesignation: "", signatoryDept: "",
};

function ExperiencePreview({ form }) {
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

  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
          {form.companyAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</p>}
          {form.companyPhone && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone} {form.companyEmail ? `| ${form.companyEmail}` : ""}</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: T, margin: 0 }}>EXPERIENCE LETTER</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Ref: {form.letterNumber}</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.letterDate}</p>
        </div>
      </div>
      <div className="pdf-body">
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
          <strong style={{ color: T }}>{joining}</strong>
          {" "}to{" "}
          <strong style={{ color: T }}>{leaving}</strong>.
        </p>

        <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 12px" }}>
          {performanceText}
        </p>

        {form.additionalNote && (
          <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 12px" }}>
            {form.additionalNote}
          </p>
        )}

        <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", lineHeight: 1.8, margin: "0 0 24px" }}>
          We wish {form.employeeName || "them"} all the best in their future endeavours.
        </p>

        <div style={{ marginTop: "32px" }}>
          <div style={{ borderTop: "1px solid #374151", paddingTop: "6px", display: "inline-block", minWidth: "140px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{form.signatoryName || "Authorised Signatory"}</p>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.signatoryDesignation || "Designation"}</p>
            {form.signatoryDept && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.signatoryDept}</p>}
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyName}</p>
          </div>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceLetterPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const [activeTab, setActiveTab] = useState("company");
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
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}>
              <Cloud size={14} /> Save
            </button>
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
                    onChange={setTemplate} 
                    isPro={isUserPro} 
                  />
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "24px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}>
                  <Download size={15} /> Download PDF
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
              <ExperiencePreview form={form} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_EXP" />
        </div>
      </div>
      <Footer />
    </>
  );
}
