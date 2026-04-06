"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { useAuth } from "@/contexts/AuthContext";
import SignatureModal from "@/components/SignatureModal";
import { Download, Eye, RefreshCw, Cloud, PenTool, Zap } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import { useProfileSync } from "@/hooks/useProfileSync";

const T = "#0D9488";

export const DEFAULT_FORM = {
  receiptNumber: "RCP-2026-001",
  receiptDate: new Date().toISOString().split("T")[0],
  fromName: "", fromAddress: "", fromCity: "", fromState: "27", fromPhone: "", fromEmail: "",
  receivedFrom: "", receivedFromAddress: "",
  amount: "",
  paymentMode: "UPI",
  purpose: "",
  notes: "",
  signature: null,
  logo: null,
  templateColor: "#0D9488",
};

const PAYMENT_MODES = ["UPI", "NEFT", "RTGS", "Cash", "Cheque", "Credit Card", "Debit Card", "Bank Transfer"];

export function ReceiptPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const amountNum = parseFloat(form.amount) || 0;

  function numToWords(n) {
    if (n === 0) return "Zero";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    function convert(num) {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
      if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
      if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
      if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
      return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "");
    }
    return "Rupees " + convert(Math.floor(n)) + " Only";
  }

  const receiptBody = (
    <div className="pdf-body">
      <div style={{ background: "#F0FDFA", border: `2px solid ${accent}`, borderRadius: "10px", padding: "20px 24px", textAlign: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 4px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Amount Received</p>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "36px", color: accent, margin: 0, lineHeight: 1 }}>
          Rs.{form.amount ? parseFloat(form.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
        </p>
        <p style={{ fontSize: "12px", color: "#374151", margin: "8px 0 0", fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>{numToWords(amountNum)}</p>
      </div>
      <table className="pdf-table">
        <tbody>
          <tr><td style={{ fontWeight: 600, color: "#6B7280", width: "40%" }}>Received From</td><td>{form.receivedFrom || "—"}</td></tr>
          {form.receivedFromAddress && <tr><td style={{ fontWeight: 600, color: "#6B7280" }}>Address</td><td>{form.receivedFromAddress}</td></tr>}
          <tr>
            <td style={{ fontWeight: 600, color: "#6B7280" }}>Payment Mode</td>
            <td><span style={{ background: "#F0FDFA", color: accent, padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{form.paymentMode}</span></td>
          </tr>
          <tr><td style={{ fontWeight: 600, color: "#6B7280" }}>Purpose</td><td>{form.purpose || "—"}</td></tr>
          <tr><td style={{ fontWeight: 600, color: "#6B7280" }}>Date</td><td>{form.receiptDate}</td></tr>
        </tbody>
      </table>
      {form.notes && (
        <div style={{ marginTop: "16px", padding: "10px 14px", background: "#F8F9FA", borderRadius: "6px", borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</p>
          <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontFamily: "Inter, sans-serif" }}>{form.notes}</p>
        </div>
      )}
      <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
        <div style={{ textAlign: "right", minWidth: "120px" }}>
          {form.signature && <div style={{ marginBottom: "4px" }}><img src={form.signature} alt="Signature" style={{ maxHeight: "45px", maxWidth: "140px", display: "block", marginLeft: "auto" }} /></div>}
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", padding: 0, overflow: "hidden" }}>
        <div style={{ width: "135px", background: accent, padding: "24px 14px", flexShrink: 0, color: "#fff", display: "flex", flexDirection: "column", wordBreak: "break-word" }}>
          <p style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>RECEIPT</p>
          <p style={{ fontSize: "10px", opacity: 0.75, margin: "0 0 20px" }}>#{form.receiptNumber}</p>
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>From</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>{form.fromName || "Your Business"}</p>
          <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 16px", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
            {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState.name}` : ""}
            {form.fromPhone && <><br />Ph: {form.fromPhone}</>}
            {form.fromEmail && <><br /><span style={{ wordBreak: "break-all" }}>Em: {form.fromEmail}</span></>}
          </p>
          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Date</p>
            <p style={{ fontSize: "10px", fontWeight: 600, margin: 0 }}>{form.receiptDate}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>{receiptBody}</div>
      </div>
    );
  }
  if (template === "Corporate") {
    return (
      <div className="pdf-preview">
        <div style={{ textAlign: "center", padding: "20px 24px 16px", borderBottom: `2px solid ${accent}`, wordBreak: "break-word" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", display: "block", margin: "0 auto 8px" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: accent, margin: "0 0 2px", letterSpacing: "0.05em" }}>{form.fromName || "Your Business Name"}</p>
          <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 6px", lineHeight: 1.5, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState.name}` : ""}
            {(form.fromPhone || form.fromEmail) && <><br />{form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromEmail && ` | Em: ${form.fromEmail}`}</>}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
            <span>RECEIPT #{form.receiptNumber}</span>
            <span>Date: {form.receiptDate}</span>
          </div>
          {form.signature && (
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={form.signature} alt="Signature" style={{ maxHeight: "40px", maxWidth: "120px", display: "block" }} />
              <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "2px 0 0" }}>Authorised Signatory</p>
            </div>
          )}
        </div>
        {receiptBody}
      </div>
    );
  }
  if (template === "Elegant") {
    return (
      <div className="pdf-preview">
        {/* Elegant: Left accent border strip + stacked layout */}
        <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ width: "5px", background: accent, flexShrink: 0, borderRadius: "0" }} />
          <div style={{ flex: 1, padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", wordBreak: "break-word" }}>
            <div style={{ maxWidth: "60%" }}>
              {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
              {(form.fromAddress || fromState) && (
                <p style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 0", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>
                  {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState.name}` : ""}
                </p>
              )}
              {(form.fromPhone || form.fromEmail) && (
                <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "3px 0 0", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>
                  {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
                </p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", color: accent, margin: 0, letterSpacing: "-0.5px" }}>RECEIPT</p>
              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>#{form.receiptNumber}</span>
                <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{form.receiptDate}</span>
              </div>
            </div>
          </div>
        </div>
        {receiptBody}
      </div>
    );
  }
  if (template === "Classic") {
    return (
      <div className="pdf-preview">
        {/* Classic: Full accent-colored header bar */}
        <div style={{ background: accent, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", wordBreak: "break-word" }}>
          <div style={{ maxWidth: "60%" }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.85)", margin: "4px 0 0", lineHeight: 1.5, whiteSpace: "pre-wrap", fontFamily: "Inter, sans-serif" }}>
              {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState.name}` : ""}
              {(form.fromPhone || form.fromEmail) && (
                <><br />{form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromEmail && ` | Em: ${form.fromEmail}`}</>
              )}
            </p>
          </div>
          <div style={{ textAlign: "right", maxWidth: "35%" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "26px", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>RECEIPT</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>#{form.receiptNumber}</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.receiptDate}</p>
          </div>
        </div>
        {receiptBody}
      </div>
    );
  }
  // Minimal (default): Premium letterhead / stationery style
  return (
    <div className="pdf-preview" style={{ padding: 0 }}>
      {/* Thin top accent stripe */}
      <div style={{ height: "6px", background: accent }} />
      {/* Letterhead header */}
      <div style={{ padding: "18px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E5E7EB", wordBreak: "break-word" }}>
        <div>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 300, fontSize: "22px", color: "#111827", margin: 0, letterSpacing: "-0.3px" }}>{form.fromName || "Your Business Name"}</p>
          {(form.fromAddress || fromState || form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "9px", color: "#BDBDBD", margin: "5px 0 0", fontFamily: "Inter, sans-serif", letterSpacing: "0.04em", lineHeight: 1.6 }}>
              {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState.name}` : ""}
              {(form.fromPhone || form.fromEmail) && (
                <><br />{form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  ·  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}</>
              )}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right", paddingTop: "4px" }}>
          <p style={{ fontSize: "9px", fontWeight: 700, color: "#BDBDBD", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Receipt</p>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "13px", color: accent, margin: "4px 0 0" }}>#{form.receiptNumber}</p>
          <p style={{ fontSize: "9px", color: "#BDBDBD", margin: "3px 0 0", fontFamily: "Inter, sans-serif", letterSpacing: "0.04em" }}>{form.receiptDate}</p>
        </div>
      </div>
      {receiptBody}
    </div>
  );
}

export default function ReceiptPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const router = useRouter();
  const [template, setTemplate] = useState("Classic");
  const plan = user?.plan?.toUpperCase() || "FREE";
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE";

  // Auto-sync profile for Pro/Enterprise
  useProfileSync(form, setForm, plan);
  const templateMeta = TEMPLATE_REGISTRY.receipt[template] || TEMPLATE_REGISTRY.receipt.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;
  const handleDownload = () => {
    download("receipt", template, form, `Receipt-${form.receiptNumber}.pdf`);
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
        docType: "receipt", 
        title: "Receipt #" + form.receiptNumber, 
        referenceNumber: form.receiptNumber, 
        templateName: template,
        partyName: form.receivedFrom, 
        amount: form.amount, 
        formData: JSON.stringify(form) 
      });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const [activeTab, setActiveTab] = useState("from");
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "from", label: "Your Details" },
    { id: "payment", label: "Payment" },
    { id: "extra", label: "Settings" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Receipt Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Free · No sign-up · Instant PDF</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
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
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "from" && (
              <div>
                <p className="form-label">Your Business Details</p>

                {!isUserPro && (
                  <div style={{ padding: "10px 14px", background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <Zap size={14} color={T} />
                    <p style={{ fontSize: "11px", color: T, fontWeight: 600, margin: 0, fontFamily: "Inter, sans-serif" }}>
                      Tip: Upgrade to <strong style={{ color: "#0D9488" }}>Business Pro</strong> to auto-fill your profile details.
                    </p>
                  </div>
                )}
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
                <div className="form-field"><label className="field-label">Business Name</label><input className="doc-input" placeholder="Your Company Name" value={form.fromName} onChange={e => updateField("fromName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><textarea className="doc-textarea" placeholder="Street address" value={form.fromAddress} onChange={e => updateField("fromAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Mumbai" value={form.fromCity} onChange={e => updateField("fromCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label><select className="doc-select" value={form.fromState} onChange={e => updateField("fromState", e.target.value)}>{INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.fromPhone} onChange={e => updateField("fromPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="you@company.com" value={form.fromEmail} onChange={e => updateField("fromEmail", e.target.value)} /></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Receipt Details</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Receipt Number</label><input className="doc-input" value={form.receiptNumber} onChange={e => updateField("receiptNumber", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Date</label><input className="doc-input" type="date" value={form.receiptDate} onChange={e => updateField("receiptDate", e.target.value)} /></div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div>
                <p className="form-label">Payment Details</p>
                <div className="form-field"><label className="field-label">Received From *</label><input className="doc-input" placeholder="Payer Name / Company" value={form.receivedFrom} onChange={e => updateField("receivedFrom", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Payer Address</label><textarea className="doc-textarea" placeholder="Payer address (optional)" value={form.receivedFromAddress} onChange={e => updateField("receivedFromAddress", e.target.value)} /></div>
                <div className="form-field">
                  <label className="field-label">Amount Received (₹) *</label>
                  <input className="doc-input" type="number" placeholder="0.00" value={form.amount}
                    onChange={e => { if (e.target.value.replace(/[^0-9.]/g, '').length <= 15) updateField("amount", e.target.value); }}
                    maxLength={15}
                    style={{ fontSize: "16px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}
                  />
                  <p style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "4px" }}>Maximum 15 digits allowed.</p>
                </div>
                <div className="form-field">
                  <label className="field-label">Payment Mode</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {PAYMENT_MODES.map(mode => (
                      <button key={mode} onClick={() => updateField("paymentMode", mode)}
                        className={`toggle-btn ${form.paymentMode === mode ? "active" : ""}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-field"><label className="field-label">Purpose / Description</label><input className="doc-input" placeholder="e.g. Invoice Payment, Rent, Advance" value={form.purpose} onChange={e => updateField("purpose", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "extra" && (
              <div>
                <p className="form-label">Additional Notes</p>
                <div className="form-field"><label className="field-label">Notes</label><textarea className="doc-textarea" placeholder="Any additional notes..." value={form.notes} onChange={e => updateField("notes", e.target.value)} style={{ minHeight: "100px" }} /></div>
                
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Signature</p>
                <div style={{
                  border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#fff"
                }}>
                  {form.signature ? (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <div style={{
                        padding: "16px", background: "#F9FAFB", borderRadius: "8px",
                        border: "1px dashed #D1D5DB", display: "inline-block", minWidth: "200px"
                      }}>
                        <img src={form.signature} alt="Signature" style={{ height: "60px", maxWidth: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                        <button onClick={() => setIsSigModalOpen(true)} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "1px solid #D1D5DB",
                          background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer"
                        }}>Change</button>
                        <button onClick={() => updateField("signature", null)} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "1px solid #FEE2E2",
                          background: "#FEF2F2", fontSize: "13px", fontWeight: 600, color: "#EF4444", cursor: "pointer"
                        }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsSigModalOpen(true)} style={{
                      width: "100%", padding: "40px 20px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "12px", background: "#F9FAFB", border: "1px dashed #D1D5DB",
                      borderRadius: "10px", cursor: "pointer", transition: "all 200ms"
                    }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <PenTool size={20} color="#9CA3AF" />
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Add digital signature</span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <div style={{ marginTop: "8px" }}>
                  <TemplatePicker
                    docType="receipt"
                    selected={template}
                    onChange={setTemplate}
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
              <ReceiptPreview form={form} template={template} accent={form.templateColor || templateMeta.accent} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_RECEIPT" />
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