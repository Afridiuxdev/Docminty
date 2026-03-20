"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { Download, Eye, RefreshCw } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";

const T = "#0D9488";

const MONTHS = ["January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December"];

const DEFAULT_FORM = {
  receiptNumber: `RNT-${new Date().getFullYear()}-001`,
  month: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear().toString(),
  receiptDate: new Date().toISOString().split("T")[0],
  landlordName: "", landlordPan: "", landlordAddress: "",
  tenantName: "",
  propertyAddress: "",
  rentAmount: "",
  paymentMode: "Bank Transfer",
  logo: null,
};

const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "UPI", "NEFT", "RTGS"];

function RentPreview({ form }) {
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

  const amount = parseFloat(form.rentAmount) || 0;

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
            fontSize: "16px", color: T, margin: 0
          }}>RENT RECEIPT</p>
          <p style={{
            fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0",
            fontFamily: "Inter, sans-serif"
          }}>#{form.receiptNumber}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{
            fontSize: "14px", fontWeight: 700, color: "#111827",
            margin: 0, fontFamily: "Space Grotesk, sans-serif"
          }}>
            {form.month} {form.year}
          </p>
          <p style={{
            fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0",
            fontFamily: "Inter, sans-serif"
          }}>Date: {form.receiptDate}</p>
        </div>
      </div>

      <div className="pdf-body">
        {/* Big amount */}
        <div style={{
          background: "#F0FDFA", border: `2px solid ${T}`,
          borderRadius: "10px", padding: "20px 24px",
          textAlign: "center", marginBottom: "20px",
        }}>
          <p style={{
            fontSize: "11px", color: "#6B7280", margin: "0 0 4px",
            fontFamily: "Inter, sans-serif", textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}>Rent Amount</p>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800,
            fontSize: "36px", color: T, margin: 0, lineHeight: 1
          }}>
            ₹{amount ? amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
          </p>
          <p style={{
            fontSize: "12px", color: "#374151", margin: "8px 0 0",
            fontFamily: "Inter, sans-serif", fontStyle: "italic"
          }}>
            {numToWords(amount)}
          </p>
        </div>

        <table className="pdf-table">
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280", width: "40%" }}>
                Received From (Tenant)
              </td>
              <td>{form.tenantName || "—"}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>
                Rent Period
              </td>
              <td><strong style={{ color: T }}>{form.month} {form.year}</strong></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Property Address</td>
              <td>{form.propertyAddress || "—"}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: "#6B7280" }}>Payment Mode</td>
              <td>
                <span style={{
                  background: "#F0FDFA", color: T,
                  padding: "2px 8px", borderRadius: "4px",
                  fontSize: "11px", fontWeight: 600,
                }}>
                  {form.paymentMode}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{
          marginTop: "32px", paddingTop: "16px",
          borderTop: "1px solid #E5E7EB", display: "flex",
          justifyContent: "space-between", alignItems: "flex-end"
        }}>
          <div>
            <p style={{
              fontSize: "12px", fontWeight: 700, color: "#111827",
              margin: 0, fontFamily: "Space Grotesk, sans-serif"
            }}>
              {form.landlordName || "Landlord Name"}
            </p>
            {form.landlordPan && (
              <p style={{
                fontSize: "11px", color: "#6B7280", margin: "2px 0 0",
                fontFamily: "Inter, sans-serif"
              }}>PAN: {form.landlordPan}</p>
            )}
            {form.landlordAddress && (
              <p style={{
                fontSize: "11px", color: "#6B7280", margin: "2px 0 0",
                fontFamily: "Inter, sans-serif"
              }}>{form.landlordAddress}</p>
            )}
          </div>
          <div style={{
            borderTop: "1px solid #374151", paddingTop: "6px",
            minWidth: "120px", textAlign: "center"
          }}>
            <p style={{
              fontSize: "10px", color: "#9CA3AF",
              fontFamily: "Inter, sans-serif", margin: 0
            }}>
              Landlord Signature
            </p>
          </div>
        </div>

        <p style={{
          fontSize: "10px", color: "#D1D5DB",
          fontFamily: "Inter, sans-serif", margin: "16px 0 0",
          borderTop: "1px solid #E5E7EB", paddingTop: "10px"
        }}>
          Generated by DocMinty.com
        </p>
      </div>
    </div>
  );
}

export default function RentReceiptPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const handleDownload = () => download("RentReceipt", form, `RentReceipt-${form.month}-${form.year}.pdf`);
  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

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
            }}>Rent Receipt Generator</h1>
            <p style={{
              fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0",
              fontFamily: "Inter, sans-serif"
            }}>
              Monthly rent receipt for HRA exemption
            </p>
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
            <p className="form-label">Landlord Details</p>
            <div style={{ marginBottom: "16px" }}>
              <p style={{
                fontSize: "11px", fontWeight: 600, color: "#6B7280",
                margin: "0 0 6px", fontFamily: "Inter, sans-serif"
              }}>Logo (optional)</p>
              <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
            </div>
            <div className="form-field"><label className="field-label">Landlord Name *</label>
              <input className="doc-input" placeholder="Full Name"
                value={form.landlordName}
                onChange={e => updateField("landlordName", e.target.value)} />
            </div>
            <div className="form-field"><label className="field-label">Landlord PAN</label>
              <input className="doc-input" placeholder="ABCDE1234F"
                value={form.landlordPan}
                onChange={e => updateField("landlordPan", e.target.value.toUpperCase())}
                style={{ fontFamily: "monospace" }} />
            </div>
            <div className="form-field"><label className="field-label">Landlord Address</label>
              <textarea className="doc-textarea"
                placeholder="Landlord's address"
                value={form.landlordAddress}
                onChange={e => updateField("landlordAddress", e.target.value)} />
            </div>

            <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
            <p className="form-label">Rent Details</p>

            <div className="form-field"><label className="field-label">Tenant Name *</label>
              <input className="doc-input" placeholder="Tenant Full Name"
                value={form.tenantName}
                onChange={e => updateField("tenantName", e.target.value)} />
            </div>
            <div className="form-field"><label className="field-label">Property Address *</label>
              <textarea className="doc-textarea"
                placeholder="Full property address"
                value={form.propertyAddress}
                onChange={e => updateField("propertyAddress", e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Rent Amount (₹) *</label>
              <input className="doc-input" type="number" placeholder="15000"
                value={form.rentAmount}
                onChange={e => updateField("rentAmount", e.target.value)}
                style={{
                  fontSize: "16px", fontWeight: 700,
                  color: T, fontFamily: "Space Grotesk, sans-serif"
                }} />
            </div>

            <div className="form-row">
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="field-label">Month</label>
                <select className="doc-select" value={form.month}
                  onChange={e => updateField("month", e.target.value)}>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="field-label">Year</label>
                <select className="doc-select" value={form.year}
                  onChange={e => updateField("year", e.target.value)}>
                  {["2023", "2024", "2025", "2026", "2027"].map(y =>
                    <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="form-field" style={{ marginTop: "10px" }}>
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

            <div className="form-row" style={{ marginTop: "10px" }}>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="field-label">Receipt Number</label>
                <input className="doc-input" value={form.receiptNumber}
                  onChange={e => updateField("receiptNumber", e.target.value)} />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="field-label">Receipt Date</label>
                <input className="doc-input" type="date" value={form.receiptDate}
                  onChange={e => updateField("receiptDate", e.target.value)} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">

              <Download size={15} />

              {downloading ? "Generating..." : "Download PDF"}

            </button>
            <p style={{
              fontSize: "11px", color: "#9CA3AF",
              textAlign: "center", margin: "8px 0 0",
              fontFamily: "Inter, sans-serif"
            }}>
              Valid for HRA exemption claim
            </p>
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
            <RentPreview form={form} />
          </div>
        </div>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_RENT" />
        </div>
      </div>
      <Footer />
    </>
  );
}