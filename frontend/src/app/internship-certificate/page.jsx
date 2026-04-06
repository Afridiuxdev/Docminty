"use client";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "qrcode";
import { generateQRData } from "@/engine/hashGen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import SignatureModal from "@/components/SignatureModal";
import { generateVerificationId } from "@/engine/hashGen";
import TemplatePicker from "@/components/TemplatePicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { Download, RefreshCw, Eye, Shield, Cloud, PenTool } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import { useProfileSync } from "@/hooks/useProfileSync";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#0D9488";

const DEFAULT_FORM = {
  orgName: "", orgAddress: "", orgCity: "", orgState: "27", orgWebsite: "",
  logo: null,
  internName: "", role: "", department: "",
  startDate: "", endDate: "",
  issueDate: new Date().toISOString().split("T")[0],
  performance: "excellent", projectName: "",
  signatoryName: "", signatoryDesignation: "",
  signature: null,
  verificationId: generateVerificationId(),
  enableQR: true,
  templateColor: "#0D9488",
  qrCodeDataUrl: null,
};

export function InternshipPreview({ form, template = "Classic", accent = "#0D9488" }) {
  var start = form.startDate ? new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Start Date";
  var end = form.endDate ? new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "End Date";
  var perfMap = { excellent: "demonstrated exceptional commitment, creativity, and technical skills", good: "showed good work ethic and contributed meaningfully to the team", satisfactory: "performed their assigned duties satisfactorily" };
  var perfText = perfMap[form.performance] || perfMap.excellent;

  const certContent = (
    <>
      {form.logo && <img src={form.logo} alt="Logo" style={{ height: "44px", objectFit: "contain", display: "block", margin: "0 auto 10px" }} />}
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{form.orgName || "Organisation Name"}</p>
      {(form.orgAddress || form.orgCity || form.orgState) && (
        <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px" }}>
          {[
            form.orgAddress || null,
            (form.orgCity || form.orgState) ? `${form.orgCity ? form.orgCity + ", " : ""}${INDIAN_STATES.find(s => s.code === form.orgState)?.name || ""}` : null
          ].filter(Boolean).join(", ")}
        </p>
      )}
      {form.orgWebsite && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 14px" }}>{form.orgWebsite}</p>}
      {!form.orgWebsite && (form.orgAddress || form.orgCity || form.orgState) && <div style={{ marginBottom: "14px" }} />}
      <div style={{ display: "inline-block", background: accent, color: "#fff", padding: "3px 18px", borderRadius: "2px", marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>Internship Certificate</p>
      </div>
      <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 5px" }}>This is to certify that</p>
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: "#111827", margin: "0 0 8px", borderBottom: `2px solid ${accent}`, paddingBottom: "6px" }}>{form.internName || "Intern Name"}</p>
      <p style={{ fontSize: "10px", color: "#374151", lineHeight: 1.6, margin: "6px 0" }}>
        {perfText} as <strong>{form.role || "Intern"}</strong>
        {form.department ? " in the " + form.department + " department" : ""}
        {" from "}<strong style={{ color: accent }}>{start}</strong>{" to "}<strong style={{ color: accent }}>{end}</strong>.
      </p>
      {form.projectName && <p style={{ fontSize: "10px", color: "#374151", margin: "5px 0" }}>Project: <strong>{form.projectName}</strong></p>}
      {form.issueDate && <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "6px 0 0" }}>Date of Issue: {new Date(form.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "18px" }}>
        <div style={{ minWidth: "110px", textAlign: "left" }}>
          {form.signature ? <div style={{ marginBottom: "2px" }}><img src={form.signature} alt="Signature" style={{ maxHeight: "35px", maxWidth: "100px", display: "block" }} /></div> : <div style={{ height: "30px" }} />}
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.signatoryName || "Signatory Name"}</p>
            <p style={{ fontSize: "9px", color: "#9CA3AF", margin: 0 }}>{form.signatoryDesignation || "Designation"}</p>
          </div>
        </div>
        {form.enableQR && (
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              width: "40px", height: "40px", background: "#F0FDFA", border: `2px solid ${accent}`, 
              borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              {form.qrCodeDataUrl ? (
                <img src={form.qrCodeDataUrl} alt="QR" style={{ width: "100%", height: "100%", padding: "2px" }} />
              ) : (
                <Shield size={16} color={accent} />
              )}
            </div>
            <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "2px 0 0" }}>Scan to Verify</p>
          </div>
        )}
      </div>
      {form.enableQR && <p style={{ fontSize: "8px", color: "#D1D5DB", marginTop: "6px", fontFamily: "monospace" }}>ID: {form.verificationId}</p>}
    </>
  );

  if (template === "Modern") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ background: accent, padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "13px", color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>Internship Certificate</p>
        </div>
        <div style={{ padding: "28px 36px", textAlign: "center" }}>{certContent}</div>
      </div>
    );
  }
  if (template === "Royal") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ border: `8px double ${accent}`, margin: "8px", borderRadius: "4px", padding: "28px 36px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "8px", left: "8px", width: "16px", height: "16px", borderTop: `3px solid ${accent}`, borderLeft: `3px solid ${accent}` }} />
          <div style={{ position: "absolute", top: "8px", right: "8px", width: "16px", height: "16px", borderTop: `3px solid ${accent}`, borderRight: `3px solid ${accent}` }} />
          <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "16px", height: "16px", borderBottom: `3px solid ${accent}`, borderLeft: `3px solid ${accent}` }} />
          <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "16px", height: "16px", borderBottom: `3px solid ${accent}`, borderRight: `3px solid ${accent}` }} />
          {certContent}
        </div>
      </div>
    );
  }
  if (template === "Elegant") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: "8px", background: accent, flexShrink: 0 }} />
          <div style={{ padding: "28px 36px", textAlign: "center", flex: 1 }}>{certContent}</div>
          <div style={{ width: "8px", background: accent, flexShrink: 0 }} />
        </div>
      </div>
    );
  }
  if (template === "Minimal") {
    return (
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ borderTop: `3px solid ${accent}`, padding: "28px 36px", textAlign: "center" }}>{certContent}</div>
      </div>
    );
  }
  // Classic (default)
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ border: "6px solid #F0F4F3", outline: `2px solid ${accent}`, outlineOffset: "-10px", margin: "8px", borderRadius: "6px", padding: "28px 36px", background: "linear-gradient(135deg,#F0FDFA 0%,#fff 60%,#F0FDFA 100%)", textAlign: "center", position: "relative" }}>
        {certContent}
      </div>
    </div>
  );
}

export default function InternshipCertificatePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [activeTab, setActiveTab] = useState("org");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [template, setTemplate] = useState("Classic");
  const router = useRouter();
  const plan = user?.plan?.toUpperCase() || "FREE";
  useProfileSync(form, setForm, plan, { fromName: "orgName", fromAddress: "orgAddress", fromCity: "orgCity", fromState: "orgState", fromWebsite: "orgWebsite" });
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";
  const templateMeta = TEMPLATE_REGISTRY.internship[template] || TEMPLATE_REGISTRY.internship.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;
  const handleDownload = () => {
    download("internship", template, form, "InternshipCert-" + (form.internName || "Intern") + ".pdf");
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ 
        docType: "internship-certificate", 
        title: `Internship Certificate - ${form.internName || "Intern"}`, 
        referenceNumber: form.verificationId, 
        templateName: template,
        partyName: form.internName, 
        amount: "", 
        formData: JSON.stringify(form) 
      });
      toast.success("Saved to your dashboard!");
    } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

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
    { id: "intern", label: "Intern" },
    { id: "content", label: "Content" },
    { id: "verify", label: "Verify" },
    { id: "templates", label: "Templates" },
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
            {user && isUserPro && (
              <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}><Cloud size={14} /> Save</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div className="tab-bar" style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{tab.label}</button>
              ))}
            </div>

            {activeTab === "org" && (
              <div>
                <p className="form-label">Organisation Details</p>
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
                <div className="form-field"><label className="field-label">Organisation Name</label><input className="doc-input" placeholder="Acme Pvt Ltd" value={form.orgName} onChange={e => updateField("orgName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><input className="doc-input" placeholder="123 Tech Park" value={form.orgAddress || ""} onChange={e => updateField("orgAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Bengaluru" value={form.orgCity || ""} onChange={e => updateField("orgCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label>
                    <select className="doc-select" value={form.orgState || "27"} onChange={e => updateField("orgState", e.target.value)}>
                      {INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Website</label><input className="doc-input" placeholder="www.acme.com" value={form.orgWebsite || ""} onChange={e => updateField("orgWebsite", e.target.value)} /></div>
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
                        <img src={form.signature} alt="Signature" style={{ height: "40px", maxWidth: "100%", objectFit: "contain" }} />
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
                    {[["true", "Yes. Add QR Code"], ["false", "No. Skip"]].map(function (opt) {
                      return <button key={opt[0]} onClick={() => updateField("enableQR", opt[0] === "true")} className={"toggle-btn " + (String(form.enableQR) === opt[0] ? "active" : "")}>{opt[1]}</button>;
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <TemplatePicker
                  docType="internship"
                  selected={template}
                  onChange={(val) => {
                    setTemplate(val);
                    updateField("templateColor", TEMPLATE_REGISTRY.internship[val]?.accent || "#0D9488");
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
              <InternshipPreview form={form} template={template} accent={form.templateColor} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_INTERNSHIP" />
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
