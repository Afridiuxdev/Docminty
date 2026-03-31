"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import { Download, Eye, RefreshCw, Cloud } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import TemplatePicker from "@/components/TemplatePicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { useAuth } from "@/contexts/AuthContext";

const T = "#0D9488";

const DEFAULT_FORM = {
  receiptNumber: "RCP-2026-001",
  receiptDate: new Date().toISOString().split("T")[0],
  fromName: "", fromAddress: "", fromCity: "", fromState: "27", fromPhone: "", fromEmail: "",
  receivedFrom: "", receivedFromAddress: "",
  amount: "",
  paymentMode: "UPI",
  purpose: "",
  notes: "",
  logo: null,
};

const PAYMENT_MODES = ["UPI", "NEFT", "RTGS", "Cash", "Cheque", "Credit Card", "Debit Card", "Bank Transfer"];

function ReceiptPreview({ form }) {
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

  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
          {form.fromAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}</p>}
          {fromState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{fromState.name}</p>}
          {form.fromPhone && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.fromPhone}</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: T, margin: 0 }}>RECEIPT</p>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>#{form.receiptNumber}</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.receiptDate}</p>
        </div>
      </div>

      <div className="pdf-body">
        {/* Amount box */}
        <div style={{
          background: "#F0FDFA", border: `2px solid ${T}`,
          borderRadius: "10px", padding: "20px 24px",
          textAlign: "center", marginBottom: "20px",
        }}>
          <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 4px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Amount Received</p>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "36px", color: T, margin: 0, lineHeight: 1 }}>
            ₹{form.amount ? parseFloat(form.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
          </p>
          <p style={{ fontSize: "12px", color: "#374151", margin: "8px 0 0", fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>
            {numToWords(amountNum)}
          </p>
        </div>

        {/* Details table */}
        <table className="pdf-table">
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280", width: "40%" }}>Received From</td>
              <td>{form.receivedFrom || "—"}</td>
            </tr>
            {form.receivedFromAddress && (
              <tr>
                <td style={{ fontWeight: 600, color: "#6B7280" }}>Address</td>
                <td>{form.receivedFromAddress}</td>
              </tr>
            )}
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Payment Mode</td>
              <td>
                <span style={{
                  background: "#F0FDFA", color: T,
                  padding: "2px 8px", borderRadius: "4px",
                  fontSize: "11px", fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                }}>
                  {form.paymentMode}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Purpose</td>
              <td>{form.purpose || "—"}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Date</td>
              <td>{form.receiptDate}</td>
            </tr>
          </tbody>
        </table>

        {form.notes && (
          <div style={{ marginTop: "16px", padding: "10px 14px", background: "#F8F9FA", borderRadius: "6px", borderLeft: `3px solid ${T}` }}>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</p>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontFamily: "Inter, sans-serif" }}>{form.notes}</p>
          </div>
        )}

        <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px", minWidth: "120px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const router = useRouter();
  const handleDownload = () => download("Receipt", form, `Receipt-${form.receiptNumber}.pdf`);

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "receipt", title: "Receipt #" + form.receiptNumber, referenceNumber: form.receiptNumber, partyName: form.receivedFrom, amount: form.amount, formData: JSON.stringify(form) });
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
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "from" && (
              <div>
                <p className="form-label">Your Business Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Company Logo</p>
                  <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
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
                  <input className="doc-input" type="number" placeholder="0.00" value={form.amount} onChange={e => updateField("amount", e.target.value)}
                    style={{ fontSize: "16px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}
                  />
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
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}>
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
                    docType="receipt" 
                    selected="Classic" 
                    onChange={() => {}} 
                    isPro={false} 
                  />
                  <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "12px 0 0", fontStyle: "italic" }}>
                    Receipt currently supports one professional design. More coming soon!
                  </p>
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
            <ReceiptPreview form={form} />
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_RECEIPT" />
        </div>
      </div>
      <Footer />
    </>
  );
}