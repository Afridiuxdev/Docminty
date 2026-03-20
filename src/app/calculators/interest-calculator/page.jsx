"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const T = "#0D9488";
export default function InterestCalculatorPage() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [time, setTime] = useState("5");
  const [type, setType] = useState("compound");
  const [freq, setFreq] = useState("12");
  const calc = useCallback(() => {
    const P = parseFloat(principal)||0, r = (parseFloat(rate)||0)/100, t = parseFloat(time)||0, n = parseInt(freq)||1;
    let si = P*r*t;
    let ci_total = P*Math.pow(1+(r/n),n*t);
    let ci = ci_total-P;
    return { P, si, ci, si_total: P+si, ci_total, r, t };
  }, [principal,rate,time,freq]);
  const r = calc();
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const result = type==="simple" ? r.si : r.ci;
  const total = type==="simple" ? r.si_total : r.ci_total;
  return (
    <>
      <Navbar />
      <main style={{ background:"#F0F4F3", minHeight:"calc(100vh - 120px)", padding:"40px 24px" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <h1 style={{ fontFamily:"Space Grotesk, sans-serif",fontSize:"28px",fontWeight:700,color:"#111827",margin:"0 0 8px" }}>Interest Calculator</h1>
            <p style={{ fontSize:"15px",color:"#6B7280",fontFamily:"Inter, sans-serif",margin:0 }}>Calculate simple and compound interest with yearly breakdown.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px" }} className="calc-grid">
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"24px" }}>
              <p className="form-label">Interest Details</p>
              <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
                {[{v:"simple",l:"Simple Interest"},{v:"compound",l:"Compound Interest"}].map(opt=>(
                  <button key={opt.v} onClick={()=>setType(opt.v)} style={{ flex:1,padding:"10px",border:`1px solid ${type===opt.v?T:"#E5E7EB"}`,borderRadius:"8px",background:type===opt.v?"#F0FDFA":"#fff",color:type===opt.v?T:"#374151",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif" }}>{opt.l}</button>
                ))}
              </div>
              <div className="form-field"><label className="field-label">Principal Amount (?)</label><input className="doc-input" type="number" value={principal} onChange={e=>setPrincipal(e.target.value)} style={{ height:"44px",fontSize:"16px",fontWeight:700,color:T,fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div className="form-field"><label className="field-label">Annual Interest Rate (%)</label><input className="doc-input" type="number" step="0.1" value={rate} onChange={e=>setRate(e.target.value)} style={{ height:"44px",fontSize:"16px",fontWeight:700,color:"#7C3AED",fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div className="form-field"><label className="field-label">Time Period (Years)</label><input className="doc-input" type="number" value={time} onChange={e=>setTime(e.target.value)} style={{ height:"44px",fontSize:"16px",fontWeight:700,color:"#D97706",fontFamily:"Space Grotesk, sans-serif" }} /></div>
              {type==="compound" && (<div className="form-field"><label className="field-label">Compounding Frequency</label><select className="doc-select" value={freq} onChange={e=>setFreq(e.target.value)}><option value="1">Annually</option><option value="2">Semi-Annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></div>)}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
              <div style={{ background:T,borderRadius:"12px",padding:"24px",textAlign:"center" }}>
                <p style={{ fontSize:"12px",color:"rgba(255,255,255,0.7)",fontFamily:"Inter, sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 6px" }}>Interest Earned</p>
                <p style={{ fontFamily:"Space Grotesk, sans-serif",fontWeight:800,fontSize:"40px",color:"#fff",margin:0 }}>?{fmt(result)}</p>
                <p style={{ fontSize:"13px",color:"rgba(255,255,255,0.7)",fontFamily:"Inter, sans-serif",margin:"6px 0 0" }}>Total Amount: ?{fmt(total)}</p>
              </div>
              <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"20px" }}>
                <p className="form-label">Comparison</p>
                {[["Principal",`?${fmt(r.P)}`,"#111827"],["Simple Interest",`?${fmt(r.si)}`,"#374151"],["Compound Interest",`?${fmt(r.ci)}`,T],[`SI Total`,`?${fmt(r.si_total)}`,"#374151"],[`CI Total`,`?${fmt(r.ci_total)}`,T],["Extra via Compounding",`?${fmt(r.ci-r.si)}`,"#7C3AED"]].map(([l,v,c])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F3F4F6" }}>
                    <span style={{ fontSize:"12px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{l}</span>
                    <span style={{ fontSize:"12px",fontWeight:700,color:c,fontFamily:"Space Grotesk, sans-serif" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"16px" }}>
                <div style={{ display:"flex",gap:"2px",height:"16px",borderRadius:"8px",overflow:"hidden",marginBottom:"8px" }}>
                  <div style={{ width:`${(r.P/total*100).toFixed(0)}%`,background:T }} />
                  <div style={{ flex:1,background:"#99F6E4" }} />
                </div>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"6px" }}><div style={{ width:"10px",height:"10px",borderRadius:"50%",background:T }} /><span style={{ fontSize:"11px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>Principal {(r.P/total*100).toFixed(0)}%</span></div>
                  <div style={{ display:"flex",alignItems:"center",gap:"6px" }}><div style={{ width:"10px",height:"10px",borderRadius:"50%",background:"#99F6E4" }} /><span style={{ fontSize:"11px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>Interest {(result/total*100).toFixed(0)}%</span></div>
                </div>
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
