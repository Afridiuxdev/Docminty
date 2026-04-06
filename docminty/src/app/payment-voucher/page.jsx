"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import SignatureModal from "@/components/SignatureModal";
import { Download, Eye, RefreshCw, Cloud, PenTool } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import { INDIAN_STATES } from "@/constants/indianStates";
import { useProfileSync } from "@/hooks/useProfileSync";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

const T = "#0D9488";

const DEFAULT_FORM = {
  voucherNumber: `PV-${new Date().getFullYear()}-001`,
  voucherDate: new Date().toISOString().split("T")[0],
  companyName: "", companyAddress: "", companyCity: "", companyState: "27",
  companyPhone: "", companyEmail: "",
  logo: null,
  paidTo: "", paidToAddress: "", paidToCity: "", paidToState: "27",
  paidToPhone: "", paidToEmail: "",
  amount: "",
  paymentMode: "Bank Transfer",
  bankName: "", chequeNumber: "", chequeDate: "",
  purpose: "",
  accountHead: "",
  narration: "",
  preparedBy: "", approvedBy: "",
  signaturePrepared: null,
  signatureApproved: null,
  templateColor: "#0D9488",
};

const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "UPI", "NEFT", "RTGS"];
const ACCOUNT_HEADS = [
  "Office Expenses", "Travel Expenses", "Salary", "Rent",
  "Utilities", "Vendor Payment", "Contractor Payment",
  "Advance", "Miscellaneous",
];

export function VoucherPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const companyState = INDIAN_STATES.find(s => s.code === form.companyState);
  const paidToState = INDIAN_STATES.find(s => s.code === form.paidToState);

  function numToWords(n) {
    if (!n || n === 0) return "Zero Rupees Only";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
      "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
      "Sixty", "Seventy", "Eighty", "Ninety"];
    function convert(num) {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
      if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
      if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
      return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    }
    return "Rupees " + convert(Math.floor(n)) + " Only";
  }

  const amount = parseFloat(form.amount) || 0;

  const sharedBody = (
    <div className="pdf-body">
      {/* Amount highlight */}
      <div style={{
        background: accent + "10", border: `2px solid ${accent}`,
        borderRadius: "10px", padding: "16px 20px",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "20px",
      }}>
        <div>
          <p style={{
            fontSize: "11px", color: "#6B7280", margin: "0 0 2px",
            fontFamily: "Inter, sans-serif", textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}>Amount Paid</p>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800,
            fontSize: "28px", color: accent, margin: 0, lineHeight: 1
          }}>
            ₹{amount ? amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{
            background: accent, color: "#fff",
            padding: "4px 12px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}>{form.paymentMode}</span>
        </div>
      </div>

      <p style={{
        fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif",
        margin: "0 0 4px"
      }}>
        <em>In words:</em>{" "}
        <strong>{numToWords(amount)}</strong>
      </p>

      <table className="pdf-table" style={{ marginTop: "16px" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600, color: "#6B7280", width: "35%" }}>Paid To</td>
            <td><strong>{form.paidTo || "—"}</strong></td>
          </tr>
          {(form.paidToAddress || form.paidToCity || form.paidToState) && (
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Address</td>
              <td>{form.paidToAddress}{form.paidToCity ? `, ${form.paidToCity}` : ""}{paidToState ? `, ${paidToState.name}` : ""}</td>
            </tr>
          )}
          {(form.paidToPhone || form.paidToEmail) && (
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Contact</td>
              <td>{form.paidToPhone && `Ph: ${form.paidToPhone}`}{form.paidToPhone && form.paidToEmail ? "  |  " : ""}{form.paidToEmail && `Em: ${form.paidToEmail}`}</td>
            </tr>
          )}
          <tr>
            <td style={{ fontWeight: 600, color: "#6B7280" }}>Purpose</td>
            <td>{form.purpose || "—"}</td>
          </tr>
          {form.accountHead && (
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Account Head</td>
              <td>{form.accountHead}</td>
            </tr>
          )}
          <tr>
            <td style={{ fontWeight: 600, color: "#6B7280" }}>Payment Mode</td>
            <td>{form.paymentMode}</td>
          </tr>
          {form.paymentMode === "Cheque" && form.chequeNumber && (
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Cheque Details</td>
              <td>
                #{form.chequeNumber}
                {form.bankName ? ` — ${form.bankName}` : ""}
                {form.chequeDate ? ` (${form.chequeDate})` : ""}
              </td>
            </tr>
          )}
          {form.narration && (
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Description</td>
              <td>{form.narration}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Signatures */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px", marginTop: "32px",
      }}>
        {[
          { label: "Prepared By", name: form.preparedBy || "—", sig: form.signaturePrepared },
          { label: "Approved By", name: form.approvedBy || "—", sig: form.signatureApproved },
          { label: "Received By", name: "", sig: null },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            {item.sig ? (
              <div style={{ marginBottom: "2px" }}>
                <img src={item.sig} alt={item.label} style={{ maxHeight: "40px", maxWidth: "100px", display: "block", margin: "0 auto" }} />
              </div>
            ) : (
              <div style={{ height: "42px" }} />
            )}
            <div style={{
              borderTop: "1px solid #374151",
              paddingTop: "6px",
            }}>
              {item.name && <p style={{
                fontSize: "11px", fontWeight: 600,
                color: "#111827", margin: "0 0 2px",
                fontFamily: "Space Grotesk, sans-serif"
              }}>{item.name}</p>}
              <p style={{
                fontSize: "10px", color: "#9CA3AF",
                fontFamily: "Inter, sans-serif", margin: 0
              }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{
        fontSize: "10px", color: "#D1D5DB",
        fontFamily: "Inter, sans-serif", margin: "20px 0 0",
        borderTop: "1px solid #E5E7EB", paddingTop: "10px"
      }}>
        Generated by DocMinty.com
      </p>
    </div>
  );

  // Modern — Sidebar
  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", padding: 0, overflow: "hidden" }}>
        <div style={{ width: "140px", background: accent, padding: "24px 14px", flexShrink: 0, color: "#fff", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>VOUCHER</p>
          <p style={{ fontSize: "10px", opacity: 0.75, margin: "0 0 24px" }}>#{form.voucherNumber}</p>
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Issuer</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 4px" }}>{form.companyName || "Your Company"}</p>
          <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 16px", lineHeight: 1.4 }}>
            {form.companyAddress} {form.companyCity && `${form.companyCity}, `} {companyState?.name}
          </p>
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Paid To</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 16px" }}>{form.paidTo || "Recipient"}</p>
          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Total Amount</p>
            <p style={{ fontSize: "12px", fontWeight: 700, margin: 0 }}>₹{amount.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain" }} />}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0 }}>Date: {form.voucherDate}</p>
            </div>
          </div>
          {sharedBody}
        </div>
      </div>
    );
  }

  // Corporate — Centered
  if (template === "Corporate") {
    return (
      <div className="pdf-preview">
        <div style={{ textAlign: "center", padding: "20px 24px 16px", borderBottom: `2px solid ${accent}` }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", margin: "0 auto 8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: accent, margin: "0 0 2px" }}>{form.companyName || "Company Name"}</p>
          <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 8px", maxWidth: "400px" }}>{form.companyAddress} {form.companyCity && `${form.companyCity}, `} {companyState?.name}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "10px", color: "#9CA3AF", fontWeight: 700 }}>
            <span>VOUCHER: #{form.voucherNumber}</span>
            <span>DATE: {form.voucherDate}</span>
          </div>
        </div>
        {sharedBody}
      </div>
    );
  }

  // Elegant — Accent Bar
  if (template === "Elegant") {
    return (
      <div className="pdf-preview">
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "12px" }}>
            <div>
              {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", marginBottom: "6px" }} />}
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.companyName || "Business Name"}</p>
              <p style={{ fontSize: "10px", color: "#6B7280" }}>{form.companyCity}, {companyState?.name}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: accent, margin: 0 }}>PAYMENT VOUCHER</p>
              <p style={{ fontSize: "11px", color: "#6B7280" }}>#{form.voucherNumber}</p>
            </div>
          </div>
          <div style={{ height: "4px", background: accent, borderRadius: "2px" }} />
        </div>
        {sharedBody}
      </div>
    );
  }

  // Classic — Colored Banner
  if (template === "Classic") {
    return (
      <div className="pdf-preview">
        <div style={{ background: accent, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
          <div>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", margin: 0 }}>{form.companyName || "Business Name"}</p>
            <p style={{ fontSize: "10px", opacity: 0.8 }}>{form.companyAddress}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", margin: 0 }}>PAYMENT VOUCHER</p>
            <p style={{ fontSize: "11px", opacity: 0.8 }}>#{form.voucherNumber}</p>
          </div>
        </div>
        {sharedBody}
      </div>
    );
  }

  // Minimal (Default)
  return (
    <div className="pdf-preview">
      <div className="pdf-header" style={{ borderBottom: `2px solid ${accent}` }}>
        <div>
          {form.logo && (
            <img src={form.logo} alt="Logo"
              style={{
                height: "48px", objectFit: "contain",
                marginBottom: "8px", display: "block"
              }} />
          )}
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
            fontSize: "16px", color: "#111827", margin: 0
          }}>
            {form.companyName || "Your Company Name"}
          </p>
          {form.companyAddress && (
            <p style={{
              fontSize: "11px", color: "#6B7280",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              {form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}
            </p>
          )}
          {companyState && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
              {companyState.name}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800,
            fontSize: "22px", color: accent, margin: 0
          }}>PAYMENT VOUCHER</p>
          <p style={{
            fontSize: "12px", color: "#6B7280",
            margin: "4px 0 0", fontFamily: "Inter, sans-serif"
          }}>
            #{form.voucherNumber}
          </p>
          <p style={{
            fontSize: "11px", color: "#9CA3AF",
            margin: "4px 0 0", fontFamily: "Inter, sans-serif"
          }}>
            Date: {form.voucherDate}
          </p>
        </div>
      </div>
      {sharedBody}
    </div>
  );
}

export default function PaymentVoucherPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const router = useRouter();
  const plan = user?.plan?.toUpperCase() || "FREE";
  useProfileSync(form, setForm, plan, { fromName: "companyName", fromAddress: "companyAddress", fromCity: "companyCity", fromState: "companyState", fromPhone: "companyPhone", fromEmail: "companyEmail" });
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";
  const [template, setTemplate] = useState("Classic");
  const templateMeta = TEMPLATE_REGISTRY.voucher[template] || TEMPLATE_REGISTRY.voucher.Classic;
  const showWatermark = templateMeta.pro && !isUserPro;

  const handleDownload = () => {
    download("voucher", template, form, `Voucher-${form.voucherNumber}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ 
        docType: "payment-voucher", 
        title: "Voucher #" + form.voucherNumber, 
        referenceNumber: form.voucherNumber, 
        templateName: template,
        partyName: form.paidTo, 
        amount: form.amount, 
        formData: JSON.stringify(form) 
      });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const [activeTab, setActiveTab] = useState("company");
  const [sigModalType, setSigModalType] = useState(null); // 'prepared' or 'approved'
  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "company", label: "Company" },
    { id: "payment", label: "Payment" },
    { id: "extra", label: "Settings" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 24px"
      }}>
        <div style={{
          maxWidth: "1300px", margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px"
        }}>
          <div>
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif", fontSize: "18px",
              fontWeight: 700, margin: 0, color: "#111827"
            }}>
              Payment Voucher Generator
            </h1>
            <p style={{
              fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0",
              fontFamily: "Inter, sans-serif"
            }}>Internal payment records</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              height: "36px", padding: "0 14px", border: "1px solid #E5E7EB",
              borderRadius: "8px", background: "#fff", fontSize: "13px",
              fontWeight: 600, color: "#6B7280", cursor: "pointer",
              fontFamily: "Inter, sans-serif"
            }}>
              <RefreshCw size={13} /> Reset
            </button>
            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">

              <Download size={15} />

              {downloading ? "Generating..." : "Download PDF"}

            </button>
            {user && isUserPro && (
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
            <div className="tab-bar" style={{
              display: "flex", gap: "4px", marginBottom: "20px",
              background: "#F0F4F3", borderRadius: "8px", padding: "4px"
            }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  flex: 1, padding: "6px 4px", borderRadius: "6px",
                  border: "none", fontSize: "12px", fontWeight: 600,
                  cursor: "pointer", fontFamily: "Inter, sans-serif",
                  background: activeTab === tab.id ? "#fff" : "transparent",
                  color: activeTab === tab.id ? T : "#6B7280",
                  boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "company" && (
              <div>
                <p className="form-label">Company Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{
                    fontSize: "11px", fontWeight: 600, color: "#6B7280",
                    margin: "0 0 6px", fontFamily: "Inter, sans-serif"
                  }}>Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field"><label className="field-label">Company Name *</label>
                  <input className="doc-input" placeholder="Company Pvt. Ltd."
                    value={form.companyName}
                    onChange={e => updateField("companyName", e.target.value)} />
                </div>
                <div className="form-field"><label className="field-label">Address</label>
                  <textarea className="doc-textarea" value={form.companyAddress || ""}
                    onChange={e => updateField("companyAddress", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Mumbai" value={form.companyCity || ""} onChange={e => updateField("companyCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label>
                    <select className="doc-select" value={form.companyState || "27"} onChange={e => updateField("companyState", e.target.value)}>
                      {INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.companyPhone || ""} onChange={e => updateField("companyPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="you@company.com" value={form.companyEmail || ""} onChange={e => updateField("companyEmail", e.target.value)} /></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Voucher Number</label>
                    <input className="doc-input" value={form.voucherNumber}
                      onChange={e => updateField("voucherNumber", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Date</label>
                    <input className="doc-input" type="date" value={form.voucherDate}
                      onChange={e => updateField("voucherDate", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div>
                <p className="form-label">Payment Details</p>
                <div className="form-field"><label className="field-label">Paid To *</label>
                  <input className="doc-input" placeholder="Payee name / company"
                    value={form.paidTo}
                    onChange={e => updateField("paidTo", e.target.value)} />
                </div>
                <div className="form-field"><label className="field-label">Payee Address</label>
                  <textarea className="doc-textarea"
                    value={form.paidToAddress || ""}
                    onChange={e => updateField("paidToAddress", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Delhi" value={form.paidToCity || ""} onChange={e => updateField("paidToCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label>
                    <select className="doc-select" value={form.paidToState || "27"} onChange={e => updateField("paidToState", e.target.value)}>
                      {INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.paidToPhone || ""} onChange={e => updateField("paidToPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="payee@company.com" value={form.paidToEmail || ""} onChange={e => updateField("paidToEmail", e.target.value)} /></div>
                </div>
                <div className="form-field">
                  <label className="field-label">Amount (₹) *</label>
                  <input className="doc-input" type="number" placeholder="0.00"
                    value={form.amount || ""}
                    onChange={e => {
                      if (e.target.value.length <= 15) {
                        updateField("amount", e.target.value);
                      }
                    }}
                    style={{
                      fontSize: "16px", fontWeight: 700,
                      color: T, fontFamily: "Space Grotesk, sans-serif"
                    }} />
                </div>
                <div className="form-field">
                  <label className="field-label">Payment Mode</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {PAYMENT_MODES.map(mode => (
                      <button key={mode}
                        onClick={() => updateField("paymentMode", mode)}
                        className={`toggle-btn ${form.paymentMode === mode ? "active" : ""}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                {form.paymentMode === "Cheque" && (
                  <div>
                    <div className="form-row">
                      <div className="form-field" style={{ marginBottom: 0 }}>
                        <label className="field-label">Cheque Number</label>
                        <input className="doc-input" placeholder="123456"
                          value={form.chequeNumber}
                          onChange={e => updateField("chequeNumber", e.target.value)} />
                      </div>
                      <div className="form-field" style={{ marginBottom: 0 }}>
                        <label className="field-label">Cheque Date</label>
                        <input className="doc-input" type="date"
                          value={form.chequeDate}
                          onChange={e => updateField("chequeDate", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-field" style={{ marginTop: "10px" }}>
                      <label className="field-label">Bank Name</label>
                      <input className="doc-input" placeholder="HDFC Bank"
                        value={form.bankName}
                        onChange={e => updateField("bankName", e.target.value)} />
                    </div>
                  </div>
                )}
                <div className="form-field"><label className="field-label">Purpose *</label>
                  <input className="doc-input"
                    placeholder="e.g. Office supplies, Salary advance"
                    value={form.purpose}
                    onChange={e => updateField("purpose", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Account Head</label>
                  <select className="doc-select" value={form.accountHead}
                    onChange={e => updateField("accountHead", e.target.value)}>
                    <option value="">Select...</option>
                    {ACCOUNT_HEADS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="form-field"><label className="field-label">Description</label>
                  <textarea className="doc-textarea"
                    placeholder="Additional details..."
                    value={form.narration}
                    onChange={e => updateField("narration", e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "extra" && (
              <div>
                <p className="form-label">Signatories</p>
                <div className="form-field"><label className="field-label">Prepared By</label>
                  <input className="doc-input" placeholder="Name"
                    value={form.preparedBy}
                    onChange={e => updateField("preparedBy", e.target.value)} />
                </div>
                <div className="form-field"><label className="field-label">Approved By</label>
                  <input className="doc-input" placeholder="Manager / Director"
                    value={form.approvedBy}
                    onChange={e => updateField("approvedBy", e.target.value)} />
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="field-label">Prepared By Sign</label>
                    <div style={{ border: "1px solid #E5E7EB", borderRadius: "10px", padding: "12px", background: "#fff" }}>
                      {form.signaturePrepared ? (
                        <div style={{ textAlign: "center" }}>
                          <img src={form.signaturePrepared} alt="Prepared By" style={{ height: "45px", maxWidth: "100%", objectFit: "contain" }} />
                          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "8px" }}>
                            <button onClick={() => setSigModalType('prepared')} style={{ fontSize: "11px", fontWeight: 600, color: T }}>Change</button>
                            <button onClick={() => updateField("signaturePrepared", null)} style={{ fontSize: "11px", fontWeight: 600, color: "#EF4444" }}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setSigModalType('prepared')} style={{
                          width: "100%", padding: "20px 10px", display: "flex", flexDirection: "column",
                          alignItems: "center", gap: "8px", background: "#F9FAFB", border: "1px dashed #D1D5DB",
                          borderRadius: "8px", cursor: "pointer"
                        }}>
                          <PenTool size={16} color="#9CA3AF" />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>Sign</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Approved By Sign</label>
                    <div style={{ border: "1px solid #E5E7EB", borderRadius: "10px", padding: "12px", background: "#fff" }}>
                      {form.signatureApproved ? (
                        <div style={{ textAlign: "center" }}>
                          <img src={form.signatureApproved} alt="Approved By" style={{ height: "45px", maxWidth: "100%", objectFit: "contain" }} />
                          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "8px" }}>
                            <button onClick={() => setSigModalType('approved')} style={{ fontSize: "11px", fontWeight: 600, color: T }}>Change</button>
                            <button onClick={() => updateField("signatureApproved", null)} style={{ fontSize: "11px", fontWeight: 600, color: "#EF4444" }}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setSigModalType('approved')} style={{
                          width: "100%", padding: "20px 10px", display: "flex", flexDirection: "column",
                          alignItems: "center", gap: "8px", background: "#F9FAFB", border: "1px dashed #D1D5DB",
                          borderRadius: "8px", cursor: "pointer"
                        }}>
                          <PenTool size={16} color="#9CA3AF" />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>Sign</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <TemplatePicker 
                  docType="voucher" 
                  selected={template} 
                  onChange={(val) => setTemplate(val)} 
                  isPro={isUserPro} 
                />
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />
                <TemplateColorPicker 
                  value={form.templateColor || "#0D9488"} 
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
              <VoucherPreview form={form} template={template} accent={form.templateColor || "#0D9488"} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_VOUCHER" />
        </div>
      </div>
      <Footer />
      <SignatureModal
        isOpen={sigModalType !== null}
        onClose={() => setSigModalType(null)}
        onSave={(sig) => {
          if (sigModalType === 'prepared') updateField("signaturePrepared", sig);
          else if (sigModalType === 'approved') updateField("signatureApproved", sig);
          setSigModalType(null);
        }}
      />
    </>
  );
}