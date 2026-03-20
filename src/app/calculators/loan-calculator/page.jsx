"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const T = "#0D9488";
export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("9");
  const [tenure, setTenure] = useState("20");
  const [showFull, setShowFull] = useState(false);
  const calc = useCallback(() => {
    const P = parseFloat(amount)||0, r = (parseFloat(rate)||0)/100/12, n = (parseFloat(tenure)||0)*12;
    if(!P||!r||!n) return null;
    const emi = (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    const total = emi*n, interest = total-P;
    const rows = [];
    let balance = P;
    for(let i=1;i<=n;i++){
      const int = balance*r, prin = emi-int;
      balance -= prin;
      rows.push({month:i,emi,principal:prin,interest:int,balance:Math.max(0,balance)});
    }
    return {emi,total,interest,principal:P,n,rows};
  }, [amount,rate,tenure]);
  const r = calc();
  const fmt = n => Math.round(n).toLocaleString("en-IN");
  const displayRows = r ? (showFull ? r.rows : r.rows.filter((_,i)=>i%12===11||i===0)) : [];
  return (
    <>
      <Navbar />
      <main style={{ background:"#F0F4F3",minHeight:"calc(100vh - 120px)",padding:"40px 24px" }}>
        <div style={{ maxWidth:"900px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"32px" }}>
            <h1 style={{ fontFamily:"Space Grotesk, sans-serif",fontSize:"28px",fontWeight:700,color:"#111827",margin:"0 0 8px" }}>Loan Calculator</h1>
            <p style={{ fontSize:"15px",color:"#6B7280",fontFamily:"Inter, sans-serif",margin:0 }}>Calculate total loan cost with full amortization schedule.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px" }} className="calc-grid">
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"24px" }}>
              <p className="form-label">Loan Details</p>
              <div className="form-field"><label className="field-label">Loan Amount (?)</label><input className="doc-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{ height:"44px",fontSize:"16px",fontWeight:700,color:T,fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div className="form-field"><label className="field-label">Annual Interest Rate (%)</label><input className="doc-input" type="number" step="0.1" value={rate} onChange={e=>setRate(e.target.value)} style={{ height:"44px",fontSize:"16px",fontWeight:700,color:"#7C3AED",fontFamily:"Space Grotesk, sans-serif" }} /></div>
              <div className="form-field"><label className="field-label">Loan Tenure (Years)</label><input className="doc-input" type="number" value={tenure} onChange={e=>setTenure(e.target.value)} style={{ height:"44px",fontSize:"16px",fontWeight:700,color:"#D97706",fontFamily:"Space Grotesk, sans-serif" }} />
                <div style={{ display:"flex",gap:"6px",marginTop:"6px" }}>
                  {["5","10","15","20","25","30"].map(v=>(
                    <button key={v} onClick={()=>setTenure(v)} style={{ padding:"3px 10px",border:`1px solid ${tenure===v?"#D97706":"#E5E7EB"}`,borderRadius:"12px",background:tenure===v?"#FFFBEB":"#fff",color:tenure===v?"#D97706":"#6B7280",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif" }}>{v}yr</button>
                  ))}
                </div>
              </div>
            </div>
            {r ? (
              <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
                <div style={{ background:T,borderRadius:"12px",padding:"24px",textAlign:"center" }}>
                  <p style={{ fontSize:"12px",color:"rgba(255,255,255,0.7)",fontFamily:"Inter, sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 6px" }}>Monthly EMI</p>
                  <p style={{ fontFamily:"Space Grotesk, sans-serif",fontWeight:800,fontSize:"40px",color:"#fff",margin:0 }}>?{fmt(r.emi)}</p>
                </div>
                <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"20px" }}>
                  {[["Principal",`?${fmt(r.principal)}`,"#111827"],["Total Interest",`?${fmt(r.interest)}`,"#EF4444"],["Total Payment",`?${fmt(r.total)}`,T],["Interest Ratio",`${(r.interest/r.total*100).toFixed(1)}%`,"#7C3AED"]].map(([l,v,c])=>(
                    <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6" }}>
                      <span style={{ fontSize:"13px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>{l}</span>
                      <span style={{ fontSize:"13px",fontWeight:700,color:c,fontFamily:"Space Grotesk, sans-serif" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"10px",padding:"14px" }}>
                  <div style={{ display:"flex",gap:"2px",height:"14px",borderRadius:"6px",overflow:"hidden",marginBottom:"8px" }}>
                    <div style={{ width:`${(r.principal/r.total*100).toFixed(0)}%`,background:T }} />
                    <div style={{ flex:1,background:"#EF4444" }} />
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between" }}>
                    <span style={{ fontSize:"11px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>?? Principal {(r.principal/r.total*100).toFixed(0)}%</span>
                    <span style={{ fontSize:"11px",color:"#6B7280",fontFamily:"Inter, sans-serif" }}>?? Interest {(r.interest/r.total*100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ) : <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px" }}><p style={{ color:"#9CA3AF",fontFamily:"Inter, sans-serif" }}>Fill in details to calculate</p></div>}
          </div>
          {r && (
            <div style={{ background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",overflow:"hidden" }}>
              <div style={{ padding:"16px 20px",borderBottom:"1px solid #E5E7EB",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <p className="form-label" style={{ margin:0,borderBottom:"none" }}>Amortization Schedule</p>
                <button onClick={()=>setShowFull(!showFull)} style={{ padding:"6px 14px",border:`1px solid ${T}`,borderRadius:"6px",background:"#F0FDFA",color:T,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"Inter, sans-serif" }}>{showFull?"Show Yearly":"Show All Months"}</button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table className="pdf-table">
                  <thead><tr>{(showFull?["Month","EMI","Principal","Interest","Balance"]:["Year","EMI","Principal","Interest","Balance"]).map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {displayRows.map((row,i)=>(
                      <tr key={i}>
                        <td>{showFull?row.month:Math.ceil(row.month/12)}</td>
                        <td style={{ fontWeight:600 }}>?{fmt(row.emi)}</td>
                        <td style={{ color:T }}>?{fmt(row.principal)}</td>
                        <td style={{ color:"#EF4444" }}>?{fmt(row.interest)}</td>
                        <td>?{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <style>{`@media(max-width:768px){.calc-grid{grid-template-columns:1fr!important;}}`}</style>
      <Footer />
    </>
  );
}
