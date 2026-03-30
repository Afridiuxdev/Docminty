"use client";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { generateVerificationId } from "@/engine/hashGen";
import { Download, RefreshCw, Eye, Shield, Cloud } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";

const T = "#0D9488";

const DEFAULT_FORM = {
  orgName: "", orgAddress: "", orgWebsite: "",
  logo: null,
  internName: "", role: "", department: "",
  startDate: "", endDate: "",
  issueDate: new Date().toISOString().split("T")[0],
  performance: "excellent", projectName: "",
  signatoryName: "", signatoryDesignation: "",
  verificationId: generateVerificationId(),
  enableQR: true,
};

function InternshipPreview({ form }) {
  var start = form.startDate ? new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Start Date";
  var end   = form.endDate   ? new Date(form.endDate).toLocaleDateString("en-IN",   { day: "numeric", month: "long", year: "numeric" }) : "End Date";
  var perfMap = { excellent: "demonstrated exceptional commitment, creativity, and technical skills", good: "showed good work ethic and contributed meaningfully to the team", satisfactory: "performed their assigned duties satisfactorily" };
  var perfText = perfMap[form.performance] || perfMap.excellent;
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ border: "6px solid #F0F4F3", outline: "2px solid " + T, outlineOffset: "-10px", margin: "8px", borderRadius: "6px", padding: "28px 36px", background: "linear-gradient(135deg,#F0FDFA 0%,#fff 60%,#F0FDFA 100%)", textAlign: "center", position: "relative" }}>
        {form.logo && <img src={form.logo} alt="Logo" style={{ height: "44px", objectFit: "contain", display: "block", margin: "0 auto 10px" }} />}
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{form.orgName || "Organisation Name"}</p>
        {form.orgAddress && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 14px" }}>{form.orgAddress}</p>}
        <div style={{ display: "inline-block", background: T, color: "#fff", padding: "3px 18px", borderRadius: "2px", marginBottom: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>Internship Certificate</p>
        </div>
        <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 5px" }}>This is to certify that</p>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: "#111827", margin: "0 0 8px", borderBottom: "2px solid " + T, paddingBottom: "6px" }}>{form.internName || "Intern Name"}</p>
        <p style={{ fontSize: "10px", color: "#374151", lineHeight: 1.6, margin: "6px 0" }}>
          {perfText} as <strong>{form.role || "Intern"}</strong>
          {form.department ? " in the " + form.department + " department" : ""}
          {" from "}<strong style={{ color: T }}>{start}</strong>{" to "}<strong style={{ color: T }}>{end}</strong>.
        </p>
        {form.projectName && <p style={{ fontSize: "10px", color: "#374151", margin: "5px 0" }}>Project: <strong>{form.projectName}</strong></p>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "18px" }}>
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px", width: "110px", textAlign: "left" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.signatoryName || "Signatory Name"}</p>
            <p style={{ fontSize: "9px", color: "#9CA3AF", margin: 0 }}>{form.signatoryDesignation || "Designation"}</p>
          </div>
          {form.enableQR && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", background: "#F0FDFA", border: "2px solid " + T, borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={16} color={T} /></div>
              <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "2px 0 0" }}>Scan to Verify</p>
            </div>
          )}
        </div>
        {form.enableQR && <p style={{ fontSize: "8px", color: "#D1D5DB", marginTop: "6px", fontFamily: "monospace" }}>ID: {form.verificationId}</p>}
      </div>
    </div>
  );
}

export default function InternshipCertificatePage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [activeTab, setActiveTab] = useState("org");
  const router = useRouter();
  const handleDownload = () => download("Internship", form, "InternshipCert-" + (form.internName || "Intern") + ".pdf");

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "internship-certificate", title: `Internship Certificate - ${form.internName || "Intern"}`, referenceNumber: form.verificationId, partyName: form.internName, amount: "", formData: JSON.stringify(form) });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "org",     label: "Organisation" },
    { id: "intern",  label: "Intern"       },
    { id: "content", label: "Content"      },
    { id: "verify",  label: "Verification" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Internship Certificate Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>QR verified internship completion certificates</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}><RefreshCw size={13} /> Reset</button>
            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn"><Download size={15} />{downloading ? "Generating..." : "Download PDF"}</button>
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}><Cloud size={14} /> Save</button>
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{tab.label}</button>
              ))}
            </div>

            {activeTab === "org" && (
              <div>
                <p className="form-label">Organisation Details</p>
                <div style={{ marginBottom: "16px" }}><p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Organisation Logo</p><LogoUpload value={form.logo} onChange={v => updateField("logo", v)} /></div>
                <div className="form-field"><label className="field-label">Organisation Name</label><input className="doc-input" placeholder="Acme Pvt Ltd" value={form.orgName} onChange={e => updateField("orgName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><input className="doc-input" placeholder="123 Tech Park, Bengaluru" value={form.orgAddress} onChange={e => updateField("orgAddress", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Website</label><input className="doc-input" placeholder="www.acme.com" value={form.orgWebsite} onChange={e => updateField("orgWebsite", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "intern" && (
              <div>
                <p className="form-label">Intern Details</p>
                <div className="form-field"><label className="field-label">Intern Full Name</label><input className="doc-input" placeholder="Ananya Singh" value={form.internName} onChange={e => updateField("internName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Role / Position</label><input className="doc-input" placeholder="Software Development Intern" value={form.role} onChange={e => updateField("role", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Department</label><input className="doc-input" placeholder="Engineering" value={form.department} onChange={e => updateField("department", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Start Date</label><input className="doc-input" type="date" value={form.startDate} onChange={e => updateField("startDate", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">End Date</label><input className="doc-input" type="date" value={form.endDate} onChange={e => updateField("endDate", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "12px" }}><label className="field-label">Issue Date</label><input className="doc-input" type="date" value={form.issueDate} onChange={e => updateField("issueDate", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "content" && (
              <div>
                <p className="form-label">Certificate Content</p>
                <div className="form-field"><label className="field-label">Project / Work Done</label><input className="doc-input" placeholder="E-commerce Website Redesign" value={form.projectName} onChange={e => updateField("projectName", e.target.value)} /></div>
                <div className="form-field">
                  <label className="field-label">Performance</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {[{ v: "excellent", l: "Excellent ? Outstanding performance" }, { v: "good", l: "Good ? Reliable contributor" }, { v: "satisfactory", l: "Satisfactory ? Met expectations" }].map(opt => (
                      <button key={opt.v} onClick={() => updateField("performance", opt.v)} className={"toggle-btn " + (form.performance === opt.v ? "active" : "")} style={{ justifyContent: "flex-start" }}>{opt.l}</button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Signatory</p>
                <div className="form-field"><label className="field-label">Name</label><input className="doc-input" placeholder="Ravi Kumar" value={form.signatoryName} onChange={e => updateField("signatoryName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Designation</label><input className="doc-input" placeholder="HR Manager" value={form.signatoryDesignation} onChange={e => updateField("signatoryDesignation", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "verify" && (
              <div>
                <p className="form-label">QR Verification</p>
                <div style={{ padding: "12px", background: "#F0FDFA", borderRadius: "8px", marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: T, margin: "0 0 3px", fontFamily: "Space Grotesk, sans-serif" }}>Secure QR Code</p>
                  <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>A unique QR code will be added to verify certificate authenticity instantly.</p>
                </div>
                <div className="form-field">
                  <label className="field-label">Verification ID</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input value={form.verificationId} readOnly style={{ flex: 1, height: "38px", padding: "0 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "12px", color: "#9CA3AF", fontFamily: "monospace", background: "#F8F9FA", outline: "none" }} />
                    <button onClick={() => updateField("verificationId", generateVerificationId())} style={{ padding: "0 12px", height: "38px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "12px", cursor: "pointer", fontFamily: "Inter, sans-serif", color: "#6B7280", whiteSpace: "nowrap" }}>Regenerate</button>
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">QR Code on Certificate</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[["true","Yes ? Add QR Code"],["false","No ? Skip"]].map(function(opt) {
                      return <button key={opt[0]} onClick={() => updateField("enableQR", opt[0] === "true")} className={"toggle-btn " + (String(form.enableQR) === opt[0] ? "active" : "")}>{opt[1]}</button>;
                    })}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn"><Download size={15} />{downloading ? "Generating..." : "Download PDF"}</button>
              </div>
            )}
          </div>

          <div className="preview-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={14} color="#9CA3AF" />
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
              </div>
              <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn"><Download size={15} />{downloading ? "Generating..." : "Download PDF"}</button>
            </div>
            <InternshipPreview form={form} />
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_INTERNSHIP" />
        </div>
      </div>
      <Footer />
    </>
  );
}
