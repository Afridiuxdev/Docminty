"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
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

const T = "#0D9488";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "UPI", "NEFT", "RTGS"];

const DEFAULT_FORM = {
  receiptNumber: "RNT-" + new Date().getFullYear() + "-001",
  month: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear().toString(),
  receiptDate: new Date().toISOString().split("T")[0],
  landlordName: "", landlordPan: "", landlordAddress: "",
  tenantName: "", propertyAddress: "",
  rentAmount: "", paymentMode: "Bank Transfer",
  logo: null,
  signature: null,
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

function RentPreview({ form }) {
  var amount = parseFloat(form.rentAmount) || 0;
  var amtFmt = amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: T, margin: 0 }}>RENT RECEIPT</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{"#" + form.receiptNumber}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{form.month + " " + form.year}</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{"Date: " + form.receiptDate}</p>
        </div>
      </div>
      <div className="pdf-body">
        <div style={{ background: "#F0FDFA", border: "2px solid " + T, borderRadius: "8px", padding: "16px 20px", textAlign: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>Rent Amount</p>
          <p style={{ fontSize: "28px", fontWeight: 800, color: T, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>{"Rs. " + amtFmt}</p>
          <p style={{ fontSize: "11px", color: "#374151", fontStyle: "italic", margin: 0, fontFamily: "Inter, sans-serif" }}>{numToWords(amount)}</p>
        </div>
        {[["Received From (Tenant)", form.tenantName || "-"], ["Rent Period", form.month + " " + form.year], ["Property Address", form.propertyAddress || "-"], ["Payment Mode", form.paymentMode || "-"], ["Landlord Name", form.landlordName || "-"], ["Landlord PAN", form.landlordPan || "-"]].map(function (row) {
          return (
            <div key={row[0]} style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ flex: 1.2, fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{row[0]}</span>
              <span style={{ flex: 2, fontSize: "12px", fontWeight: 600, color: "#111827", fontFamily: "Inter, sans-serif" }}>{row[1]}</span>
            </div>
          );
        })}
        <div style={{ marginTop: "16px", padding: "8px 12px", background: "#F0FDFA", borderLeft: "3px solid " + T }}>
          <p style={{ fontSize: "10px", color: "#065F46", fontFamily: "Inter, sans-serif", margin: 0 }}>Valid for HRA exemption claim under Section 10(13A)</p>
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
    </div>
  );
}

export default function RentReceiptPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [activeTab, setActiveTab] = useState("landlord");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const router = useRouter();
  const handleDownload = () => download("RentReceipt", form, "RentReceipt-" + form.month + "-" + form.year + ".pdf");

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "rent-receipt", title: `Rent Receipt #${form.receiptNumber}`, referenceNumber: form.receiptNumber, partyName: form.tenantName, amount: form.rentAmount, formData: JSON.stringify(form) });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "landlord", label: "Landlord" },
    { id: "tenant", label: "Tenant" },
    { id: "payment", label: "Payment" },
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
            {user && (
<button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}><Cloud size={14} /> Save</button>
)}
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{tab.label}</button>
              ))}
            </div>

            {activeTab === "landlord" && (
              <div>
                <p className="form-label">Landlord Details</p>
                <div style={{ marginBottom: "16px" }}><p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Logo (optional)</p><LogoUpload value={form.logo} onChange={v => updateField("logo", v)} /></div>
                <div className="form-field"><label className="field-label">Landlord Name</label><input className="doc-input" placeholder="Ramesh Verma" value={form.landlordName} onChange={e => updateField("landlordName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Landlord PAN <span style={{ color: T, fontSize: "11px" }}>Required for HRA &gt; 1L/year</span></label><input className="doc-input" placeholder="ABCDE1234F" value={form.landlordPan} onChange={e => updateField("landlordPan", e.target.value.toUpperCase())} /></div>
                <div className="form-field"><label className="field-label">Landlord Address</label><input className="doc-input" placeholder="123 MG Road, Mumbai" value={form.landlordAddress} onChange={e => updateField("landlordAddress", e.target.value)} /></div>
                
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
                <div className="form-field"><label className="field-label">Tenant Name</label><input className="doc-input" placeholder="Priya Sharma" value={form.tenantName} onChange={e => updateField("tenantName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Property Address</label><input className="doc-input" placeholder="Flat 4B, Green Apartments, Pune" value={form.propertyAddress} onChange={e => updateField("propertyAddress", e.target.value)} /></div>
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
                <div className="form-field" style={{ marginTop: "12px" }}><label className="field-label">Rent Amount (Rs.)</label><input className="doc-input" type="number" placeholder="15000" value={form.rentAmount} onChange={e => updateField("rentAmount", e.target.value)} /></div>
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
            <RentPreview form={form} />
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
