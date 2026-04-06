﻿"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const T = "#0D9488";

export default function EMICalculatorPage() {
    const [principal, setPrincipal] = useState("500000");
    const [rate, setRate] = useState("8.5");
    const [tenure, setTenure] = useState("60");
    const [tenureType, setTenureType] = useState("months");

    const calc = useCallback(() => {
        const P = parseFloat(principal) || 0;
        const r = (parseFloat(rate) || 0) / 100 / 12;
        const n = tenureType === "years"
            ? (parseFloat(tenure) || 0) * 12
            : (parseFloat(tenure) || 0);
        if (P === 0 || r === 0 || n === 0) return null;
        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = emi * n;
        const interest = total - P;
        return {
            emi, total, interest,
            principal: P, n,
            percentInterest: (interest / total * 100).toFixed(1),
            percentPrincipal: (P / total * 100).toFixed(1),
        };
    }, [principal, rate, tenure, tenureType]);

    const result = calc();
    const fmt = (n) => Math.round(n).toLocaleString("en-IN");
    const fmtF = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // Amortization (first 12 months)
    const amortization = useCallback(() => {
        if (!result) return [];
        const P = parseFloat(principal) || 0;
        const r = (parseFloat(rate) || 0) / 100 / 12;
        const rows = [];
        let balance = P;
        for (let i = 1; i <= Math.min(result.n, 12); i++) {
            const interest = balance * r;
            const principal_part = result.emi - interest;
            balance -= principal_part;
            rows.push({
                month: i, emi: result.emi,
                principal: principal_part,
                interest, balance: Math.max(0, balance),
            });
        }
        return rows;
    }, [result, principal, rate]);

    return (
        <>
            <Navbar />
            <main style={{
                background: "#F0F4F3",
                minHeight: "calc(100vh - 120px)", padding: "40px 24px"
            }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "28px", fontWeight: 700,
                            color: "#111827", margin: "0 0 8px"
                        }}>
                            EMI Calculator
                        </h1>
                        <p style={{
                            fontSize: "15px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0
                        }}>
                            Calculate monthly EMI for home, car or personal loans.
                        </p>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px"
                    }} className="calc-grid">

                        {/* Inputs */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px", padding: "24px"
                        }}>
                            <p className="form-label">Loan Details</p>

                            <div className="form-field">
                                <label className="field-label">Loan Amount (Rs. )</label>
                                <input className="doc-input"
                                    type="number" value={principal}
                                    onChange={e => setPrincipal(e.target.value)}
                                    style={{
                                        height: "44px", fontSize: "16px",
                                        fontWeight: 700, color: T,
                                        fontFamily: "Space Grotesk, sans-serif"
                                    }}
                                />
                                <div style={{
                                    display: "flex", gap: "6px",
                                    flexWrap: "wrap", marginTop: "6px"
                                }}>
                                    {["100000", "500000", "1000000", "5000000"].map(v => (
                                        <button key={v}
                                            onClick={() => setPrincipal(v)}
                                            style={{
                                                padding: "3px 10px",
                                                border: `1px solid ${principal === v
                                                    ? T : "#E5E7EB"}`,
                                                borderRadius: "12px",
                                                background: principal === v ? "#F0FDFA" : "#fff",
                                                color: principal === v ? T : "#6B7280",
                                                fontSize: "11px", fontWeight: 600,
                                                cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                            }}>
                                            Rs. {parseInt(v).toLocaleString("en-IN")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="field-label">Interest Rate (% per annum)</label>
                                <input className="doc-input"
                                    type="number" step="0.1" value={rate}
                                    onChange={e => setRate(e.target.value)}
                                    style={{
                                        height: "44px", fontSize: "16px",
                                        fontWeight: 700, color: "#7C3AED",
                                        fontFamily: "Space Grotesk, sans-serif"
                                    }}
                                />
                                <div style={{
                                    display: "flex", gap: "6px",
                                    flexWrap: "wrap", marginTop: "6px"
                                }}>
                                    {["7", "8.5", "10", "12", "15"].map(v => (
                                        <button key={v}
                                            onClick={() => setRate(v)}
                                            style={{
                                                padding: "3px 10px",
                                                border: `1px solid ${rate === v
                                                    ? "#7C3AED" : "#E5E7EB"}`,
                                                borderRadius: "12px",
                                                background: rate === v ? "#F5F3FF" : "#fff",
                                                color: rate === v ? "#7C3AED" : "#6B7280",
                                                fontSize: "11px", fontWeight: 600,
                                                cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                            }}>
                                            {v}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="field-label">Loan Tenure</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <input className="doc-input"
                                        type="number" value={tenure}
                                        onChange={e => setTenure(e.target.value)}
                                        style={{
                                            height: "44px", fontSize: "16px",
                                            fontWeight: 700, color: "#D97706",
                                            fontFamily: "Space Grotesk, sans-serif", flex: 1
                                        }}
                                    />
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        {[
                                            { v: "months", l: "Mo" },
                                            { v: "years", l: "Yr" },
                                        ].map(opt => (
                                            <button key={opt.v}
                                                onClick={() => setTenureType(opt.v)}
                                                style={{
                                                    height: "44px", padding: "0 14px",
                                                    border: `1px solid ${tenureType === opt.v
                                                        ? "#D97706" : "#E5E7EB"}`,
                                                    borderRadius: "8px",
                                                    background: tenureType === opt.v
                                                        ? "#FFFBEB" : "#fff",
                                                    color: tenureType === opt.v
                                                        ? "#D97706" : "#6B7280",
                                                    fontSize: "13px", fontWeight: 600,
                                                    cursor: "pointer",
                                                    fontFamily: "Inter, sans-serif",
                                                }}>
                                                {opt.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex", gap: "6px",
                                    flexWrap: "wrap", marginTop: "6px"
                                }}>
                                    {[
                                        { l: "1Y", v: "12", t: "months" },
                                        { l: "3Y", v: "36", t: "months" },
                                        { l: "5Y", v: "60", t: "months" },
                                        { l: "10Y", v: "10", t: "years" },
                                        { l: "20Y", v: "20", t: "years" },
                                        { l: "30Y", v: "30", t: "years" },
                                    ].map(opt => (
                                        <button key={opt.l}
                                            onClick={() => {
                                                setTenure(opt.v);
                                                setTenureType(opt.t);
                                            }}
                                            style={{
                                                padding: "3px 10px",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "12px", background: "#fff",
                                                color: "#6B7280", fontSize: "11px",
                                                fontWeight: 600, cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                            }}>
                                            {opt.l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        {result ? (
                            <div style={{
                                display: "flex",
                                flexDirection: "column", gap: "12px"
                            }}>

                                {/* EMI box */}
                                <div style={{
                                    background: T, borderRadius: "12px",
                                    padding: "24px", textAlign: "center",
                                }}>
                                    <p style={{
                                        fontSize: "12px",
                                        color: "rgba(255,255,255,0.7)",
                                        fontFamily: "Inter, sans-serif",
                                        textTransform: "uppercase", letterSpacing: "0.08em",
                                        margin: "0 0 6px"
                                    }}>Monthly EMI</p>
                                    <p style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 800, fontSize: "40px",
                                        color: "#fff", margin: 0, lineHeight: 1
                                    }}>
                                        Rs. {fmt(result.emi)}
                                    </p>
                                </div>

                                {/* Summary */}
                                <div style={{
                                    background: "#fff",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "12px", padding: "20px"
                                }}>
                                    <p className="form-label">Loan Summary</p>
                                    {[
                                        ["Principal Amount", `Rs. ${fmt(result.principal)}`, "#111827"],
                                        ["Total Interest", `Rs. ${fmt(result.interest)}`, "#EF4444"],
                                        ["Total Payment", `Rs. ${fmt(result.total)}`, T],
                                    ].map(([l, v, c]) => (
                                        <div key={l} style={{
                                            display: "flex", justifyContent: "space-between",
                                            padding: "8px 0", borderBottom: "1px solid #F3F4F6",
                                        }}>
                                            <span style={{
                                                fontSize: "13px", color: "#6B7280",
                                                fontFamily: "Inter, sans-serif"
                                            }}>{l}</span>
                                            <span style={{
                                                fontSize: "13px", fontWeight: 700,
                                                color: c,
                                                fontFamily: "Space Grotesk, sans-serif"
                                            }}>
                                                {v}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Visual bar */}
                                <div style={{
                                    background: "#fff",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "12px", padding: "16px"
                                }}>
                                    <div style={{
                                        display: "flex", gap: "2px",
                                        height: "16px", borderRadius: "8px",
                                        overflow: "hidden", marginBottom: "8px"
                                    }}>
                                        <div style={{
                                            width: `${result.percentPrincipal}%`,
                                            background: T,
                                        }} />
                                        <div style={{
                                            flex: 1, background: "#EF4444",
                                        }} />
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center", gap: "6px"
                                        }}>
                                            <div style={{
                                                width: "10px", height: "10px",
                                                borderRadius: "50%", background: T
                                            }} />
                                            <span style={{
                                                fontSize: "11px",
                                                color: "#6B7280",
                                                fontFamily: "Inter, sans-serif"
                                            }}>
                                                Principal {result.percentPrincipal}%
                                            </span>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center", gap: "6px"
                                        }}>
                                            <div style={{
                                                width: "10px", height: "10px",
                                                borderRadius: "50%",
                                                background: "#EF4444"
                                            }} />
                                            <span style={{
                                                fontSize: "11px",
                                                color: "#6B7280",
                                                fontFamily: "Inter, sans-serif"
                                            }}>
                                                Interest {result.percentInterest}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "center",
                                background: "#fff", border: "1px solid #E5E7EB",
                                borderRadius: "12px", padding: "40px",
                                textAlign: "center"
                            }}>
                                <p style={{
                                    fontSize: "14px", color: "#9CA3AF",
                                    fontFamily: "Inter, sans-serif"
                                }}>
                                    Fill in loan details to see EMI calculation
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Amortization table */}
                    {result && (
                        <div style={{
                            marginTop: "20px", background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px", overflow: "hidden"
                        }}>
                            <div style={{
                                padding: "16px 20px",
                                borderBottom: "1px solid #E5E7EB",
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <p className="form-label" style={{
                                    margin: 0,
                                    borderBottom: "none"
                                }}>
                                    Amortization Schedule
                                </p>
                                <span style={{
                                    fontSize: "12px", color: "#9CA3AF",
                                    fontFamily: "Inter, sans-serif"
                                }}>
                                    First 12 months
                                </span>
                            </div>
                            <div style={{ overflowX: "auto" }}>
                                <table className="pdf-table">
                                    <thead>
                                        <tr>
                                            {["Month", "EMI", "Principal", "Interest", "Balance"].map(h => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {amortization().map(row => (
                                            <tr key={row.month}>
                                                <td>{row.month}</td>
                                                <td style={{ fontWeight: 600 }}>Rs. {fmt(row.emi)}</td>
                                                <td style={{ color: T }}>Rs. {fmt(row.principal)}</td>
                                                <td style={{ color: "#EF4444" }}>Rs. {fmt(row.interest)}</td>
                                                <td>Rs. {fmt(row.balance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <style>{`
        @media (max-width: 768px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
            <Footer />
        </>
    );
}