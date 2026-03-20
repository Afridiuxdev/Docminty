"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const T = "#0D9488";
export default function SalaryCalculatorPage() {
  const [ctc, setCtc] = useState("600000");
  const [regime, setRegime] = useState("new");
  const calc = useCallback(() => {
    const annual = parseFloat(ctc) || 0;
    const monthly = annual / 12;
    const basic = monthly * 0.4;
    const hra = monthly * 0.2;
    const special = monthly - basic - hra;
    const pf = Math.min(basic * 0.12, 1800);
    const pt = monthly > 25000 ? 200 : monthly > 10000 ? 175 : 0;
    const stdDeduction = 50000 / 12;
    let taxable = annual - 50000;
    let tax = 0;
    if (regime === "new") {
      if (taxable > 1500000) tax = (taxable - 1500000) * 0.30 + 150000 + 100000 + 100000 + 75000 + 25000;
      else if (taxable > 1200000) tax = (taxable - 1200000) * 0.20 + 150000 + 100000 + 100000 + 75000;
      else if (taxable > 900000) tax = (taxable - 900000) * 0.15 + 150000 + 100000 + 100000;
      else if (taxable > 600000) tax = (taxable - 600000) * 0.10 + 150000 + 100000;
      else if (taxable > 300000) tax = (taxable - 300000) * 0.05 + 150000;
      if (taxable <= 700000) tax = 0;
    } else {
      if (taxable > 1000000) tax = (taxable - 1000000) * 0.30 + 112500 + 100000;
      else if (taxable > 500000) tax = (taxable - 500000) * 0.20 + 12500;
      else if (taxable > 250000) tax = (taxable - 250000) * 0.05;
    }
    const monthlyTax = tax / 12;
    const totalDed = pf + pt + monthlyTax;
    const inHand = monthly - totalDed;
    return { annual, monthly, basic, hra, special, pf, pt, monthlyTax, totalDed, inHand };
  }, [ctc, regime]);
  const r = calc();
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const fmtA = (n) => Math.round(n * 12).toLocaleString("en-IN");
  return (
    <>
      <Navbar />
      <main style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Salary / In-hand Calculator</h1>
            <p style={{ fontSize: "15px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Calculate your take-home salary from CTC. FY 2025-26.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="calc-grid">
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px" }}>
              <p className="form-label">Salary Details</p>
              <div className="form-field">
                <label className="field-label">Annual CTC (?)</label>
                <input className="doc-input" type="number" value={ctc} onChange={e => setCtc(e.target.value)} style={{ height: "44px", fontSize: "16px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }} />
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  {["300000","600000","1000000","1500000","2000000"].map(v => (
                    <button key={v} onClick={() => setCtc(v)} style={{ padding: "3px 10px", border: `1px solid ${ctc===v?T:"#E5E7EB"}`, borderRadius: "12px", background: ctc===v?"#F0FDFA":"#fff", color: ctc===v?T:"#6B7280", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>?{(parseInt(v)/100000).toFixed(v.length>6?1:0)}L</button>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Tax Regime (FY 2025-26)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[{ v: "new", l: "New Regime (Default)" }, { v: "old", l: "Old Regime" }].map(opt => (
                    <button key={opt.v} onClick={() => setRegime(opt.v)} style={{ flex: 1, padding: "10px", border: `1px solid ${regime===opt.v?T:"#E5E7EB"}`, borderRadius: "8px", background: regime===opt.v?"#F0FDFA":"#fff", color: regime===opt.v?T:"#374151", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{opt.l}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: "12px", background: "#F0FDFA", borderRadius: "8px", marginTop: "8px" }}>
                <p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: 0 }}>Assumptions: Basic = 40%, HRA = 20%, PF = 12% of basic (max ?1800/mo), Professional Tax = ?200/mo, Standard Deduction = ?50,000</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: T, borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Monthly In-Hand</p>
                <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "40px", color: "#fff", margin: 0 }}>?{fmt(r.inHand)}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", margin: "6px 0 0" }}>Annual: ?{fmtA(r.inHand)}</p>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px" }}>
                <p className="form-label">Monthly Salary Breakup</p>
                {[["Gross (CTC/12)", `?${fmt(r.monthly)}`, "#111827"], ["Basic", `?${fmt(r.basic)}`, "#374151"], ["HRA", `?${fmt(r.hra)}`, "#374151"], ["Special Allowance", `?${fmt(r.special)}`, "#374151"]].map(([l,v,c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{l}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: c, fontFamily: "Inter, sans-serif" }}>{v}</span>
                  </div>
                ))}
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "8px 0 4px", fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Deductions</p>
                {[["Employee PF", `- ?${fmt(r.pf)}`, "#EF4444"], ["Professional Tax", `- ?${fmt(r.pt)}`, "#EF4444"], ["Income Tax (TDS)", `- ?${fmt(r.monthlyTax)}`, "#EF4444"]].map(([l,v,c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{l}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: c, fontFamily: "Inter, sans-serif" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #E5E7EB", marginTop: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>In-Hand</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>?{fmt(r.inHand)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`@media (max-width:768px){.calc-grid{grid-template-columns:1fr!important;}}`}</style>
      <Footer />
    </>
  );
}
