"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { generateVerificationId } from "@/engine/hashGen";
import { Download, Eye, RefreshCw, Shield } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";


const T = "#0D9488";

const DEFAULT_FORM = {
  orgName: "", orgAddress: "", orgWebsite: "",
  logo: null,
  internName: "",
  role: "", department: "",
  startDate: "", endDate: "",
  issueDate: new Date().toISOString().split("T")[0],
  performance: "excellent",
  projectName: "",
  signatoryName: "", signatoryDesignation: "",
  verificationId: generateVerificationId(),
  enableQR: true,
};

function InternshipPreview({ form }) {
  const start = form.startDate
    ? new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Start Date";
  const end = form.endDate
    ? new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "End Date";

  const perfText = {
    excellent: "demonstrated exceptional commitment, creativity, and technical skills",
    good: "showed good work ethic and contributed meaningfully to the team",
    satisfactory: "performed their assigned duties satisfactorily",
  }[form.performance];

  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: "8px", overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        border: "6px solid #F0F4F3",
        outline: `2px solid ${T}`,
        outlineOffset: "-10px",
        margin: "8px", borderRadius: "6px",
        padding: "28px 36px",
        background: "linear-gradient(135deg, #F0FDFA 0%, #fff 60%, #F0FDFA 100%)",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Corners */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
          <div key={pos} style={{
            position: "absolute",
            [pos.includes("top") ? "top" : "bottom"]: "14px",
            [pos.includes("left") ? "left" : "right"]: "14px",
            width: "20px", height: "20px",
            borderTop: pos.includes("top") ? `2px solid ${T}` : "none",
            borderBottom: pos.includes("bottom") ? `2px solid ${T}` : "none",
            borderLeft: pos.includes("left") ? `2px solid ${T}` : "none",
            borderRight: pos.includes("right") ? `2px solid ${T}` : "none",
          }} />
        ))}

        {form.logo && (
          <img src={form.logo} alt="Logo" style={{ height: "44px", objectFit: "contain", marginBottom: "10px", display: "block", margin: "0 auto 10px" }} />
        )}
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {form.orgName || "Organisation Name"}
        </p>
        {form.orgAddress && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 16px" }}>{form.orgAddress}</p>}

        <div style={{ background: T, color: "#fff", padding: "5px 24px", borderRadius: "2px", fontFamily: "Space Grotesk, sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px", display: "inline-block" }}>
          INTERNSHIP CERTIFICATE
        </div>

        <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 6px" }}>This is to certify that</p>

        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "24px", color: "#111827", margin: "0 0 10px", borderBottom: `2px solid ${T}`, paddingBottom: "6px", display: "inline-block", minWidth: "180px" }}>
          {form.internName || "Intern Name"}
        </p>

        <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 6px", lineHeight: 1.7 }}>
          has successfully completed an internship as{" "}
          <strong style={{ color: T }}>{form.role || "[Role]"}</strong>
          {form.department ? ` in ${form.department}` : ""}
          {" "}from <strong>{start}</strong> to <strong>{end}</strong>
          {" "}and {perfText}.
        </p>

        {form.projectName && (
          <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 12px" }}>
            Project: <strong style={{ color: "#111827" }}>{form.projectName}</strong>
          </p>
        )}

        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 16px" }}>
          Issue Date: {form.issueDate}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "48px", alignItems: "flex-end" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: `2px solid #374151`, paddingTop: "5px", minWidth: "110px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#111827", margin: 0 }}>{form.signatoryName || "Signatory"}</p>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "2px 0 0" }}>{form.signatoryDesignation || "Designation"}</p>
            </div>
          </div>
          {form.enableQR && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", border: `2px solid ${T}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0FDFA", flexDirection: "column", gap: "2px" }}>
                <Shield size={14} color={T} />
                <span style={{ fontSize: "8px", color: T, fontWeight: 600 }}>QR</span>
              </div>
              <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "3px 0 0" }}>Scan to Verify</p>
            </div>
          )}
        </div>

        {form.enableQR && (
          <p style={{ fontSize: "8px", color: "#D1D5DB", margin: "10px 0 0", fontFamily: "monospace" }}>
            ID: {form.verificationId}
          </p>
        )}
      </div>
    </div>
  );
}

export default function InternshipCertificatePage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const handleDownload = () => download("Internship", form, `InternshipCert-${form.internName || "Intern"}.pdf`);
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  return (
    <>
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Internship Certificate Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>QR verified · Professional design</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm({ ...DEFAULT_FORM, verificationId: generateVerificationId() })} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}><RefreshCw size={13} /> Reset</button>
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
            <p className="form-label">Organisation Details</p>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Logo</p>
              <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
            </div>
            <div className="form-field"><label className="field-label">Organisation Name *</label><input className="doc-input" placeholder="Company / College Name" value={form.orgName} onChange={e => updateField("orgName", e.target.value)} /></div>
            <div className="form-field"><label className="field-label">Address</label><input className="doc-input" placeholder="City, State" value={form.orgAddress} onChange={e => updateField("orgAddress", e.target.value)} /></div>

            <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
            <p className="form-label">Intern Details</p>
            <div className="form-field"><label className="field-label">Intern Name *</label><input className="doc-input" placeholder="Full Name" value={form.internName} onChange={e => updateField("internName", e.target.value)} /></div>
            <div className="form-row">
              <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Role</label><input className="doc-input" placeholder="UI/UX Intern" value={form.role} onChange={e => updateField("role", e.target.value)} /></div>
              <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Department</label><input className="doc-input" placeholder="Design" value={form.department} onChange={e => updateField("department", e.target.value)} /></div>
            </div>
            <div className="form-row" style={{ marginTop: "10px" }}>
              <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Start Date</label><input className="doc-input" type="date" value={form.startDate} onChange={e => updateField("startDate", e.target.value)} /></div>
              <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">End Date</label><input className="doc-input" type="date" value={form.endDate} onChange={e => updateField("endDate", e.target.value)} /></div>
            </div>
            <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Project Name (optional)</label><input className="doc-input" placeholder="e.g. E-commerce Website" value={form.projectName} onChange={e => updateField("projectName", e.target.value)} /></div>
            <div className="form-field"><label className="field-label">Issue Date</label><input className="doc-input" type="date" value={form.issueDate} onChange={e => updateField("issueDate", e.target.value)} /></div>

            <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
            <p className="form-label">Performance</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[{ v: "excellent", l: "Excellent" }, { v: "good", l: "Good" }, { v: "satisfactory", l: "Satisfactory" }].map(opt => (
                <button key={opt.v} onClick={() => updateField("performance", opt.v)}
                  className={`toggle-btn ${form.performance === opt.v ? "active" : ""}`}
                  style={{ justifyContent: "flex-start" }}>
                  {opt.l}
                </button>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
            <p className="form-label">Signatory</p>
            <div className="form-field"><label className="field-label">Name</label><input className="doc-input" value={form.signatoryName} onChange={e => updateField("signatoryName", e.target.value)} /></div>
            <div className="form-field"><label className="field-label">Designation</label><input className="doc-input" value={form.signatoryDesignation} onChange={e => updateField("signatoryDesignation", e.target.value)} /></div>

            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">

              <Download size={15} />

              {downloading ? "Generating..." : "Download PDF"}

            </button>
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
            <InternshipPreview form={form} />
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_INTERN" />
        </div>
      </div>
      <Footer />
    </>
  );
}