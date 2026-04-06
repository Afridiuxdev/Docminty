"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Upload, Download, FileText, CheckCircle,
  AlertCircle, Zap, Archive, Lock,
} from "lucide-react";
import { authApi } from "@/api/auth";

const T = "#0D9488";

const DOC_TYPES = [
  { id: "invoice", label: "GST Invoice", icon: "📄" },
  { id: "salary-slip", label: "Salary Slip", icon: "💰" },
  { id: "certificate", label: "Certificate", icon: "🏆" },
  { id: "quotation", label: "Quotation", icon: "💬" },
  { id: "receipt", label: "Receipt", icon: "🧾" },
];

const SAMPLE_CSVs = {
  invoice: "invoice_number,date,from_name,from_gstin,to_name,to_gstin,item_description,quantity,rate,gst_rate\nINV-001,2026-03-19,Sharma Enterprises,27AABCU9603R1ZM,Mehta Ltd,29AABCU9603R1ZX,Web Design,1,25000,18\nINV-002,2026-03-19,Sharma Enterprises,27AABCU9603R1ZM,Nair Corp,33AABCU9603R1ZX,SEO Services,1,8000,18",
  "salary-slip": "employee_name,employee_id,designation,basic,hra,da,month,year\nAmit Kumar,EMP001,Sr Developer,45000,18000,4500,March,2026\nPriya Sharma,EMP002,UI Designer,35000,14000,3500,March,2026",
  certificate: "recipient_name,course,duration,grade,issue_date,org_name\nRahul Gupta,Full Stack Dev,6 Months,A+,2026-03-15,Reddy Academy\nAnanya Singh,Data Science,3 Months,A,2026-03-12,Reddy Academy",
  quotation: "quote_number,date,from_name,to_name,item_description,quantity,rate,gst_rate\nQT-001,2026-03-19,Arjun Studio,Nair Ind,React Development,1,40000,18\nQT-002,2026-03-19,Arjun Studio,Patel Corp,UI Design,1,20000,18",
  receipt: "receipt_number,date,from_name,received_from,amount,payment_mode,purpose\nRCP-001,2026-03-19,Patel Ent,Sharma Corp,29500,UPI,Invoice Payment\nRCP-002,2026-03-19,Patel Ent,Mehta Ltd,15000,NEFT,Advance",
};

export default function BatchProcessorPage() {
  const [docType, setDocType] = useState("invoice");
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    authApi.me().then(res => setUser(res.data.data)).catch(() => {});
  }, []);

  const plan = user?.plan?.toUpperCase() || "FREE";
  const isPro = plan === "PRO" || plan === "ENTERPRISE";

  const handleFileUpload = useCallback((uploadedFile) => {
    if (!uploadedFile) return;
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        return headers.reduce((obj, h, i) => {
          obj[h] = values[i] || "";
          return obj;
        }, {});
      });
      setCsvData({ headers, rows });
      setStatus("preview");
    };
    reader.readAsText(uploadedFile);
  }, []);

  const downloadSample = () => {
    const csv = SAMPLE_CSVs[docType];
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `docminty_${docType}_sample.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const processBatch = () => {
    if (!isPro) return;
    setStatus("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <>
      <Navbar />

      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 24px",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <div>
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "18px", fontWeight: 700,
              margin: 0, color: "#111827",
            }}>
              Batch Document Processor
            </h1>
            <p style={{
              fontSize: "12px", color: "#9CA3AF",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif",
            }}>
              Generate 100+ documents from a CSV file — Pro feature
            </p>
          </div>
          {!isPro && (
            <Link href="/pricing" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              height: "36px", padding: "0 16px",
              background: "#F59E0B", color: "#fff", border: "none",
              borderRadius: "8px", fontSize: "13px", fontWeight: 700,
              cursor: "pointer", fontFamily: "Space Grotesk, sans-serif",
              textDecoration: "none",
            }}>
              <Zap size={13} /> Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      <div style={{
        background: "#F0F4F3",
        minHeight: "calc(100vh - 120px)",
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Pro gate warning */}
          {!isPro && (
            <div style={{
              background: "#FEF9C3",
              border: "1px solid #F59E0B",
              borderRadius: "12px", padding: "16px 20px",
              marginBottom: "24px",
              display: "flex", alignItems: "center",
              gap: "12px",
            }}>
              <Lock size={18} color="#92400E" />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700, fontSize: "14px",
                  color: "#92400E", margin: "0 0 2px",
                }}>
                  Pro Feature
                </p>
                <p style={{
                  fontSize: "13px", color: "#92400E",
                  fontFamily: "Inter, sans-serif", margin: 0,
                }}>
                  Batch processing requires a Business Pro subscription.
                  You can preview and configure below, but processing
                  requires an upgrade.
                </p>
              </div>
              <Link href="/pricing" style={{
                padding: "8px 16px", background: "#F59E0B",
                color: "#fff", borderRadius: "8px",
                fontSize: "13px", fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Space Grotesk, sans-serif",
                flexShrink: 0,
              }}>
                Upgrade ₹199/mo
              </Link>
            </div>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "24px", alignItems: "start",
          }} className="batch-grid">

            {/* Left — Config */}
            <div style={{
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: "12px", padding: "24px",
            }}>
              <p className="form-label">Step 1: Select Document Type</p>
              <div style={{
                display: "flex", flexDirection: "column", gap: "6px",
                marginBottom: "20px",
              }}>
                {DOC_TYPES.map(dt => (
                  <button key={dt.id}
                    onClick={() => {
                      setDocType(dt.id);
                      setFile(null);
                      setCsvData(null);
                      setStatus("idle");
                    }}
                    style={{
                      display: "flex", alignItems: "center",
                      gap: "10px", padding: "10px 12px",
                      border: `1px solid ${docType === dt.id
                        ? T : "#E5E7EB"}`,
                      borderRadius: "8px",
                      background: docType === dt.id ? "#F0FDFA" : "#fff",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 150ms",
                    }}>
                    <span style={{ fontSize: "18px" }}>{dt.icon}</span>
                    <span style={{
                      fontSize: "13px", fontWeight: 600,
                      color: docType === dt.id ? T : "#374151",
                      fontFamily: "Inter, sans-serif",
                    }}>{dt.label}</span>
                  </button>
                ))}
              </div>

              <div style={{
                borderTop: "1px solid #F3F4F6", paddingTop: "16px",
              }}>
                <p className="form-label">Step 2: Download Sample CSV</p>
                <button onClick={downloadSample} style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "6px",
                  width: "100%", height: "40px",
                  border: `1px solid ${T}`, borderRadius: "8px",
                  background: "#F0FDFA", color: T,
                  fontSize: "13px", fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 150ms",
                }}>
                  <Download size={14} /> Download Sample CSV
                </button>
                <p style={{
                  fontSize: "11px", color: "#9CA3AF",
                  margin: "6px 0 0", textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                }}>
                  Fill in the sample and upload below
                </p>
              </div>
            </div>

            {/* Right — Upload + Preview */}
            <div>
              {/* Upload area */}
              <div style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: "12px", padding: "24px",
                marginBottom: "16px",
              }}>
                <p className="form-label">Step 3: Upload Your CSV</p>

                <label style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "40px 24px",
                  border: `2px dashed ${file ? T : "#E5E7EB"}`,
                  borderRadius: "10px",
                  background: file ? "#F0FDFA" : "#FAFAFA",
                  cursor: "pointer", transition: "all 150ms",
                  textAlign: "center",
                }}>
                  <input type="file" accept=".csv"
                    style={{ display: "none" }}
                    onChange={e => handleFileUpload(e.target.files[0])}
                  />
                  {file ? (
                    <>
                      <CheckCircle size={32} color={T}
                        style={{ marginBottom: "10px" }} />
                      <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700, fontSize: "14px",
                        color: T, margin: "0 0 4px",
                      }}>{file.name}</p>
                      <p style={{
                        fontSize: "12px", color: "#6B7280",
                        fontFamily: "Inter, sans-serif", margin: 0,
                      }}>
                        {csvData?.rows?.length || 0} records found
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={32} color="#D1D5DB"
                        style={{ marginBottom: "10px" }} />
                      <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700, fontSize: "14px",
                        color: "#374151", margin: "0 0 4px",
                      }}>
                        Click to upload CSV
                      </p>
                      <p style={{
                        fontSize: "12px", color: "#9CA3AF",
                        fontFamily: "Inter, sans-serif", margin: 0,
                      }}>
                        or drag and drop · .csv files only
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* CSV Preview */}
              {csvData && status === "preview" && (
                <div style={{
                  background: "#fff", border: "1px solid #E5E7EB",
                  borderRadius: "12px", padding: "24px",
                  marginBottom: "16px",
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "16px",
                  }}>
                    <div>
                      <p className="form-label" style={{
                        margin: 0,
                        borderBottom: "none"
                      }}>
                        CSV Preview
                      </p>
                      <p style={{
                        fontSize: "12px", color: "#9CA3AF",
                        fontFamily: "Inter, sans-serif",
                        margin: "2px 0 0",
                      }}>
                        {csvData.rows.length} documents will be generated
                      </p>
                    </div>
                    {isPro ? (
                      <button onClick={processBatch}
                        className="download-pdf-btn">
                        <Archive size={14} /> Generate ZIP
                      </button>
                    ) : (
                      <Link href="/pricing" style={{
                        display: "inline-flex", alignItems: "center",
                        gap: "6px", height: "40px", padding: "0 16px",
                        background: "#F59E0B", color: "#fff",
                        borderRadius: "8px", fontSize: "13px",
                        fontWeight: 700, textDecoration: "none",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}>
                        <Lock size={13} /> Upgrade to Process
                      </Link>
                    )}
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table className="pdf-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          {csvData.headers.slice(0, 5).map(h => (
                            <th key={h}>{h}</th>
                          ))}
                          {csvData.headers.length > 5 && (
                            <th>+{csvData.headers.length - 5} more</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.rows.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            {csvData.headers.slice(0, 5).map(h => (
                              <td key={h} style={{
                                maxWidth: "120px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}>
                                {row[h] || "—"}
                              </td>
                            ))}
                            {csvData.headers.length > 5 && <td>...</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvData.rows.length > 5 && (
                      <p style={{
                        fontSize: "12px", color: "#9CA3AF",
                        fontFamily: "Inter, sans-serif",
                        textAlign: "center", margin: "8px 0 0",
                      }}>
                        Showing 5 of {csvData.rows.length} rows
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Processing */}
              {status === "processing" && (
                <div style={{
                  background: "#fff", border: "1px solid #E5E7EB",
                  borderRadius: "12px", padding: "32px",
                  textAlign: "center",
                }}>
                  <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "16px",
                    color: "#111827", margin: "0 0 16px",
                  }}>
                    Generating documents...
                  </p>
                  <div style={{
                    background: "#E5E7EB", borderRadius: "100px",
                    height: "8px", overflow: "hidden", marginBottom: "8px",
                  }}>
                    <div style={{
                      background: T,
                      height: "100%", borderRadius: "100px",
                      width: `${progress}%`,
                      transition: "width 200ms ease",
                    }} />
                  </div>
                  <p style={{
                    fontSize: "13px", color: "#9CA3AF",
                    fontFamily: "Inter, sans-serif",
                  }}>
                    {progress}% — Processing {csvData?.rows?.length} documents
                  </p>
                </div>
              )}

              {/* Done */}
              {status === "done" && (
                <div style={{
                  background: "#F0FDFA",
                  border: `2px solid ${T}`,
                  borderRadius: "12px", padding: "28px",
                  textAlign: "center",
                }}>
                  <CheckCircle size={40} color={T}
                    style={{ margin: "0 auto 12px", display: "block" }} />
                  <p style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700, fontSize: "18px",
                    color: "#065F46", margin: "0 0 6px",
                  }}>
                    {csvData?.rows?.length} Documents Generated!
                  </p>
                  <p style={{
                    fontSize: "13px", color: "#6B7280",
                    fontFamily: "Inter, sans-serif",
                    margin: "0 0 20px",
                  }}>
                    Your ZIP file is ready to download.
                  </p>
                  <button className="download-pdf-btn" style={{
                    margin: "0 auto",
                  }}>
                    <Download size={15} /> Download ZIP File
                  </button>
                </div>
              )}

              {/* How it works */}
              {status === "idle" && (
                <div style={{
                  background: "#fff", border: "1px solid #E5E7EB",
                  borderRadius: "12px", padding: "24px",
                }}>
                  <p className="form-label">How Batch Processing Works</p>
                  <div style={{
                    display: "flex", flexDirection: "column", gap: "16px",
                  }}>
                    {[
                      {
                        n: "1", icon: <FileText size={16} color={T} />,
                        t: "Select document type",
                        d: "Choose Invoice, Salary Slip, Certificate, etc."
                      },
                      {
                        n: "2", icon: <Download size={16} color={T} />,
                        t: "Download sample CSV",
                        d: "Get the template with all required columns."
                      },
                      {
                        n: "3", icon: <Upload size={16} color={T} />,
                        t: "Upload your filled CSV",
                        d: "Upload with all your data — up to 1000 rows."
                      },
                      {
                        n: "4", icon: <Archive size={16} color={T} />,
                        t: "Download ZIP",
                        d: "Get all PDFs in one organized ZIP file."
                      },
                    ].map((step) => (
                      <div key={step.n} style={{
                        display: "flex", gap: "12px",
                        alignItems: "flex-start",
                      }}>
                        <div style={{
                          width: "32px", height: "32px",
                          borderRadius: "8px", background: "#F0FDFA",
                          border: `1px solid ${T}20`,
                          display: "flex", alignItems: "center",
                          justifyContent: "center", flexShrink: 0,
                        }}>
                          {step.icon}
                        </div>
                        <div>
                          <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "13px",
                            color: "#111827", margin: "0 0 2px",
                          }}>{step.t}</p>
                          <p style={{
                            fontSize: "12px", color: "#6B7280",
                            fontFamily: "Inter, sans-serif", margin: 0,
                          }}>{step.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .batch-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}