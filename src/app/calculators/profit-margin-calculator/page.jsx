"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const T = "#0D9488";
export default function ProfitMarginPage() {
  const [cost, setCost] = useState("1000");
  const [revenue, setRevenue] = useState("1500");
  const calc = useCallback(() => {
    const c = parseFloat(cost)||0, r = parseFloat(revenue)||0;
    const profit = r-c;
    const margin = r>0 ? (profit/r*100) : 0;
    const markup = c>0 ? (profit/c*100) : 0;
    const roi = c>0 ? (profit/c*100) : 0;
    return { cost:c, revenue:r, profit, margin, markup, roi };
  }, [cost, revenue]);
  const r = calc();
  const fmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtP = (n) => n.toFixed(2);
  return (
    <>
      <Navbar />
      <main style={{ background:"#F0F4F3", minHeight:"calc(100vh - 120px)", padding:"40px 24px" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <h1 style={{ fontFamily:"Space Grotesk, sans-serif",fontSize:"28px",fontWeight:700,color:"#111827",margin:"0 0 8px" }}>Profit Margin Calculator</h1>
            <p style={{ fontSize:"15px",color:"#6B7280",fontFamily:"Inter, sans-serif",margin:0 }}>Calculate profit, margin percentage and markup for your business.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px" }} className="calc-grid">
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"24px" }}>
              <p className="form-label">Enter Values</p>
              <div className="form-field"><label className="field-label">Cost Price / Total Cost (?)</label><input className="doc-input" type="number" value={cost} onChange={e=>setCost(e.target.value)} style={{ height:"48px",fontSize:"18px",fontWeight:700,color:"#EF4444",fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div className="form-field"><label className="field-label">Selling Price / Revenue (?)</label><input className="doc-input" type="number" value={revenue} onChange={e=>setRevenue(e.target.value)} style={{ height:"48px",fontSize:"18px",fontWeight:700,color:T,fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div style={{ padding:"16px",background:r.profit>=0?"#F0FDFA":"#FEF2F2",border:`1px solid ${r.profit>=0?T:"#FCA5A5"}`,borderRadius:"8px",marginTop:"8px" }}>
                <p style={{ fontFamily:"Space Grotesk, sans-serif",fontWeight:700,fontSize:"13px",color:r.profit>=0?T:"#DC2626",margin:"0 0 4px" }}>{r.profit>=0?"? Profitable":"? Loss-making"}</p>
                <p style={{ fontSize:"12px",color:"#6B7280",fontFamily:"Inter, sans-serif",margin:0 }}>{r.profit>=0?`You make ?${fmt(r.profit)} profit per unit`:`You lose ?${fmt(Math.abs(r.profit))} per unit`}</p>
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
              <div style={{ background:r.profit>=0?T:"#EF4444",borderRadius:"12px",padding:"24px",textAlign:"center" }}>
                <p style={{ fontSize:"12px",color:"rgba(255,255,255,0.7)",fontFamily:"Inter, sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 6px" }}>Profit</p>
                <p style={{ fontFamily:"Space Grotesk, sans-serif",fontWeight:800,fontSize:"40px",color:"#fff",margin:0 }}>{r.profit>=0?"":"-"}?{fmt(Math.abs(r.profit))}</p>
              </div>
              <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"20px" }}>
                <p className="form-label">Metrics</p>
                {[["Cost Price",`?${fmt(r.cost)}`,"#EF4444"],["Revenue",`?${fmt(r.revenue)}`,T],["Gross Profit",`?${fmt(r.profit)}`,r.profit>=0?T:"#EF4444"],["Profit Margin",`${fmtP(r.margin)}%`,r.margin>=0?T:"#EF4444"],["Markup",`${fmtP(r.markup)}%`,"#7C3AED"],["ROI",`${fmtP(r.roi)}%`,"#D97706"]].map(([l,v,c])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6" }}>
                    <span style={{ fontSize:"13px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{l}</span>
                    <span style={{ fontSize:"13px",fontWeight:700,color:c,fontFamily:"Space Grotesk, sans-serif" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`@media(max-width:768px){.calc-grid{grid-template-columns:1fr!important;}}`}</style>
      <Footer />
    </>
  );
}
