"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const T = "#0D9488";
export default function DiscountCalculatorPage() {
  const [original, setOriginal] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const [mode, setMode] = useState("percent");
  const calc = useCallback(() => {
    const p = parseFloat(original)||0, d = parseFloat(discount)||0;
    const discAmt = mode==="percent" ? p*d/100 : d;
    const final = p-discAmt;
    const pct = p>0 ? discAmt/p*100 : 0;
    return { original:p, discountAmount:discAmt, finalPrice:final, discountPercent:pct };
  }, [original,discount,mode]);
  const r = calc();
  const fmt = (n) => n.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
  const PRESETS = ["5","10","15","20","25","30","40","50"];
  return (
    <>
      <Navbar />
      <main style={{ background:"#F0F4F3",minHeight:"calc(100vh - 120px)",padding:"40px 24px" }}>
        <div style={{ maxWidth:"760px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"32px" }}>
            <h1 style={{ fontFamily:"Space Grotesk, sans-serif",fontSize:"28px",fontWeight:700,color:"#111827",margin:"0 0 8px" }}>Discount Calculator</h1>
            <p style={{ fontSize:"15px",color:"#6B7280",fontFamily:"Inter, sans-serif",margin:0 }}>Calculate final price after discount and your total savings.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px" }} className="calc-grid">
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"24px" }}>
              <p className="form-label">Discount Details</p>
              <div className="form-field"><label className="field-label">Original Price (?)</label><input className="doc-input" type="number" value={original} onChange={e=>setOriginal(e.target.value)} style={{ height:"48px",fontSize:"18px",fontWeight:700,color:"#374151",fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div className="form-field">
                <label className="field-label">Discount</label>
                <div style={{ display:"flex",gap:"8px",marginBottom:"8px" }}>
                  {[{v:"percent",l:"Percentage (%)"},{v:"amount",l:"Fixed Amount (?)"}].map(opt=>(
                    <button key={opt.v} onClick={()=>setMode(opt.v)} style={{ flex:1,padding:"8px",border:`1px solid ${mode===opt.v?T:"#E5E7EB"}`,borderRadius:"8px",background:mode===opt.v?"#F0FDFA":"#fff",color:mode===opt.v?T:"#374151",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif" }}>{opt.l}</button>
                  ))}
                </div>
                <input className="doc-input" type="number" value={discount} onChange={e=>setDiscount(e.target.value)} style={{ height:"48px",fontSize:"18px",fontWeight:700,color:"#7C3AED",fontFamily:"Space Grotesk, sans-serif" }} />
                {mode==="percent" && (<div style={{ display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"8px" }}>{PRESETS.map(p=>(<button key={p} onClick={()=>setDiscount(p)} style={{ padding:"3px 10px",border:`1px solid ${discount===p?"#7C3AED":"#E5E7EB"}`,borderRadius:"12px",background:discount===p?"#F5F3FF":"#fff",color:discount===p?"#7C3AED":"#6B7280",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif" }}>{p}%</button>))}</div>)}
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
              <div style={{ background:T,borderRadius:"12px",padding:"24px",textAlign:"center" }}>
                <p style={{ fontSize:"12px",color:"rgba(255,255,255,0.7)",fontFamily:"Inter, sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 6px" }}>Final Price</p>
                <p style={{ fontFamily:"Space Grotesk, sans-serif",fontWeight:800,fontSize:"40px",color:"#fff",margin:0 }}>?{fmt(r.finalPrice)}</p>
                <p style={{ fontSize:"13px",color:"rgba(255,255,255,0.7)",fontFamily:"Inter, sans-serif",margin:"6px 0 0" }}>You save ?{fmt(r.discountAmount)}</p>
              </div>
              <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"20px" }}>
                <p className="form-label">Breakdown</p>
                {[["Original Price",`?${fmt(r.original)}`,"#111827"],["Discount Amount",`- ?${fmt(r.discountAmount)}`,"#EF4444"],["Discount %",`${r.discountPercent.toFixed(2)}%`,"#7C3AED"],["Final Price",`?${fmt(r.finalPrice)}`,T],["Total Savings",`?${fmt(r.discountAmount)}`,"#D97706"]].map(([l,v,c])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6" }}>
                    <span style={{ fontSize:"13px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{l}</span>
                    <span style={{ fontSize:"13px",fontWeight:700,color:c,fontFamily:"Space Grotesk, sans-serif" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"#FEF9C3",border:"1px solid #F59E0B",borderRadius:"10px",padding:"14px 16px",textAlign:"center" }}>
                <p style={{ fontFamily:"Space Grotesk, sans-serif",fontWeight:700,fontSize:"16px",color:"#92400E",margin:"0 0 2px" }}>??? {r.discountPercent.toFixed(0)}% OFF</p>
                <p style={{ fontSize:"12px",color:"#92400E",fontFamily:"Inter, sans-serif",margin:0 }}>Save ?{fmt(r.discountAmount)} on this purchase</p>
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
