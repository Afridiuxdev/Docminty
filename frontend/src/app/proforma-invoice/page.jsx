"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import SignatureModal from "@/components/SignatureModal";
import { Plus, Trash2, Download, Eye, RefreshCw, Cloud, PenTool } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import { useProfileSync } from "@/hooks/useProfileSync";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

const T = "#0D9488";

const DEFAULT_FORM = {
  proformaNumber: `PI-${new Date().getFullYear()}-001`,
  proformaDate: new Date().toISOString().split("T")[0],
  validUntil: "",
  fromName: "", fromGSTIN: "", fromAddress: "",
  fromCity: "", fromState: "27", fromPhone: "", fromEmail: "",
  toName: "", toGSTIN: "", toAddress: "",
  toCity: "", toState: "27", toPhone: "", toEmail: "",
  taxType: "cgst_sgst",
  items: [{
    description: "", hsn: "", qty: "1", rate: "",
    discount: "0", gstRate: "18", amount: "0.00"
  }],
  advancePercent: "50",
  bankName: "", accountNumber: "", ifscCode: "", accountName: "",
  notes: "This is a Proforma Invoice. Actual invoice will be issued after payment.",
  terms: "50% advance payment required to confirm order.",
  signature: null,
  logo: null,
  showHSN: true,
  templateColor: "#0D9488",
};

function ItemRow({ item, index, onChange, onRemove, showHSN, showDiscount }) {
  const update = (field, value) => {
    const updated = { ...item, [field]: value };
    const qty = parseFloat(updated.qty) || 0;
    const rate = parseFloat(updated.rate) || 0;
    const discount = parseFloat(updated.discount) || 0;
    const subtotal = qty * rate - discount;
    const gst = (subtotal * (parseFloat(updated.gstRate) || 0)) / 100;
    updated.amount = (subtotal + gst).toFixed(2);
    onChange(index, updated);
  };

  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px",
      padding: "16px", marginBottom: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", position: "relative"
    }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
          <input className="doc-input" placeholder="Item description" value={item.description} onChange={e => update("description", e.target.value)} style={{ background: "#F9FAFB" }} />
        </div>
        <button onClick={() => onRemove(index)} title="Remove Item" style={{ background: "#FEE2E2", color: "#EF4444", border: "none", width: "36px", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: "18px", transition: "background 150ms" }}>
          <Trash2 size={16} />
        </button>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: showHSN ? (showDiscount ? "repeat(5, 1fr) auto" : "repeat(4, 1fr) auto") : (showDiscount ? "repeat(4, 1fr) auto" : "repeat(3, 1fr) auto"),
        gap: "12px", alignItems: "end"
      }}>
        {showHSN && (
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>HSN</label>
            <input className="doc-input" placeholder="HSN" value={item.hsn} onChange={e => update("hsn", e.target.value)} style={{ background: "#F9FAFB" }} />
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Qty</label>
          <input className="doc-input" type="number" placeholder="1" value={item.qty} onChange={e => update("qty", e.target.value)} style={{ background: "#F9FAFB" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Rate</label>
          <input className="doc-input" type="number" placeholder="0.00" value={item.rate} onChange={e => update("rate", e.target.value)} style={{ background: "#F9FAFB" }} />
        </div>
        {showDiscount && (
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Disc</label>
            <input className="doc-input" type="number" placeholder="0" value={item.discount} onChange={e => update("discount", e.target.value)} style={{ background: "#F9FAFB" }} />
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>GST (%)</label>
          <select className="doc-select" value={item.gstRate} onChange={e => update("gstRate", e.target.value)} style={{ background: "#F9FAFB" }}>
            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
        <div style={{ textAlign: "right", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Amount</span>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "#0D9488", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>₹{item.amount}</span>
        </div>
      </div>
    </div>
  );
}

export function ProformaPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);
  const advanceAmt = (parseFloat(calc.grandTotal) *
    (parseFloat(form.advancePercent) || 0) / 100).toFixed(2);

  const sharedBody = (
    <div className="pdf-body">
      {/* Bill To */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "24px", marginBottom: "20px"
      }}>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: 700, color: "#9CA3AF",
            textTransform: "uppercase", letterSpacing: "0.08em",
            margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif"
          }}>Bill To</p>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
            fontSize: "13px", color: "#111827", margin: 0
          }}>
            {form.toName || "Client Name"}
          </p>
          {form.toGSTIN && (
            <p style={{
              fontSize: "11px", color: "#6B7280",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              GSTIN: {form.toGSTIN}
            </p>
          )}
          {form.toAddress && (
            <p style={{
              fontSize: "11px", color: "#6B7280",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}
            </p>
          )}
          {toState && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
              {toState.name}
            </p>
          )}
          {(form.toPhone || form.toEmail) && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
              {form.toPhone && <span style={{ display: "block" }}>Ph: {form.toPhone}</span>}
              {form.toEmail && <span style={{ display: "block", wordBreak: "break-all" }}>Em: {form.toEmail}</span>}
            </p>
          )}
        </div>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: 700, color: "#9CA3AF",
            textTransform: "uppercase", letterSpacing: "0.08em",
            margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif"
          }}>Tax Type</p>
          <p style={{
            fontSize: "12px", color: "#374151",
            fontFamily: "Inter, sans-serif"
          }}>
            {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" :
              form.taxType === "igst" ? "IGST (Interstate)" : "No Tax"}
          </p>
        </div>
      </div>

      {/* Items table */}
      <table className="pdf-table">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ width: "40%" }}>Description</th>
            {form.showHSN && <th>HSN</th>}
            <th>Qty</th>
            <th>Rate</th>
            <th>GST%</th>
            <th style={{ textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {calc.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.description || "—"}</td>
              {form.showHSN && <td>{item.hsn || "—"}</td>}
              <td>{item.qty}</td>
              <td>₹{item.rate}</td>
              <td>{item.gstRate}%</td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>
                ₹{item.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="pdf-totals">
          <div className="pdf-total-row">
            <span style={{ color: "#6B7280" }}>Subtotal</span>
            <span>₹{calc.subtotal}</span>
          </div>
          {form.taxType === "cgst_sgst" && <>
            <div className="pdf-total-row">
              <span style={{ color: "#6B7280" }}>CGST</span>
              <span>₹{calc.totalCGST}</span>
            </div>
            <div className="pdf-total-row">
              <span style={{ color: "#6B7280" }}>SGST</span>
              <span>₹{calc.totalSGST}</span>
            </div>
          </>}
          {form.taxType === "igst" && (
            <div className="pdf-total-row">
              <span style={{ color: "#6B7280" }}>IGST</span>
              <span>₹{calc.totalIGST}</span>
            </div>
          )}
          <div className="pdf-total-final" style={{ background: accent + "10", color: accent }}>
            <span>Grand Total</span>
            <span>₹{calc.grandTotal}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px", padding: "10px 14px", background: "#F8F9FA", borderRadius: "6px", borderLeft: `3px solid ${accent}` }}>
        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount in Words</p>
        <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>{numberToWords(parseFloat(calc.grandTotal))}</p>
      </div>

      {/* Advance payment box */}
      {(parseFloat(form.advancePercent) > 0 || form.bankName || form.notes || form.terms) && (
        <div style={{
          marginTop: "16px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}>
          <div>
            {parseFloat(form.advancePercent) > 0 && (
              <div style={{
                background: "#FEF9C3",
                border: "1px solid #F59E0B",
                borderRadius: "8px", padding: "12px 16px",
                marginBottom: "12px"
              }}>
                <p style={{
                  fontSize: "11px", color: "#92400E",
                  fontFamily: "Inter, sans-serif", margin: "0 0 4px",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  fontWeight: 600
                }}>
                  Advance Details ({form.advancePercent}%)
                </p>
                <p style={{
                  fontSize: "18px", fontWeight: 800,
                  color: "#92400E", margin: 0,
                  fontFamily: "Space Grotesk, sans-serif"
                }}>
                  ₹{advanceAmt}
                </p>
              </div>
            )}
            {form.bankName && (
              <div style={{
                padding: "10px 14px",
                background: "#f3f4f6",
                borderRadius: "8px",
              }}>
                <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Bank Details</p>
                <p style={{ fontSize: "11px", color: "#374151", margin: "0 0 2px" }}><strong>{form.bankName}</strong></p>
                {form.accountName && <p style={{ fontSize: "11px", color: "#4B5563", margin: "0 0 2px" }}>{form.accountName}</p>}
                <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 2px" }}>Acc: {form.accountNumber}</p>
                <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>IFSC: {form.ifscCode}</p>
              </div>
            )}
          </div>
          <div>
            {form.notes && (
              <div style={{ marginBottom: "12px" }}>
                <p style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Notes</p>
                <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>{form.notes}</p>
              </div>
            )}
            {form.terms && (
              <div>
                <p style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Terms</p>
                <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>{form.terms}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signature */}
      <div style={{
        marginTop: "32px",
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-end"
      }}>
        <p style={{ fontSize: "10px", color: "#D1D5DB" }}>Generated by DocMinty.com</p>
        <div style={{ textAlign: "right" }}>
          {form.signature && <img src={form.signature} alt="Sig" style={{ height: "40px", marginBottom: "4px", display: "block", marginLeft: "auto" }} />}
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px", width: "120px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#111827", margin: 0 }}>Authorized Official</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Modern — Sidebar
  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", padding: 0, overflow: "hidden" }}>
        <div style={{ width: "140px", background: accent, padding: "24px 14px", flexShrink: 0, color: "#fff", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>PROFORMA</p>
          <p style={{ fontSize: "10px", opacity: 0.75, margin: "0 0 24px" }}>#{form.proformaNumber}</p>
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>From</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 4px" }}>{form.fromName || "Your Business"}</p>
          <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 4px", lineHeight: 1.4 }}>
            {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState?.name}
          </p>
          {form.fromGSTIN && <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 4px" }}>GSTIN: {form.fromGSTIN}</p>}
          {(form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 16px", lineHeight: 1.4 }}>
              {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? " | " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
            </p>
          )}
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Bill To</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 16px" }}>{form.toName || "Client Name"}</p>
          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Grand Total</p>
            <p style={{ fontSize: "12px", fontWeight: 700, margin: 0 }}>₹{calc.grandTotal}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain" }} />}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0 }}>Date: {form.proformaDate}</p>
              {form.validUntil && <p style={{ fontSize: "10px", color: "#9CA3AF" }}>Until: {form.validUntil}</p>}
            </div>
          </div>
          {sharedBody}
        </div>
      </div>
    );
  }

  // Corporate — Centered Header
  if (template === "Corporate") {
    return (
      <div className="pdf-preview">
        <div style={{ textAlign: "center", padding: "20px 24px 16px", borderBottom: `2px solid ${accent}` }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", margin: "0 auto 8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: accent, margin: "0 0 2px" }}>{form.fromName || "Company Name"}</p>
          <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 4px", maxWidth: "400px" }}>{form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState?.name}</p>
          {form.fromGSTIN && <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 4px" }}>GSTIN: {form.fromGSTIN}</p>}
          {(form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 8px" }}>
              {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "10px", color: "#9CA3AF", fontWeight: 700 }}>
            <span>PROFORMA: #{form.proformaNumber}</span>
            <span>DATE: {form.proformaDate}</span>
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
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.fromName || "Business Name"}</p>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState?.name ? `, ${fromState.name}` : ""}</p>
              {form.fromGSTIN && <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>GSTIN: {form.fromGSTIN}</p>}
              {(form.fromPhone || form.fromEmail) && (
                <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>{form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: accent, margin: 0 }}>PROFORMA</p>
              <p style={{ fontSize: "11px", color: "#6B7280" }}>#{form.proformaNumber}</p>
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
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", margin: 0 }}>{form.fromName || "Business Name"}</p>
            <p style={{ fontSize: "10px", opacity: 0.8, margin: "2px 0 0" }}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}</p>
            {form.fromGSTIN && <p style={{ fontSize: "10px", opacity: 0.8, margin: "2px 0 0" }}>GSTIN: {form.fromGSTIN}</p>}
            {(form.fromPhone || form.fromEmail) && (
              <p style={{ fontSize: "10px", opacity: 0.8, margin: "2px 0 0" }}>
                {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", margin: 0 }}>PROFORMA</p>
            <p style={{ fontSize: "11px", opacity: 0.8 }}>#{form.proformaNumber}</p>
          </div>
        </div>
        {sharedBody}
      </div>
    );
  }

  // Minimal (Default)
  return (
    <div className="pdf-preview">
      {/* Proforma badge */}
      <div style={{
        background: "#FEF9C3",
        borderBottom: "2px solid #F59E0B",
        padding: "6px 24px",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700,
          color: "#92400E", fontFamily: "Space Grotesk, sans-serif",
          letterSpacing: "0.08em", textTransform: "uppercase"
        }}>
          ⚠ Proforma Invoice — Not a Tax Invoice
        </span>
      </div>

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
            {form.fromName || "Your Business Name"}
          </p>
          {form.fromGSTIN && (
            <p style={{
              fontSize: "11px", color: "#6B7280",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              GSTIN: {form.fromGSTIN}
            </p>
          )}
          {form.fromAddress && (
            <p style={{
              fontSize: "11px", color: "#6B7280",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}
            </p>
          )}
          {fromState && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
              {fromState.name}
            </p>
          )}
          {(form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
              {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800,
            fontSize: "20px", color: accent, margin: 0
          }}>PROFORMA</p>
          <p style={{
            fontSize: "12px", color: "#6B7280",
            margin: "4px 0 0", fontFamily: "Inter, sans-serif"
          }}>
            #{form.proformaNumber}
          </p>
          <p style={{
            fontSize: "11px", color: "#9CA3AF",
            margin: "4px 0 0", fontFamily: "Inter, sans-serif"
          }}>
            Date: {form.proformaDate}
          </p>
        </div>
      </div>
      {sharedBody}
    </div>
  );
}

export default function ProformaInvoicePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const router = useRouter();
  const plan = user?.plan?.toUpperCase() || "FREE";
  useProfileSync(form, setForm, plan);
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";
  const [template, setTemplate] = useState("Classic");
  const templateMeta = TEMPLATE_REGISTRY.proforma[template] || TEMPLATE_REGISTRY.proforma.Classic;
  const showWatermark = templateMeta.pro && !isUserPro;

  const handleDownload = () => {
    download("proforma", template, form, `Proforma-${form.proformaNumber}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ 
        docType: "proforma-invoice", 
        title: "Proforma #" + form.proformaNumber, 
        referenceNumber: form.proformaNumber, 
        templateName: template,
        partyName: form.toName, 
        amount: form.items.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toFixed(2), 
        formData: JSON.stringify(form) 
      });
      toast.success("Saved to your dashboard!");
    } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
  };
  const [activeTab, setActiveTab] = useState("from");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);
  const updateItem = useCallback((index, updated) =>
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? updated : item),
    })), []);
  const addItem = useCallback(() =>
    setForm(prev => ({
      ...prev,
      items: [...prev.items, {
        description: "", hsn: "", qty: "1",
        rate: "", discount: "0", gstRate: "18", amount: "0.00"
      }],
    })), []);
  const removeItem = useCallback((index) =>
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    })), []);

  const TABS = [
    { id: "from", label: "Your Details" },
    { id: "to", label: "Client" },
    { id: "items", label: "Items" },
    { id: "advance", label: "Advance" },
    { id: "extra", label: "Settings" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      {/* Page header */}
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
              Proforma Invoice Generator
            </h1>
            <p style={{
              fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0",
              fontFamily: "Inter, sans-serif"
            }}>
              Advance billing document · Not a tax invoice
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

          {/* Form */}
          <div className="form-panel">
            <div className="tab-bar" style={{
              display: "flex", gap: "4px", marginBottom: "20px",
              background: "#F0F4F3", borderRadius: "8px", padding: "4px",
              flexWrap: "wrap"
            }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  flex: 1, padding: "6px 4px", borderRadius: "6px",
                  border: "none", fontSize: "11px", fontWeight: 600,
                  cursor: "pointer", fontFamily: "Inter, sans-serif",
                  background: activeTab === tab.id ? "#fff" : "transparent",
                  color: activeTab === tab.id ? T : "#6B7280",
                  boxShadow: activeTab === tab.id
                    ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  minWidth: "60px",
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* YOUR DETAILS */}
            {activeTab === "from" && (
              <div>
                <p className="form-label">Your Business Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{
                    fontSize: "11px", fontWeight: 600, color: "#6B7280",
                    margin: "0 0 6px", fontFamily: "Inter, sans-serif"
                  }}>Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo}
                      onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label className="field-label">Business Name *</label>
                  <input className="doc-input" placeholder="Your Company Name"
                    value={form.fromName}
                    onChange={e => updateField("fromName", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">GSTIN</label>
                  <input className="doc-input" placeholder="22AAAAA0000A1Z5"
                    value={form.fromGSTIN}
                    onChange={e => updateField("fromGSTIN", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                    maxLength={15}
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }} />                </div>
                <div className="form-row" style={{ marginTop: "4px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.fromPhone} onChange={e => updateField("fromPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="you@company.com" value={form.fromEmail} onChange={e => updateField("fromEmail", e.target.value)} /></div>
                </div>
                <div className="form-field">
                  <label className="field-label">Address</label>
                  <textarea className="doc-textarea"
                    value={form.fromAddress}
                    onChange={e => updateField("fromAddress", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">City</label>
                    <input className="doc-input" value={form.fromCity}
                      onChange={e => updateField("fromCity", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">State</label>
                    <select className="doc-select" value={form.fromState}
                      onChange={e => updateField("fromState", e.target.value)}>
                      {INDIAN_STATES.map(s =>
                        <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Proforma Details</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">PI Number</label>
                    <input className="doc-input" value={form.proformaNumber}
                      onChange={e => updateField("proformaNumber", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Date</label>
                    <input className="doc-input" type="date" value={form.proformaDate}
                      onChange={e => updateField("proformaDate", e.target.value)} />
                  </div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}>
                  <label className="field-label">Valid Until</label>
                  <input className="doc-input" type="date" value={form.validUntil}
                    onChange={e => updateField("validUntil", e.target.value)} />
                </div>
              </div>
            )}

            {/* CLIENT */}
            {activeTab === "to" && (
              <div>
                <p className="form-label">Client Details</p>
                <div className="form-field">
                  <label className="field-label">Client Name *</label>
                  <input className="doc-input" placeholder="Client Company"
                    value={form.toName}
                    onChange={e => updateField("toName", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Client GSTIN</label>
                  <input className="doc-input" placeholder="22AAAAA0000A1Z5"
                    value={form.toGSTIN}
                    onChange={e => updateField("toGSTIN", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                    maxLength={15}
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.toPhone} onChange={e => updateField("toPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="client@company.com" value={form.toEmail} onChange={e => updateField("toEmail", e.target.value)} /></div>
                </div>
                <div className="form-field">
                  <label className="field-label">Address</label>
                  <textarea className="doc-textarea" value={form.toAddress}
                    onChange={e => updateField("toAddress", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">City</label>
                    <input className="doc-input" value={form.toCity}
                      onChange={e => updateField("toCity", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">State</label>
                    <select className="doc-select" value={form.toState}
                      onChange={e => updateField("toState", e.target.value)}>
                      {INDIAN_STATES.map(s =>
                        <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Tax Settings</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { v: "cgst_sgst", l: "CGST+SGST" },
                    { v: "igst", l: "IGST" },
                    { v: "none", l: "No Tax" },
                  ].map(opt => (
                    <button key={opt.v}
                      onClick={() => updateField("taxType", opt.v)}
                      className={`toggle-btn ${form.taxType === opt.v ? "active" : ""}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ITEMS */}
            {activeTab === "items" && (
              <div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "12px"
                }}>
                  <p className="form-label" style={{ margin: 0, borderBottom: "none" }}>
                    Line Items
                  </p>
                  <button
                    onClick={() => updateField("showHSN", !form.showHSN)}
                    className={`toggle-btn ${form.showHSN ? "active" : ""}`}>
                    HSN
                  </button>
                </div>
                {form.items.map((item, i) => (
                  <ItemRow key={i} item={item} index={i}
                    onChange={updateItem} onRemove={removeItem}
                    showHSN={form.showHSN} />
                ))}
                <button className="add-item-btn" onClick={addItem}>
                  <Plus size={14} /> Add Line Item
                </button>
                {(() => {
                  const calc = calculateLineItems(
                    form.items, form.taxType === "igst");
                  return (
                    <div style={{
                      marginTop: "16px", padding: "12px",
                      background: "#F0F4F3", borderRadius: "8px"
                    }}>
                      {[
                        ["Subtotal", `₹${calc.subtotal}`],
                        form.taxType === "cgst_sgst" && ["CGST", `₹${calc.totalCGST}`],
                        form.taxType === "cgst_sgst" && ["SGST", `₹${calc.totalSGST}`],
                        form.taxType === "igst" && ["IGST", `₹${calc.totalIGST}`],
                      ].filter(Boolean).map(([l, v]) => (
                        <div key={l} style={{
                          display: "flex",
                          justifyContent: "space-between", marginBottom: "4px"
                        }}>
                          <span style={{
                            fontSize: "12px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif"
                          }}>{l}</span>
                          <span style={{
                            fontSize: "12px", color: "#374151",
                            fontFamily: "Inter, sans-serif"
                          }}>{v}</span>
                        </div>
                      ))}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #D1D5DB",
                        paddingTop: "6px", marginTop: "4px"
                      }}>
                        <span style={{
                          fontSize: "13px", fontWeight: 700,
                          fontFamily: "Space Grotesk, sans-serif",
                          color: "#111827"
                        }}>Total</span>
                        <span style={{
                          fontSize: "13px", fontWeight: 700,
                          color: T, fontFamily: "Space Grotesk, sans-serif"
                        }}>
                          ₹{calc.grandTotal}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ADVANCE */}
            {activeTab === "advance" && (
              <div>
                <p className="form-label">Advance Payment</p>
                <div className="form-field">
                  <label className="field-label">Advance Required (%)</label>
                  <div style={{
                    display: "flex", gap: "6px",
                    flexWrap: "wrap", marginBottom: "8px"
                  }}>
                    {["25", "30", "50", "100"].map(p => (
                      <button key={p}
                        onClick={() => updateField("advancePercent", p)}
                        className={`toggle-btn ${form.advancePercent === p
                          ? "active" : ""}`}>
                        {p}%
                      </button>
                    ))}
                  </div>
                  <input className="doc-input" type="number"
                    min="0" max="100"
                    placeholder="50" value={form.advancePercent}
                    onChange={e => {
                      let val = e.target.value;
                      if (val !== "" && Number(val) > 100) val = "100";
                      updateField("advancePercent", val);
                    }}
                    style={{
                      fontSize: "16px", fontWeight: 700,
                      color: "#92400E", fontFamily: "Space Grotesk, sans-serif"
                    }}
                  />
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Bank Details (for payment)</p>
                <div className="form-field">
                  <label className="field-label">Account Holder Name</label>
                  <input className="doc-input" placeholder="Your Name / Company"
                    value={form.accountName}
                    onChange={e => updateField("accountName", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Bank Name</label>
                  <input className="doc-input" placeholder="HDFC Bank"
                    value={form.bankName}
                    onChange={e => updateField("bankName", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Account Number</label>
                  <input className="doc-input" placeholder="XXXXXXXXXXXX"
                    value={form.accountNumber}
                    onChange={e => updateField("accountNumber", e.target.value)}
                    style={{ fontFamily: "monospace" }} />
                </div>
                <div className="form-field">
                  <label className="field-label">IFSC Code</label>
                  <input className="doc-input" placeholder="HDFC0001234"
                    value={form.ifscCode}
                    onChange={e => updateField("ifscCode",
                      e.target.value.toUpperCase())}
                    style={{ fontFamily: "monospace" }} />
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "extra" && (
              <div>
                <p className="form-label">Notes & Terms</p>
                <div className="form-field">
                  <label className="field-label">Notes</label>
                  <textarea className="doc-textarea" style={{ minHeight: "80px" }}
                    value={form.notes}
                    onChange={e => updateField("notes", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Terms & Conditions</label>
                  <textarea className="doc-textarea" style={{ minHeight: "80px" }}
                    value={form.terms}
                    onChange={e => updateField("terms", e.target.value)} />
                </div>

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

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <TemplatePicker 
                  docType="proforma" 
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

          {/* Preview */}
          <div className="preview-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Eye size={14} color="#9CA3AF" />
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
            </div>
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <ProformaPreview form={form} template={template} accent={form.templateColor || "#0D9488"} />
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1300px", margin: "0 auto",
          padding: "0 24px 40px"
        }}>
          <AdSense adSlot="SLOT_ID_PROFORMA" />
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