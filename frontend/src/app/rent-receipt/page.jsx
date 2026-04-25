"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { Download, RefreshCw, Eye, Cloud, PenTool } from "lucide-react";
import SignatureModal from "@/components/SignatureModal";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import { INDIAN_STATES } from "@/constants/indianStates";
import { useProfileSync } from "@/hooks/useProfileSync";

const T = "#0D9488";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "UPI", "NEFT", "RTGS"];

const DEFAULT_FORM = {
  receiptNumber: "RNT-" + new Date().getFullYear() + "-001",
  month: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear().toString(),
  receiptDate: new Date().toISOString().split("T")[0],
  landlordName: "", landlordPan: "", landlordAddress: "", landlordCity: "", landlordState: "27", landlordPhone: "", landlordEmail: "",
  tenantName: "", propertyAddress: "", tenantCity: "", tenantState: "27", tenantPhone: "", tenantEmail: "",
  rentAmount: "", paymentMode: "Bank Transfer",
  logo: null,
  signature: null,
  templateColor: "#0D9488",
};

function numToWords(n) {
  if (!n || n === 0) return "Zero Rupees Only";
  var ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function convert(num) {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
    return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
  }
  return "Rupees " + convert(Math.floor(n)) + " Only";
}

export function RentPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const amount = parseFloat(form.rentAmount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const landlordState = INDIAN_STATES.find(s => s.code === form.landlordState);
  const tenantState = INDIAN_STATES.find(s => s.code === form.tenantState);

  const sharedBody = (
    <div className="pdf-body">
      <div style={{ background: accent + "10", border: "2px solid " + accent, borderRadius: "8px", padding: "16px 20px", textAlign: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>Rent Amount</p>
        <p style={{ fontSize: "28px", fontWeight: 800, color: accent, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>{"Rs. " + amtFmt}</p>
        <p style={{ fontSize: "11px", color: "#374151", fontStyle: "italic", margin: 0, fontFamily: "Inter, sans-serif" }}>{numToWords(amount)}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 6px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Received From (Tenant)</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>{form.tenantName || "—"}</p>
          {form.propertyAddress && <p style={{ fontSize: "11px", color: "#4B5563", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>{form.propertyAddress}</p>}
          {(form.tenantCity || form.tenantState) && <p style={{ fontSize: "11px", color: "#4B5563", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>{form.tenantCity ? form.tenantCity + ", " : ""}{tenantState?.name || ""}</p>}
          {(form.tenantPhone || form.tenantEmail) && (
            <p style={{ fontSize: "11px", color: "#4B5563", margin: "6px 0 0", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
              {form.tenantPhone && <span style={{ display: "block" }}>Ph: {form.tenantPhone}</span>}
              {form.tenantEmail && <span style={{ display: "block" }}>Em: {form.tenantEmail}</span>}
            </p>
          )}
        </div>
        
        <div>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 6px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Landlord Details</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>{form.landlordName || "—"}</p>
          {form.landlordAddress && <p style={{ fontSize: "11px", color: "#4B5563", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>{form.landlordAddress}</p>}
          {(form.landlordCity || form.landlordState) && <p style={{ fontSize: "11px", color: "#4B5563", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>{form.landlordCity ? form.landlordCity + ", " : ""}{landlordState?.name || ""}</p>}
          {(form.landlordPhone || form.landlordEmail) && (
            <p style={{ fontSize: "11px", color: "#4B5563", margin: "6px 0 0", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
              {form.landlordPhone && <span style={{ display: "block" }}>Ph: {form.landlordPhone}</span>}
              {form.landlordEmail && <span style={{ display: "block" }}>Em: {form.landlordEmail}</span>}
            </p>
          )}
          {form.landlordPan && <p style={{ fontSize: "11px", color: "#111827", margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>PAN: {form.landlordPan}</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", padding: "12px 0", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", display: "block", marginBottom: "2px" }}>Rent Period</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{form.month + " " + form.year}</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", display: "block", marginBottom: "2px" }}>Payment Mode</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{form.paymentMode || "—"}</span>
          </div>
      </div>
      <div style={{ marginTop: "16px", padding: "8px 12px", background: accent + "08", borderLeft: "3px solid " + accent }}>
        <p style={{ fontSize: "10px", color: accent, fontFamily: "Inter, sans-serif", margin: 0 }}>Valid for HRA exemption claim under Section 10(13A)</p>
      </div>
      <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
        {form.signature && (
          <div style={{ textAlign: "center" }}>
            <img src={form.signature} alt="Signature" style={{ height: "40px", marginBottom: "4px" }} />
            <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0 }}>Landlord Signature</p>
          </div>
        )}
      </div>
    </div>
  );

  // Modern — Sidebar
  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", flexDirection: "row", padding: 0, overflow: "hidden" }}>
        <div style={{ width: "140px", background: accent, padding: "24px 14px", flexShrink: 0, color: "#fff", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>RECEIPT</p>
          <p style={{ fontSize: "10px", opacity: 0.75, margin: "0 0 24px" }}>#{form.receiptNumber}</p>
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Landlord</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 4px" }}>{form.landlordName || "—"}</p>
          <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 4px", lineHeight: 1.4 }}>
            {form.landlordAddress} {form.landlordCity && `${form.landlordCity}, `} {landlordState?.name}
          </p>
          {(form.landlordPhone || form.landlordEmail) && (
            <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 16px", lineHeight: 1.4 }}>
              {form.landlordPhone && `Ph: ${form.landlordPhone}`}{form.landlordPhone && form.landlordEmail ? " | " : ""}{form.landlordEmail && `Em: ${form.landlordEmail}`}
            </p>
          )}
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Tenant</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 16px" }}>{form.tenantName || "Recipient"}</p>
          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Rent Amount</p>
            <p style={{ fontSize: "12px", fontWeight: 700, margin: 0 }}>₹{amount.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain" }} />}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0 }}>Period: {form.month} {form.year}</p>
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
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: accent, margin: "0 0 2px" }}>RENT RECEIPT</p>
          <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 8px", maxWidth: "400px" }}>{form.propertyAddress}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "10px", color: "#9CA3AF", fontWeight: 700 }}>
            <span>RECEIPT: #{form.receiptNumber}</span>
            <span>PERIOD: {form.month} {form.year}</span>
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
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.landlordName || "Landlord"}</p>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>{form.landlordAddress}{form.landlordCity ? `, ${form.landlordCity}` : ""}{landlordState?.name ? `, ${landlordState.name}` : ""}</p>
              {(form.landlordPhone || form.landlordEmail) && (
                <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>{form.landlordPhone && `Ph: ${form.landlordPhone}`}{form.landlordPhone && form.landlordEmail ? "  |  " : ""}{form.landlordEmail && `Em: ${form.landlordEmail}`}</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: accent, margin: 0 }}>RENT RECEIPT</p>
              <p style={{ fontSize: "11px", color: "#6B7280" }}>#{form.receiptNumber}</p>
            </div>
          </div>
          <div style={{ height: "4px", background: accent, borderRadius: "2px" }} />
        </div>
        {sharedBody}
      </div>
    );
  }

  // Classic/Minimal (Default)
  return (
    <div className="pdf-preview">
      <div className="pdf-header" style={{ borderBottom: `2px solid ${accent}` }}>
        <div>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: accent, margin: 0 }}>RENT RECEIPT</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{"#" + form.receiptNumber}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{form.month + " " + form.year}</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{"Date: " + form.receiptDate}</p>
        </div>
      </div>
      {sharedBody}
    </div>
  );
}

export default function RentReceiptPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const raw = localStorage.getItem("docminty_draft");
      if (!raw) return DEFAULT_FORM;
      const saved = JSON.parse(raw);
      const { _docTemplate, docId, editMode, viewMode, autoDownload, ...formData } = saved;
      return { ...DEFAULT_FORM, ...formData };
    } catch { return DEFAULT_FORM; }
  });
  const { download, generateBlob, downloading } = useDownloadPDF();
  const [activeTab, setActiveTab] = useState("landlord");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [template, setTemplate] = useState(() => {
    if (typeof window === "undefined") return "Classic";
    try {
      const raw = localStorage.getItem("docminty_draft");
      if (!raw) return "Classic";
      const saved = JSON.parse(raw);
      localStorage.removeItem("docminty_draft");
      return saved._docTemplate || "Classic";
    } catch { return "Classic"; }
  });
  const router = useRouter();
  const plan = user?.plan?.toUpperCase() || "FREE";
  useProfileSync(form, setForm, plan, { fromName: "landlordName", fromAddress: "landlordAddress", fromCity: "landlordCity", fromState: "landlordState", fromPhone: "landlordPhone", fromEmail: "landlordEmail" });
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";
  const handleDownload = () => {
    download("rent", template, form, `RentReceipt-${form.month}-${form.year}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    const payload = { docType: "rent-receipt", title: `Rent Receipt #${form.receiptNumber}`, referenceNumber: form.receiptNumber, templateName: template, partyName: form.tenantName, amount: form.rentAmount, formData: JSON.stringify(form) };
    try {
      const pendingToast = toast.loading("Saving document...");
      payload.file = await generateBlob("rent", template, form, `RentReceipt-${form.month}-${form.year}.pdf`);
      await documentsApi.save(payload);
      toast.dismiss(pendingToast);
      toast.success("Saved to your dashboard!");
    } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "landlord", label: "Landlord" },
    { id: "tenant", label: "Tenant" },
    { id: "payment", label: "Payment" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Rent Receipt Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>HRA valid rent receipts for tax exemption</p>
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
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{tab.label}</button>
              ))}
            </div>

            {activeTab === "landlord" && (
              <div>
                <p className="form-label">Landlord Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field"><label className="field-label">Landlord Name</label><input className="doc-input" placeholder="Ramesh Verma" value={form.landlordName} onChange={e => updateField("landlordName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Landlord PAN <span style={{ color: T, fontSize: "11px" }}>Required for HRA &gt; 1L/year</span></label><input className="doc-input" placeholder="ABCDE1234F" value={form.landlordPan} onChange={e => updateField("landlordPan", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())} maxLength={10} /></div>
                <div className="form-field"><label className="field-label">Landlord Address</label><input className="doc-input" placeholder="123 MG Road, Mumbai" value={form.landlordAddress} onChange={e => updateField("landlordAddress", e.target.value)} /></div>
                
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Mumbai" value={form.landlordCity || ""} onChange={e => updateField("landlordCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label>
                    <select className="doc-select" value={form.landlordState || "27"} onChange={e => updateField("landlordState", e.target.value)}>
                      {INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.landlordPhone || ""} onChange={e => updateField("landlordPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="landlord@company.com" value={form.landlordEmail || ""} onChange={e => updateField("landlordEmail", e.target.value)} /></div>
                </div>
                
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Digital Signature</p>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  {form.signature ? (
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <div style={{ padding: "12px", background: "#F9FAFB", borderRadius: "8px", border: "1px dashed #D1D5DB", display: "inline-block" }}>
                        <img src={form.signature} alt="Sig" style={{ height: "50px" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "10px" }}>
                        <button onClick={() => setIsSigModalOpen(true)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", background: "#fff", fontSize: "12px" }}>Change</button>
                        <button onClick={() => updateField("signature", null)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FEE2E2", background: "#FEF2F2", fontSize: "12px", color: "#EF4444" }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsSigModalOpen(true)} style={{ width: "100%", padding: "20px", background: "#F9FAFB", border: "1px dashed #D1D5DB", borderRadius: "8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <PenTool size={20} color="#9CA3AF" />
                      <span style={{ fontSize: "13px", color: "#6B7280" }}>Click to add signature</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "tenant" && (
              <div>
                <p className="form-label">Tenant Details</p>
                <div className="form-field"><label className="field-label">Tenant Name (First name, Last name)</label><input className="doc-input" placeholder="Priya Sharma" value={form.tenantName} onChange={e => updateField("tenantName", e.target.value)} /></div>
                
                <div className="form-row" style={{ marginTop: "10px", marginBottom: "16px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.tenantPhone || ""} onChange={e => updateField("tenantPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="tenant@company.com" value={form.tenantEmail || ""} onChange={e => updateField("tenantEmail", e.target.value)} /></div>
                </div>

                <div className="form-field"><label className="field-label">Property Address</label><input className="doc-input" placeholder="Flat 4B, Green Apartments, Pune" value={form.propertyAddress} onChange={e => updateField("propertyAddress", e.target.value)} /></div>
                
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Delhi" value={form.tenantCity || ""} onChange={e => updateField("tenantCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label>
                    <select className="doc-select" value={form.tenantState || "27"} onChange={e => updateField("tenantState", e.target.value)}>
                      {INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div>
                <p className="form-label">Payment Details</p>
                <div className="form-field"><label className="field-label">Receipt Number</label><input className="doc-input" value={form.receiptNumber} onChange={e => updateField("receiptNumber", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Month</label>
                    <select className="doc-input" value={form.month} onChange={e => updateField("month", e.target.value)} style={{ height: "38px", padding: "0 10px" }}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Year</label><input className="doc-input" placeholder="2026" value={form.year} onChange={e => updateField("year", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "12px" }}><label className="field-label">Rent Amount (Rs.)</label><input className="doc-input" type="number" placeholder="15000" value={form.rentAmount} onChange={e => { if (e.target.value.length <= 15) updateField("rentAmount", e.target.value); }} /></div>
                <div className="form-field"><label className="field-label">Receipt Date</label><input className="doc-input" type="date" value={form.receiptDate} onChange={e => updateField("receiptDate", e.target.value)} /></div>
                <div className="form-field">
                  <label className="field-label">Payment Mode</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {PAYMENT_MODES.map(m => (
                      <button key={m} onClick={() => updateField("paymentMode", m)} className={"toggle-btn " + (form.paymentMode === m ? "active" : "")}>{m}</button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <TemplatePicker 
                  docType="rent" 
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
              <RentPreview form={form} template={template} accent={form.templateColor || "#0D9488"} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_RENT" />
        </div>
      </div>
      <Footer />
      <SignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={sig => updateField("signature", sig)}
      />
    </>
  );
}
