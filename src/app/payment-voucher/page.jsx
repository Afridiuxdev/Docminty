"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { Download, Eye, RefreshCw } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";

const T = "#0D9488";

const DEFAULT_FORM = {
  voucherNumber: `PV-${new Date().getFullYear()}-001`,
  voucherDate: new Date().toISOString().split("T")[0],
  companyName: "", companyAddress: "",
  logo: null,
  paidTo: "", paidToAddress: "",
  amount: "",
  paymentMode: "Bank Transfer",
  bankName: "", chequeNumber: "", chequeDate: "",
  purpose: "",
  accountHead: "",
  narration: "",
  preparedBy: "", approvedBy: "",
};

const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "UPI", "NEFT", "RTGS"];
const ACCOUNT_HEADS = [
  "Office Expenses", "Travel Expenses", "Salary", "Rent",
  "Utilities", "Vendor Payment", "Contractor Payment",
  "Advance", "Miscellaneous",
];

function VoucherPreview({ form }) {
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

  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div>
          {form.logo && <img src={form.logo} alt="Logo"
            style={{
              height: "48px", objectFit: "contain",
              marginBottom: "8px", display: "block"
            }} />}
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
            fontSize: "16px", color: "#111827", margin: 0
          }}>
            {form.companyName || "Company Name"}
          </p>
          {form.companyAddress && (
            <p style={{
              fontSize: "11px", color: "#6B7280", margin: "2px 0 0",
              fontFamily: "Inter, sans-serif"
            }}>{form.companyAddress}</p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800,
            fontSize: "20px", color: T, margin: 0
          }}>PAYMENT VOUCHER</p>
          <p style={{
            fontSize: "12px", color: "#6B7280", margin: "4px 0 0",
            fontFamily: "Inter, sans-serif"
          }}>#{form.voucherNumber}</p>
          <p style={{
            fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0",
            fontFamily: "Inter, sans-serif"
          }}>Date: {form.voucherDate}</p>
        </div>
      </div>

      <div className="pdf-body">
        {/* Amount highlight */}
        <div style={{
          background: "#F0FDFA", border: `2px solid ${T}`,
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
              fontSize: "28px", color: T, margin: 0, lineHeight: 1
            }}>
              ₹{amount ? amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{
              background: T, color: "#fff",
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
            {form.paidToAddress && (
              <tr>
                <td style={{ fontWeight: 600, color: "#6B7280" }}>Address</td>
                <td>{form.paidToAddress}</td>
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
                <td style={{ fontWeight: 600, color: "#6B7280" }}>Narration</td>
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
            ["Prepared By", form.preparedBy || "—"],
            ["Approved By", form.approvedBy || "—"],
            ["Received By", ""],
          ].map(([label, name]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                borderTop: "1px solid #374151",
                paddingTop: "6px",
              }}>
                {name && <p style={{
                  fontSize: "12px", fontWeight: 600,
                  color: "#111827", margin: "0 0 2px",
                  fontFamily: "Space Grotesk, sans-serif"
                }}>{name}</p>}
                <p style={{
                  fontSize: "10px", color: "#9CA3AF",
                  fontFamily: "Inter, sans-serif", margin: 0
                }}>{label}</p>
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
    </div>
  );
}

export default function PaymentVoucherPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const handleDownload = () => download("PaymentVoucher", form, `Voucher-${form.voucherNumber}.pdf`);
  const [activeTab, setActiveTab] = useState("company");
  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "company", label: "Company" },
    { id: "payment", label: "Payment" },
    { id: "extra", label: "Settings" },
  ];

  return (
    <>
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
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div style={{
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
                  <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                </div>
                <div className="form-field"><label className="field-label">Company Name *</label>
                  <input className="doc-input" placeholder="Company Pvt. Ltd."
                    value={form.companyName}
                    onChange={e => updateField("companyName", e.target.value)} />
                </div>
                <div className="form-field"><label className="field-label">Address</label>
                  <textarea className="doc-textarea" value={form.companyAddress}
                    onChange={e => updateField("companyAddress", e.target.value)} />
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
                    value={form.paidToAddress}
                    onChange={e => updateField("paidToAddress", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Amount (₹) *</label>
                  <input className="doc-input" type="number" placeholder="0.00"
                    value={form.amount}
                    onChange={e => updateField("amount", e.target.value)}
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
                <div className="form-field"><label className="field-label">Narration</label>
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
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">

                  <Download size={15} />

                  {downloading ? "Generating..." : "Download PDF"}

                </button>
              </div>
            )}
          </div>

          <div className="preview-panel">
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={14} color="#9CA3AF" />
                <span style={{
                  fontSize: "12px", color: "#9CA3AF",
                  fontFamily: "Inter, sans-serif", fontWeight: 600
                }}>LIVE PREVIEW</span>
              </div>
              <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">

                <Download size={15} />

                {downloading ? "Generating..." : "Download PDF"}

              </button>
            </div>
            <VoucherPreview form={form} />
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_VOUCHER" />
        </div>
      </div>
      <Footer />
    </>
  );
}