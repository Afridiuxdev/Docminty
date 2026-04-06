﻿"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const T = "#0D9488";
const GST_RATES = [3, 5, 12, 18, 28];

export default function GSTCalculatorPage() {
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState(18);
    const [mode, setMode] = useState("add");
    const [included, setIncluded] = useState(false);

    const calc = useCallback(() => {
        const base = parseFloat(amount) || 0;
        if (mode === "add") {
            const gst = (base * rate) / 100;
            const total = base + gst;
            const cgst = gst / 2;
            const sgst = gst / 2;
            return { base, gst, cgst, sgst, igst: gst, total };
        } else {
            const base2 = (base * 100) / (100 + rate);
            const gst = base - base2;
            const cgst = gst / 2;
            const sgst = gst / 2;
            return { base: base2, gst, cgst, sgst, igst: gst, total: base };
        }
    }, [amount, rate, mode]);

    const result = calc();

    const fmt = (n) => n.toLocaleString("en-IN", {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    });

    return (
        <>
            <Navbar />
            <main style={{
                background: "#F0F4F3",
                minHeight: "calc(100vh - 120px)", padding: "40px 24px"
            }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "28px", fontWeight: 700,
                            color: "#111827", margin: "0 0 8px"
                        }}>
                            GST Calculator
                        </h1>
                        <p style={{
                            fontSize: "15px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0
                        }}>
                            Add GST to a price or remove GST from a GST-inclusive amount.
                        </p>
                    </div>

                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "20px"
                    }} className="calc-grid">

                        {/* Input */}
                        <div style={{
                            background: "#fff", border: "1px solid #E5E7EB",
                            borderRadius: "12px", padding: "24px"
                        }}>
                            <p className="form-label">Calculator</p>

                            {/* Mode */}
                            <div style={{
                                display: "flex", gap: "8px",
                                marginBottom: "20px"
                            }}>
                                {[
                                    { v: "add", l: "Add GST" },
                                    { v: "remove", l: "Remove GST" },
                                ].map(opt => (
                                    <button key={opt.v}
                                        onClick={() => setMode(opt.v)}
                                        style={{
                                            flex: 1, height: "40px",
                                            border: `1px solid ${mode === opt.v ? T : "#E5E7EB"}`,
                                            borderRadius: "8px",
                                            background: mode === opt.v ? T : "#fff",
                                            color: mode === opt.v ? "#fff" : "#374151",
                                            fontSize: "14px", fontWeight: 600,
                                            cursor: "pointer", transition: "all 150ms",
                                            fontFamily: "Space Grotesk, sans-serif",
                                        }}>
                                        {opt.l}
                                    </button>
                                ))}
                            </div>

                            {/* Amount */}
                            <div className="form-field">
                                <label className="field-label">
                                    {mode === "add"
                                        ? "Enter Amount (Before GST)"
                                        : "Enter Amount (GST Inclusive)"}
                                </label>
                                <div style={{ position: "relative" }}>
                                    <span style={{
                                        position: "absolute", left: "12px",
                                        top: "50%", transform: "translateY(-50%)",
                                        fontSize: "16px", fontWeight: 700, color: T,
                                        fontFamily: "Space Grotesk, sans-serif",
                                    }}>Rs. </span>
                                    <input className="doc-input"
                                        type="number" placeholder="0.00"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        style={{
                                            paddingLeft: "48px", height: "48px",
                                            fontSize: "18px", fontWeight: 700,
                                            color: "#111827",
                                            fontFamily: "Space Grotesk, sans-serif"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* GST Rate */}
                            <div className="form-field">
                                <label className="field-label">GST Rate</label>
                                <div style={{
                                    display: "flex", gap: "6px",
                                    flexWrap: "wrap"
                                }}>
                                    {GST_RATES.map(r => (
                                        <button key={r}
                                            onClick={() => setRate(r)}
                                            style={{
                                                padding: "6px 14px",
                                                border: `1px solid ${rate === r ? T : "#E5E7EB"}`,
                                                borderRadius: "20px",
                                                background: rate === r ? "#F0FDFA" : "#fff",
                                                color: rate === r ? T : "#374151",
                                                fontSize: "13px", fontWeight: 600,
                                                cursor: "pointer", transition: "all 150ms",
                                                fontFamily: "Inter, sans-serif",
                                            }}>
                                            {r}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom rate */}
                            <div className="form-field">
                                <label className="field-label">Custom Rate (%)</label>
                                <input className="doc-input"
                                    type="number" placeholder="e.g. 3"
                                    value={GST_RATES.includes(rate) ? "" : rate}
                                    onChange={e => setRate(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {/* Result */}
                        <div style={{
                            display: "flex", flexDirection: "column",
                            gap: "12px"
                        }}>

                            {/* Total box */}
                            <div style={{
                                background: T, borderRadius: "12px",
                                padding: "24px", textAlign: "center",
                            }}>
                                <p style={{
                                    fontSize: "12px", color: "rgba(255,255,255,0.7)",
                                    fontFamily: "Inter, sans-serif",
                                    textTransform: "uppercase", letterSpacing: "0.08em",
                                    margin: "0 0 6px"
                                }}>
                                    {mode === "add" ? "Total (with GST)" : "Original Amount"}
                                </p>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 800, fontSize: "36px",
                                    color: "#fff", margin: 0, lineHeight: 1
                                }}>
                                    Rs. {fmt(mode === "add" ? result.total : result.base)}
                                </p>
                                <p style={{
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.7)",
                                    fontFamily: "Inter, sans-serif",
                                    margin: "8px 0 0"
                                }}>
                                    GST Amount: Rs. {fmt(result.gst)}
                                </p>
                            </div>

                            {/* Breakdown */}
                            <div style={{
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px", padding: "20px"
                            }}>
                                <p className="form-label">GST Breakdown</p>
                                {[
                                    ["Original Amount", `Rs. ${fmt(result.base)}`],
                                    [`GST @${rate}%`, `Rs. ${fmt(result.gst)}`],
                                    ["CGST (Intrastate)", `Rs. ${fmt(result.cgst)}`],
                                    ["SGST (Intrastate)", `Rs. ${fmt(result.sgst)}`],
                                    ["IGST (Interstate)", `Rs. ${fmt(result.igst)}`],
                                    ["Total Amount", `Rs. ${fmt(result.total)}`],
                                ].map(([label, value], i) => (
                                    <div key={label} style={{
                                        display: "flex", justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: i < 5 ? "1px solid #F3F4F6" : "none",
                                        borderTop: i === 5 ? "2px solid #E5E7EB" : "none",
                                        marginTop: i === 5 ? "4px" : 0,
                                    }}>
                                        <span style={{
                                            fontSize: "13px", color: "#6B7280",
                                            fontFamily: "Inter, sans-serif"
                                        }}>{label}</span>
                                        <span style={{
                                            fontSize: "13px",
                                            fontWeight: i === 5 ? 700 : 500,
                                            color: i === 5 ? T : "#111827",
                                            fontFamily: i === 5
                                                ? "Space Grotesk, sans-serif"
                                                : "Inter, sans-serif",
                                        }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* GST Rate reference */}
                    <div style={{
                        marginTop: "24px", background: "#fff",
                        border: "1px solid #E5E7EB", borderRadius: "12px",
                        padding: "20px"
                    }}>
                        <p className="form-label">GST Rate Reference (India)</p>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5,1fr)", gap: "8px"
                        }}>
                            {[
                                { rate: "0%", items: "Essential food, healthcare" },
                                { rate: "5%", items: "Packaged food, transport" },
                                { rate: "12%", items: "Business class travel, work contracts" },
                                { rate: "18%", items: "Most goods & services, IT services" },
                                { rate: "28%", items: "Luxury goods, automobiles, tobacco" },
                            ].map(({ rate: r, items }) => (
                                <div key={r} style={{
                                    padding: "12px", background: "#F0FDFA",
                                    border: `1px solid #99F6E4`,
                                    borderRadius: "8px", textAlign: "center",
                                }}>
                                    <p style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 800, fontSize: "18px",
                                        color: T, margin: "0 0 4px"
                                    }}>{r}</p>
                                    <p style={{
                                        fontSize: "11px", color: "#6B7280",
                                        fontFamily: "Inter, sans-serif",
                                        margin: 0, lineHeight: 1.4
                                    }}>{items}</p>
                                </div>
                            ))}
                        </div>
                    </div>
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
